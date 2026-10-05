import { Bot, Check, Copy, Paperclip, Plus, RotateCcw, Send, Sparkles, Square, User } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Markdown from '../components/Markdown';
import Aurora from '../components/rb/Aurora';
import ShinyText from '../components/rb/ShinyText';
import { usePageMeta } from '../components/ui';
import { CATEGORY_META, CATEGORY_ORDER } from '../data/parts';
import { checkBuild, estimateWatts, resolveBuild, totalPrice } from '../lib/compat';
import { load, save } from '../lib/storage';
import { isEmpty, useBuild } from '../state/build';
import type { Build } from '../data/types';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

const SUGGESTIONS = [
  'عندي 8000 ريال وأبي ألعب على 1440p، وش أفضل تجميعة؟',
  'RX 9070 XT أو RTX 5070 Ti؟ وش الفرق اللي يستاهل؟',
  'هل أشتري رامات الحين أو أنتظر الأسعار تنزل؟',
  'أبي جهاز للمونتاج والبث بميزانية 12 ألف',
  'كم واط أحتاج لـ RTX 5080 مع 9800X3D؟',
  'وش أفضل معالج للألعاب في 2026؟',
];

function buildSummary(b: Build): string | undefined {
  if (isEmpty(b)) return undefined;
  const r = resolveBuild(b);
  const lines = CATEGORY_ORDER.flatMap((c) => {
    if (c === 'storage') return r.storage.map((p) => `- ${CATEGORY_META[c].label}: [${p.id}] ${p.brand} ${p.name} (${p.price} ر.س)`);
    const p = r[c];
    return p ? [`- ${CATEGORY_META[c].label}: [${p.id}] ${p.brand} ${p.name} (${p.price} ر.س)`] : [`- ${CATEGORY_META[c].label}: (غير محدد)`];
  });
  const issues = checkBuild(r).filter((i) => i.level !== 'info').map((i) => `- ${i.level === 'error' ? 'خطأ' : 'تحذير'}: ${i.title}`);
  return `${lines.join('\n')}\n- الإجمالي التقريبي: ${totalPrice(r)} ر.س\n- الاستهلاك المتوقع: ${estimateWatts(r)}W${issues.length ? `\nملاحظات الفحص:\n${issues.join('\n')}` : ''}`;
}

export default function Assistant() {
  usePageMeta('المساعد الذكي', 'مساعد ذكي بالعربي يرشح لك تجميعة كمبيوتر حسب ميزانيتك واستخدامك، مدعوم بـ DeepSeek.');
  const { build } = useBuild();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>(() => load<Msg[]>('spc.chat', []));
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [attach, setAttach] = useState(() => !isEmpty(build));
  const [copied, setCopied] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickRef = useRef(true);

  useEffect(() => {
    if (!busy) save('spc.chat', messages.slice(-40));
  }, [messages, busy]);

  // Keep the newest tokens in view unless the user scrolled up.
  useEffect(() => {
    const el = listRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const send = useCallback(
    async (text: string, history?: Msg[]) => {
      const content = text.trim();
      if (!content || busy) return;
      const base = (history ?? messages).filter((m) => !m.error);
      const next: Msg[] = [...base, { role: 'user', content }];
      setMessages([...next, { role: 'assistant', content: '' }]);
      setInput('');
      setBusy(true);
      setThinking(true);
      stickRef.current = true;
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const fail = (m: string) =>
        setMessages((cur) => {
          const copy = [...cur];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = last?.content ? { ...last, content: `${last.content}\n\n_${m}_` } : { role: 'assistant', content: m, error: true };
          return copy;
        });

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: next.map(({ role, content: c }) => ({ role, content: c })), build: attach ? buildSummary(build) : undefined }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const j = (await res.json().catch(() => null)) as { error?: string } | null;
          fail(j?.error ?? 'تعذّر الوصول للمساعد. تأكد من اتصالك وحاول مرة ثانية.');
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let i;
          while ((i = buf.indexOf('\n\n')) >= 0) {
            const chunk = buf.slice(0, i).trim();
            buf = buf.slice(i + 2);
            if (!chunk.startsWith('data:')) continue;
            const ev = JSON.parse(chunk.slice(5)) as { t: string; c?: string; m?: string };
            if (ev.t === 'delta' && ev.c) {
              setThinking(false);
              setMessages((cur) => {
                const copy = [...cur];
                copy[copy.length - 1] = { role: 'assistant', content: copy[copy.length - 1].content + ev.c };
                return copy;
              });
            } else if (ev.t === 'error') {
              fail(ev.m ?? 'صار خطأ.');
            }
          }
        }
      } catch (e) {
        if ((e as Error).name !== 'AbortError') fail('انقطع الاتصال. حاول مرة ثانية.');
      } finally {
        setBusy(false);
        setThinking(false);
        abortRef.current = null;
        setMessages((cur) => {
          const last = cur[cur.length - 1];
          return last?.role === 'assistant' && !last.content ? cur.slice(0, -1) : cur;
        });
        inputRef.current?.focus();
      }
    },
    [attach, build, busy, messages],
  );

  // Prompts handed over from other pages (builder, guides).
  useEffect(() => {
    const st = location.state as { prompt?: string; attachBuild?: boolean } | null;
    if (st?.prompt) {
      navigate(location.pathname, { replace: true, state: null });
      if (st.attachBuild) {
        setAttach(true);
        // attach flag is read inside send; wait a tick for state to apply
        window.setTimeout(() => void send(st.prompt!), 0);
      } else {
        setInput(st.prompt);
        inputRef.current?.focus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    abortRef.current?.abort();
  }

  function reset() {
    stop();
    setMessages([]);
    save('spc.chat', []);
    inputRef.current?.focus();
  }

  function retry() {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    const idx = messages.lastIndexOf(lastUser);
    void send(lastUser.content, messages.slice(0, idx));
  }

  async function copy(i: number, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  }

  const empty = messages.length === 0;
  const lastIsError = messages[messages.length - 1]?.error;

  return (
    <div className="relative mx-auto flex h-[calc(100dvh-4rem)] max-w-4xl flex-col px-3 md:px-6">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] opacity-35" aria-hidden="true">
        <Aurora colorStops={['#0a8f5a', '#3dffb0', '#0b2219']} amplitude={0.9} blend={0.6} speed={0.6} />
      </div>

      <div className="flex items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-400 text-ink-950">
            <Bot size={20} />
          </span>
          <div>
            <h1 className="font-bold text-white">مساعد SaudiPC</h1>
            <p className="text-xs text-white/45">
              مدعوم بـ <span className="ltr">DeepSeek V4</span> · يعرف أسعار السوق السعودي
            </p>
          </div>
        </div>
        {!empty && (
          <button className="btn-ghost !px-3 !py-2 text-xs" onClick={reset}>
            <Plus size={14} /> محادثة جديدة
          </button>
        )}
      </div>

      <div
        ref={listRef}
        className="scrollbar-thin flex-1 overflow-y-auto pb-4"
        onScroll={(e) => {
          const el = e.currentTarget;
          stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        aria-live="polite"
      >
        {empty ? (
          <div className="flex min-h-full flex-col items-center justify-center py-8 text-center">
            <Sparkles size={34} className="text-mint-400" />
            <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">
              <ShinyText text="وش تبي تسوي بجهازك؟" speed={3} color="#d6e5de" shineColor="#3dffb0" />
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/55">قل لي ميزانيتك واستخدامك، وأرشح لك تجميعة كاملة من قطع متوفرة بالسوق مع الأسعار بالريال.</p>
            <div className="mt-8 grid grid-cols-1 w-full gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => void send(s)} className="rounded-2xl border border-white/8 bg-ink-900/70 px-4 py-3 text-start text-sm leading-6 text-white/75 backdrop-blur transition hover:border-mint-400/40 hover:text-white">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-5 pt-2">
            {messages.map((m, i) => (
              <li key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${m.role === 'user' ? 'bg-white/8 text-white/70' : 'bg-mint-400/15 text-mint-400'}`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </span>
                <div className={`group min-w-0 ${m.role === 'user' ? 'max-w-[85%]' : 'flex-1'}`}>
                  {m.role === 'user' ? (
                    <p className="rounded-2xl rounded-tl-md bg-mint-400/12 px-4 py-3 text-sm leading-7 whitespace-pre-wrap text-white">{m.content}</p>
                  ) : m.content ? (
                    <div className={`rounded-2xl rounded-tr-md border px-4 py-3 text-sm ${m.error ? 'border-danger/30 bg-danger/[0.06] text-danger' : 'border-white/6 bg-ink-900/80 text-white/85'}`}>
                      <Markdown className="prose-chat">{m.content}</Markdown>
                      {!m.error && !(busy && i === messages.length - 1) && (
                        <button onClick={() => void copy(i, m.content)} className="mt-2 flex items-center gap-1 text-xs text-white/35 opacity-0 transition group-hover:opacity-100 hover:text-white/70 focus:opacity-100">
                          {copied === i ? <Check size={12} /> : <Copy size={12} />} {copied === i ? 'تم النسخ' : 'نسخ'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-2xl rounded-tr-md border border-white/6 bg-ink-900/80 px-4 py-3.5 text-sm text-white/55">
                      <span className="flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-mint-400" style={{ animationDelay: `${d * 120}ms` }} />
                        ))}
                      </span>
                      {thinking ? 'يفكر…' : ''}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pb-4">
        {lastIsError && !busy && (
          <button onClick={retry} className="btn-ghost mb-2 text-xs">
            <RotateCcw size={13} /> أعد المحاولة
          </button>
        )}
        <form
          className="glass rounded-2xl p-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="اكتب سؤالك… مثلًا: تجميعة 6000 ريال للألعاب"
            className="max-h-40 min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
            maxLength={4000}
            aria-label="رسالتك"
          />
          <div className="flex items-center justify-between gap-2 px-1">
            <label className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition ${attach && !isEmpty(build) ? 'text-mint-300' : 'text-white/45'} ${isEmpty(build) ? 'cursor-not-allowed opacity-50' : 'hover:bg-white/5'}`}>
              <input type="checkbox" className="sr-only" checked={attach && !isEmpty(build)} disabled={isEmpty(build)} onChange={(e) => setAttach(e.target.checked)} />
              <Paperclip size={13} /> {isEmpty(build) ? 'ما فيه تجميعة في المجمّع' : attach ? 'تجميعتي مرفقة' : 'أرفق تجميعتي'}
            </label>
            {busy ? (
              <button type="button" onClick={stop} className="btn-ghost !px-3 !py-2 text-xs">
                <Square size={13} /> إيقاف
              </button>
            ) : (
              <button type="submit" className="btn-primary !px-3.5 !py-2 text-xs" disabled={!input.trim()}>
                إرسال <Send size={13} className="-scale-x-100" />
              </button>
            )}
          </div>
        </form>
        <p className="mt-2 text-center text-[11px] text-white/30">المساعد ممكن يغلط. تأكد من الأسعار والمواصفات قبل الشراء.</p>
      </div>
    </div>
  );
}
