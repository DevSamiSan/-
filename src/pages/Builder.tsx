import { Bot, Check, CircleX, Copy, Info, Plus, RotateCcw, Save, Share2, ShieldCheck, Trash2, TriangleAlert, X, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PartPicker from '../components/PartPicker';
import CountUp from '../components/rb/CountUp';
import ElectricBorder from '../components/rb/ElectricBorder';
import { CategoryIcon, PageHeader, Price, usePageMeta } from '../components/ui';
import { CATEGORY_META, CATEGORY_ORDER, getPart, PRICES_UPDATED } from '../data/parts';
import type { Category, Part } from '../data/types';
import { checkBuild, estimateWatts, gamingTiers, recommendedPsuWatts, resolveBuild, totalPrice, type Issue } from '../lib/compat';
import { sar, shortSpec } from '../lib/specs';
import { buildToQuery, isEmpty, queryToBuild, useBuild } from '../state/build';

const REQUIRED: Category[] = ['cpu', 'motherboard', 'ram', 'storage', 'psu', 'case'];

function IssueRow({ issue }: { issue: Issue }) {
  const s = {
    error: { icon: <CircleX size={16} />, cls: 'border-danger/30 bg-danger/[0.07] text-danger' },
    warning: { icon: <TriangleAlert size={16} />, cls: 'border-warn/30 bg-warn/[0.07] text-warn' },
    info: { icon: <Info size={16} />, cls: 'border-sky-400/25 bg-sky-400/[0.06] text-sky-300' },
  }[issue.level];
  return (
    <li className={`rounded-xl border px-3.5 py-3 ${s.cls}`}>
      <p className="flex items-center gap-2 text-sm font-semibold">
        {s.icon}
        {issue.title}
      </p>
      <p className="mt-1 text-xs leading-6 text-white/65">{issue.detail}</p>
    </li>
  );
}

function Slot({ category, part, index, onOpen, onRemove }: { category: Category; part?: Part; index?: number; onOpen: () => void; onRemove: () => void }) {
  const meta = CATEGORY_META[category];
  const optional = !REQUIRED.includes(category);
  return (
    <div className={`group flex items-center gap-4 rounded-2xl border p-4 transition-colors ${part ? 'border-white/8 bg-ink-900/80' : 'border-dashed border-white/12 bg-transparent hover:border-mint-400/40'}`}>
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${part ? 'bg-mint-400/12 text-mint-400' : 'bg-white/5 text-white/40'}`}>
        <CategoryIcon category={category} size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/45">
          {meta.label}
          {index !== undefined && index > 0 && ` ${index + 1}`}
          {optional && !part && <span className="text-white/30"> · اختياري</span>}
        </p>
        {part ? (
          <>
            <Link to={`/part/${part.id}`} className="block truncate font-semibold text-white hover:text-mint-300">
              {part.brand} {part.name}
            </Link>
            <p className="truncate text-xs text-white/50">{shortSpec(part)}</p>
          </>
        ) : (
          <p className="text-sm text-white/55">لم يتم الاختيار</p>
        )}
      </div>
      {part && <Price value={part.price} className="hidden text-sm sm:block" />}
      <div className="flex shrink-0 items-center gap-1.5">
        {part ? (
          <>
            <button className="btn-ghost !px-3 !py-2 text-xs" onClick={onOpen}>
              تغيير
            </button>
            <button className="btn-ghost !p-2 hover:!border-danger/40 hover:!text-danger" onClick={onRemove} aria-label={`إزالة ${meta.label}`}>
              <X size={15} />
            </button>
          </>
        ) : (
          <button className="btn-primary !px-3.5 !py-2 text-xs" onClick={onOpen}>
            <Plus size={14} /> اختر
          </button>
        )}
      </div>
    </div>
  );
}

export default function Builder() {
  usePageMeta('مجمّع القطع', 'اختر قطع جهازك، وSaudiPC يفحص التوافق ويحسب الطاقة والسعر بالريال لحظيًا.');
  const { build, setPart, removePart, loadBuild, clear, saved, saveCurrent, deleteSaved, maxStorage } = useBuild();
  const [picker, setPicker] = useState<Category | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saveName, setSaveName] = useState('');
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  // Load a shared build from the URL once, then clean the URL.
  useEffect(() => {
    const shared = queryToBuild(params.toString());
    if (shared) {
      loadBuild(shared);
      setParams({}, { replace: true });
      flash('تم تحميل التجميعة المشتركة');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  const r = useMemo(() => resolveBuild(build), [build]);
  const issues = useMemo(() => checkBuild(r), [r]);
  const total = totalPrice(r);
  const watts = estimateWatts(r);
  const recPsu = recommendedPsuWatts(r);
  const tiers = gamingTiers(r);
  const errors = issues.filter((i) => i.level === 'error');
  const missing = REQUIRED.filter((c) => (c === 'storage' ? build.storage.length === 0 : !build[c]));
  const complete = missing.length === 0 && errors.length === 0 && (r.gpu || r.cpu?.igpu);

  const shareUrl = `${window.location.origin}/build?${buildToQuery(build)}`;

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'تجميعتي على SaudiPC', url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      flash('تم نسخ رابط التجميعة');
    } catch {
      /* user cancelled */
    }
  }

  async function copyText() {
    const lines = CATEGORY_ORDER.flatMap((c) => {
      if (c === 'storage') return r.storage.map((p) => `${CATEGORY_META[c].label}: ${p.brand} ${p.name} — ${sar(p.price)}`);
      const p = r[c];
      return p ? [`${CATEGORY_META[c].label}: ${p.brand} ${p.name} — ${sar(p.price)}`] : [];
    });
    const text = `تجميعتي من SaudiPC\n${lines.join('\n')}\n\nالإجمالي التقريبي: ${sar(total)}\n${shareUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      flash('تم نسخ قائمة القطع');
    } catch {
      flash('ما قدرنا ننسخ — انسخ الرابط يدويًا');
    }
  }

  function askAssistant() {
    navigate('/assistant', { state: { prompt: 'راجع تجميعتي الحالية: هل هي متوازنة؟ وش تقترح أغيّر عشان أحصل على أداء أفضل بنفس الميزانية أو أقل؟', attachBuild: true } });
  }

  const watt = Math.min(100, (watts / Math.max(r.psu?.watts ?? recPsu, 1)) * 100);

  return (
    <div>
      <PageHeader eyebrow="مجمّع القطع" title="جمّع جهازك قطعة قطعة">
        اختر القطع، وإحنا نفحص التوافق ونحسب الطاقة والسعر لحظيًا. التجميعة تنحفظ تلقائيًا في متصفحك.
      </PageHeader>

      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-6 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* SLOTS */}
        <section aria-label="القطع" className="flex flex-col gap-3">
          {CATEGORY_ORDER.map((c) =>
            c === 'storage' ? (
              <div key={c} className="flex flex-col gap-3">
                {r.storage.map((p, i) => (
                  <Slot key={`${p.id}-${i}`} category="storage" part={p} index={i} onOpen={() => setPicker('storage')} onRemove={() => removePart('storage', i)} />
                ))}
                {r.storage.length === 0 && <Slot category="storage" onOpen={() => setPicker('storage')} onRemove={() => {}} />}
                {r.storage.length > 0 && r.storage.length < maxStorage && (
                  <button className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 py-3 text-sm text-white/55 hover:border-mint-400/40 hover:text-mint-300" onClick={() => setPicker('storage')}>
                    <Plus size={15} /> أضف قرص تخزين آخر
                  </button>
                )}
              </div>
            ) : (
              <Slot key={c} category={c} part={r[c]} onOpen={() => setPicker(c)} onRemove={() => removePart(c)} />
            ),
          )}

          {!isEmpty(build) && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="btn-ghost text-xs" onClick={clear}>
                <RotateCcw size={14} /> ابدأ من جديد
              </button>
              <Link to="/builds" className="btn-ghost text-xs">
                حمّل تجميعة جاهزة
              </Link>
            </div>
          )}
          {isEmpty(build) && (
            <div className="mt-2 rounded-2xl border border-white/8 bg-ink-900/60 p-5 text-sm leading-7 text-white/60">
              مو عارف من وين تبدأ؟ ابدأ بـ <strong className="text-white">المعالج</strong> و<strong className="text-white">كرت الشاشة</strong>، أو{' '}
              <Link to="/builds" className="text-mint-400 underline">حمّل تجميعة جاهزة</Link> وعدّل عليها.
            </div>
          )}

          {saved.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-semibold text-white">تجميعاتي المحفوظة</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {saved.map((s) => {
                  const sr = resolveBuild(s.build);
                  return (
                    <li key={s.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-ink-900/60 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white">{s.name}</p>
                        <p className="truncate text-xs text-white/45">
                          {[sr.cpu?.name, sr.gpu?.name].filter(Boolean).join(' · ') || 'تجميعة'} · {sar(totalPrice(sr))}
                        </p>
                      </div>
                      <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => { loadBuild(s.build); flash(`تم تحميل «${s.name}»`); }}>
                        تحميل
                      </button>
                      <button className="btn-ghost !p-1.5 hover:!text-danger" onClick={() => deleteSaved(s.id)} aria-label={`حذف ${s.name}`}>
                        <Trash2 size={14} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

        {/* SUMMARY */}
        <aside className="lg:sticky lg:top-20 lg:self-start" aria-label="ملخص التجميعة">
          <div className="flex flex-col gap-4">
            <SummaryCard complete={!!complete}>
              <p className="text-xs text-white/45">الإجمالي التقريبي</p>
              <p className="mt-1 text-4xl font-bold text-white">
                <span className="num"><CountUp key={total} from={0} to={Math.round(total)} duration={0.6} separator="," /></span> <span className="text-lg text-white/50">ر.س</span>
              </p>
              <p className="mt-1 text-[11px] text-white/35">أسعار السوق السعودي التقريبية · <span className="num">{PRICES_UPDATED}</span></p>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-white/55">
                    <Zap size={13} className="text-gold-400" /> الاستهلاك المتوقع
                  </span>
                  <span className="num text-white/80">
                    {watts}W {r.psu ? `/ ${r.psu.watts}W` : ''}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${watt > 85 ? 'bg-danger' : watt > 70 ? 'bg-warn' : 'bg-linear-to-l from-mint-300 to-mint-600'}`}
                    style={{ width: `${Math.max(watt, watts ? 4 : 0)}%` }}
                  />
                </div>
                {watts > 0 && <p className="mt-1.5 text-xs text-white/45">المزود المقترح: <span className="num text-white/75">{recPsu}W</span> أو أكثر</p>}
              </div>

              <div className={`mt-5 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${complete ? 'bg-mint-400/10 text-mint-300' : errors.length ? 'bg-danger/10 text-danger' : 'bg-white/5 text-white/60'}`}>
                {complete ? <ShieldCheck size={17} /> : errors.length ? <CircleX size={17} /> : <Info size={17} />}
                {complete
                  ? 'التجميعة متوافقة وجاهزة'
                  : errors.length
                    ? `${errors.length} مشكلة توافق`
                    : missing.length
                      ? `باقي: ${missing.map((m) => CATEGORY_META[m].label).join('، ')}`
                      : 'أضف كرت شاشة'}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="btn-ghost text-xs" onClick={share} disabled={isEmpty(build)}>
                  <Share2 size={14} /> مشاركة
                </button>
                <button className="btn-ghost text-xs" onClick={copyText} disabled={isEmpty(build)}>
                  <Copy size={14} /> نسخ القائمة
                </button>
                <button className="btn-primary col-span-2 text-sm" onClick={askAssistant} disabled={isEmpty(build)}>
                  <Bot size={16} /> خل المساعد يراجع تجميعتي
                </button>
              </div>

              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveCurrent(saveName);
                  setSaveName('');
                  flash('تم حفظ التجميعة');
                }}
              >
                <input className="input !py-2 text-xs" placeholder="اسم التجميعة (اختياري)" value={saveName} onChange={(e) => setSaveName(e.target.value)} maxLength={40} disabled={isEmpty(build)} />
                <button className="btn-ghost shrink-0 text-xs" disabled={isEmpty(build)}>
                  <Save size={14} /> حفظ
                </button>
              </form>
            </SummaryCard>

            {tiers && (
              <div className="panel p-5">
                <h2 className="mb-3 text-sm font-semibold text-white">قدرة الألعاب المتوقعة</h2>
                <ul className="space-y-2.5">
                  {tiers.map((t) => (
                    <li key={t.res} className="flex items-center justify-between gap-3 text-sm">
                      <span className="num w-14 font-semibold text-white">{t.res}</span>
                      <span
                        className={`flex-1 rounded-lg px-2.5 py-1 text-xs ${
                          { great: 'bg-mint-400/12 text-mint-300', good: 'bg-sky-400/10 text-sky-300', ok: 'bg-warn/10 text-warn', bad: 'bg-danger/10 text-danger' }[t.tier.tone]
                        }`}
                      >
                        {t.tier.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] leading-5 text-white/35">تقدير عام مبني على مؤشرات أداء نسبية. الأداء الفعلي يختلف من لعبة للثانية.</p>
              </div>
            )}

            {issues.length > 0 && (
              <div className="panel p-5">
                <h2 className="mb-3 text-sm font-semibold text-white">ملاحظات التوافق</h2>
                <ul className="space-y-2">
                  {issues
                    .slice()
                    .sort((a, b) => ['error', 'warning', 'info'].indexOf(a.level) - ['error', 'warning', 'info'].indexOf(b.level))
                    .map((i) => (
                      <IssueRow key={i.title} issue={i} />
                    ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      {picker && (
        <PartPicker
          category={picker}
          build={build}
          onClose={() => setPicker(null)}
          onPick={(id) => {
            setPart(picker, id);
            setPicker(null);
            flash(`تمت إضافة ${getPart(id)?.name ?? ''}`);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-mint-400/30 bg-ink-850 px-4 py-2.5 text-sm text-white shadow-xl" role="status">
          <Check size={15} className="text-mint-400" /> {toast}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ complete, children }: { complete: boolean; children: React.ReactNode }) {
  const inner = <div className="rounded-[18px] bg-ink-900 p-5">{children}</div>;
  if (!complete) return <div className="rounded-[20px] border border-white/8 bg-ink-900">{inner}</div>;
  return (
    <ElectricBorder color="#3dffb0" speed={0.8} chaos={0.08} borderRadius={20}>
      {inner}
    </ElectricBorder>
  );
}
