import { ArrowLeft, Check, Wrench } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedContent from '../components/rb/AnimatedContent';
import SpotlightCard from '../components/rb/SpotlightCard';
import { CategoryIcon, PageHeader, Price, usePageMeta } from '../components/ui';
import { CURATED } from '../data/builds';
import { CATEGORY_META, CATEGORY_ORDER, PRICES_UPDATED } from '../data/parts';
import { estimateWatts, gamingTiers, resolveBuild, totalPrice } from '../lib/compat';
import { useBuild } from '../state/build';

export default function Builds() {
  usePageMeta('تجميعات جاهزة', 'تجميعات كمبيوتر مجرّبة ومفحوصة التوافق لكل ميزانية بأسعار السوق السعودي.');
  const { loadBuild } = useBuild();
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  }, [hash]);

  const sorted = [...CURATED].sort((a, b) => totalPrice(resolveBuild(a.build)) - totalPrice(resolveBuild(b.build)));

  return (
    <div>
      <PageHeader eyebrow={`تجميعات مجرّبة · ${PRICES_UPDATED}`} title="تجميعات جاهزة لكل ميزانية">
        كل تجميعة هنا مفحوصة التوافق وموزونة بين المعالج والكرت. حمّلها في المجمّع وعدّل عليها لين توصل للتجميعة اللي تناسبك.
      </PageHeader>

      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-6 px-4 md:px-6 lg:grid-cols-2">
        {sorted.map((b, i) => {
          const r = resolveBuild(b.build);
          const tiers = gamingTiers(r);
          return (
            <AnimatedContent key={b.id} distance={40} delay={(i % 2) * 0.08} duration={0.7}>
              <SpotlightCard className="h-full scroll-mt-24 !rounded-3xl !border-white/8 !bg-ink-900/85 !p-0" spotlightColor="rgba(61, 255, 176, 0.10)">
                <article id={b.id} className="flex h-full flex-col p-6 md:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip" style={{ color: b.accent, borderColor: `${b.accent}50`, background: `${b.accent}12` }}>
                      {b.target}
                    </span>
                    <span className="chip">{b.audience}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">{b.name}</h2>
                  <p className="mt-1 text-white/55">{b.tagline}</p>

                  <ul className="mt-6 divide-y divide-white/5 rounded-2xl border border-white/6 bg-ink-950/40">
                    {CATEGORY_ORDER.flatMap((c) => {
                      const items = c === 'storage' ? r.storage : r[c] ? [r[c]!] : [];
                      return items.map((p, idx) => (
                        <li key={`${c}-${idx}`} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                          <CategoryIcon category={c} size={15} className="shrink-0 text-white/35" />
                          <span className="w-24 shrink-0 text-xs text-white/40">{CATEGORY_META[c].label}</span>
                          <span className="min-w-0 flex-1 truncate text-white/85">{p.name}</span>
                          <span className="num hidden text-xs text-white/50 sm:block">{p.price.toLocaleString('en')}</span>
                        </li>
                      ));
                    })}
                    {!r.cooler && r.cpu?.coolerIncluded && (
                      <li className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <CategoryIcon category="cooler" size={15} className="shrink-0 text-white/35" />
                        <span className="w-24 shrink-0 text-xs text-white/40">مبرد المعالج</span>
                        <span className="flex-1 text-white/60">المرفق مع المعالج</span>
                      </li>
                    )}
                  </ul>

                  <ul className="mt-5 space-y-2">
                    {b.why.map((w) => (
                      <li key={w} className="flex items-start gap-2 text-sm leading-6 text-white/70">
                        <Check size={15} className="mt-1 shrink-0 text-mint-400" /> {w}
                      </li>
                    ))}
                  </ul>

                  {tiers && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {tiers.map((t) => (
                        <span key={t.res} className={`chip ${t.tier.tone === 'great' ? '!border-mint-400/30 !text-mint-300' : t.tier.tone === 'good' ? '!border-sky-400/30 !text-sky-300' : t.tier.tone === 'ok' ? '!border-warn/30 !text-warn' : '!border-danger/30 !text-danger'}`}>
                          <span className="num">{t.res}</span> · {t.tier.label.split(' — ')[0]}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
                    <div>
                      <p className="text-xs text-white/45">الإجمالي التقريبي</p>
                      <Price value={totalPrice(r)} className="text-3xl" />
                      <p className="num mt-0.5 text-[11px] text-white/35">~{estimateWatts(r)}W</p>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        loadBuild(b.build);
                        navigate('/build');
                      }}
                    >
                      <Wrench size={16} /> حمّلها في المجمّع <ArrowLeft size={16} />
                    </button>
                  </div>
                </article>
              </SpotlightCard>
            </AnimatedContent>
          );
        })}
      </div>
    </div>
  );
}
