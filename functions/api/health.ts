import { resolveModel, type Env } from '../../server/deepseek';

/** Lightweight status check: is the assistant configured and which model will it use? */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const configured = Boolean(env.DEEPSEEK_API_KEY);
  let model: string | null = null;
  let reachable = false;
  if (configured) {
    try {
      const r = await fetch('https://api.deepseek.com/models', { headers: { Authorization: `Bearer ${env.DEEPSEEK_API_KEY}` } });
      reachable = r.ok;
      model = (await resolveModel(env, true))[0];
    } catch {
      reachable = false;
    }
  }
  return new Response(JSON.stringify({ ok: configured && reachable, configured, reachable, model }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
