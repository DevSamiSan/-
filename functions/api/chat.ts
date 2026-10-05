import { resolveModel, systemPrompt, type Env } from '../../server/deepseek';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 4000;
const MAX_TOTAL_CHARS = 24000;
const MAX_BUILD_CHARS = 2500;

// Best-effort per-isolate rate limit (no KV writes, so it never hits KV quotas).
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 30;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > LIMIT;
}

function allowedOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // same-origin navigations/fetches without Origin
  try {
    const o = new URL(origin);
    const self = new URL(request.url);
    return (
      o.host === self.host ||
      o.hostname === 'saudipc.dev' ||
      o.hostname === 'www.saudipc.dev' ||
      o.hostname.endsWith('.saudipc.pages.dev') ||
      o.hostname === 'saudipc.pages.dev' ||
      o.hostname === 'localhost' ||
      o.hostname === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

function validate(body: unknown): { messages: ChatMessage[]; build?: string } | string {
  if (!body || typeof body !== 'object') return 'طلب غير صالح';
  const { messages, build } = body as { messages?: unknown; build?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return 'ما فيه رسائل';
  const clean: ChatMessage[] = [];
  for (const m of messages.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== 'object') return 'رسالة غير صالحة';
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return 'رسالة غير صالحة';
    const c = content.trim().slice(0, MAX_MESSAGE_CHARS);
    if (c) clean.push({ role, content: c });
  }
  while (clean.length && clean[0].role !== 'user') clean.shift();
  if (!clean.length || clean[clean.length - 1].role !== 'user') return 'آخر رسالة لازم تكون من المستخدم';
  let total = clean.reduce((s, m) => s + m.content.length, 0);
  while (total > MAX_TOTAL_CHARS && clean.length > 1) total -= clean.shift()!.content.length;
  return { messages: clean, build: typeof build === 'string' ? build.slice(0, MAX_BUILD_CHARS) : undefined };
}

const encoder = new TextEncoder();
const event = (obj: unknown) => encoder.encode(`data: ${JSON.stringify(obj)}\n\n`);

/** Converts DeepSeek's OpenAI-style SSE into a small, stable event format for the client. */
function relay(upstream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  let buffer = '';
  let thinkingSent = false;
  return new ReadableStream({
    async start(controller) {
      const reader = upstream.getReader();
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buffer.indexOf('\n')) >= 0) {
            const line = buffer.slice(0, idx).trim();
            buffer = buffer.slice(idx + 1);
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]') continue;
            try {
              const j = JSON.parse(data) as { choices?: { delta?: { content?: string | null; reasoning_content?: string | null } }[] };
              const delta = j.choices?.[0]?.delta;
              if (delta?.reasoning_content && !thinkingSent) {
                thinkingSent = true;
                controller.enqueue(event({ t: 'think' }));
              }
              if (delta?.content) controller.enqueue(event({ t: 'delta', c: delta.content }));
            } catch {
              /* ignore keep-alive or partial lines */
            }
          }
        }
        controller.enqueue(event({ t: 'done' }));
      } catch {
        controller.enqueue(event({ t: 'error', m: 'انقطع الاتصال بالمساعد. حاول مرة ثانية.' }));
      } finally {
        controller.close();
      }
    },
  });
}

const handlePost: PagesFunction<Env> = async ({ request, env }) => {
  if (!allowedOrigin(request)) return json(403, { error: 'غير مسموح' });
  if (!env.DEEPSEEK_API_KEY) return json(503, { error: 'المساعد غير مفعّل حاليًا.' });

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (rateLimited(ip)) return json(429, { error: 'أرسلت رسائل كثيرة بوقت قصير. انتظر شوي وحاول مرة ثانية.' });

  let parsed: ReturnType<typeof validate>;
  try {
    parsed = validate(await request.json());
  } catch {
    return json(400, { error: 'طلب غير صالح' });
  }
  if (typeof parsed === 'string') return json(400, { error: parsed });

  const messages = [{ role: 'system', content: systemPrompt(parsed.build) }, ...parsed.messages];
  const models = await resolveModel(env);

  let lastStatus = 0;
  for (const model of models) {
    const upstream = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true, temperature: 0.6, max_tokens: 2000 }),
    });
    if (upstream.ok && upstream.body) {
      return new Response(relay(upstream.body), {
        headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Model': model },
      });
    }
    lastStatus = upstream.status;
    const text = await upstream.text().catch(() => '');
    // Only try the next model when this one is unknown; other errors are final.
    const modelProblem = (upstream.status === 400 || upstream.status === 404) && /model/i.test(text);
    if (!modelProblem) break;
  }

  const msg =
    lastStatus === 401
      ? 'مفتاح المساعد غير صالح. تواصل مع إدارة الموقع.'
      : lastStatus === 402
        ? 'رصيد المساعد خلص. تواصل مع إدارة الموقع.'
        : lastStatus === 429
          ? 'المساعد مشغول الحين. حاول بعد شوي.'
          : 'صار خطأ في المساعد. حاول مرة ثانية.';
  return json(502, { error: msg });
};

export const onRequest: PagesFunction<Env> = async (ctx) =>
  ctx.request.method === 'POST' ? handlePost(ctx) : json(405, { error: 'Method not allowed' });
