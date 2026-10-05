import { Check, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import SpotlightCard from '../components/rb/SpotlightCard';
import { CategoryIcon, Empty, PageHeader, Price, ScoreBar, usePageMeta } from '../components/ui';
import { CATEGORY_META, CATEGORY_ORDER, PARTS, PRICES_UPDATED } from '../data/parts';
import type { Category, Part } from '../data/types';
import { shortSpec } from '../lib/specs';
import { useBuild } from '../state/build';
import NotFound from './NotFound';

function score(p: Part): { label: string; value: number } | null {
  if (p.category === 'cpu') return { label: 'الألعاب', value: p.gaming };
  if (p.category === 'gpu') return { label: 'الأداء', value: p.perf };
  return null;
}

export function PartCard({ p }: { p: Part }) {
  const { build, setPart } = useBuild();
  const inBuild = p.category === 'storage' ? build.storage.includes(p.id) : build[p.category] === p.id;
  const s = score(p);
  return (
    <SpotlightCard className="flex h-full flex-col !rounded-2xl !border-white/8 !bg-ink-900/80 !p-5" spotlightColor="rgba(61, 255, 176, 0.10)">
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-mint-400">
          <CategoryIcon category={p.category} size={19} />
        </span>
        {p.released >= '2025-06' && <span className="chip !border-gold-400/30 !text-gold-300">جديد</span>}
      </div>
      <p className="mt-4 text-xs text-white/40">{p.brand}</p>
      <Link to={`/part/${p.id}`} className="mt-0.5 font-semibold leading-7 text-white after:absolute after:inset-0 hover:text-mint-300">
        {p.name}
      </Link>
      <p className="mt-1 text-xs text-white/50">{shortSpec(p)}</p>
      {s && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[11px] text-white/45">
            <span>{s.label}</span>
            <span className="num">{s.value}</span>
          </div>
          <ScoreBar value={s.value} />
        </div>
      )}
      <div className="mt-auto flex items-center justify-between gap-2 pt-5">
        <Price value={p.price} />
        <button
          className={`relative z-10 ${inBuild ? 'btn-ghost !border-mint-400/40 !text-mint-300' : 'btn-ghost'} !px-3 !py-1.5 text-xs`}
          onClick={() => !inBuild && setPart(p.category, p.id)}
          aria-label={inBuild ? 'في تجميعتك' : `أضف ${p.name} للتجميعة`}
        >
          {inBuild ? <Check size={13} /> : <Plus size={13} />} {inBuild ? 'في تجميعتك' : 'أضف'}
        </button>
      </div>
    </SpotlightCard>
  );
}

export default function Parts() {
  const { category } = useParams();
  const cat = category as Category | undefined;
  const valid = !cat || CATEGORY_ORDER.includes(cat);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [max, setMax] = useState<number | ''>('');

  usePageMeta(cat && valid ? CATEGORY_META[cat].plural : 'كل القطع', 'تصفح أحدث قطع الكمبيوتر في السوق السعودي مع المواصفات والأسعار التقريبية بالريال.');

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PARTS.filter((p) => !cat || p.category === cat)
      .filter((p) => !term || `${p.brand} ${p.name}`.toLowerCase().includes(term))
      .filter((p) => max === '' || p.price <= max)
      .sort((a, b) => (sort === 'newest' ? b.released.localeCompare(a.released) : sort === 'price-asc' ? a.price - b.price : b.price - a.price));
  }, [cat, q, sort, max]);

  if (!valid) return <NotFound />;

  return (
    <div>
      <PageHeader eyebrow={`كتالوج القطع · ${PRICES_UPDATED}`} title={cat ? CATEGORY_META[cat].plural : 'كل القطع'}>
        أحدث القطع المتوفرة في السوق السعودي مع مواصفاتها وأسعارها التقريبية. اضغط على أي قطعة عشان تشوف تفاصيلها وروابط شرائها.
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <nav className="scrollbar-thin -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2" aria-label="الفئات">
          <NavLink end to="/parts" className={({ isActive }) => `chip shrink-0 !px-4 !py-2 !text-sm ${isActive ? '!border-mint-400/50 !bg-mint-400/10 !text-mint-300' : ''}`}>
            الكل
          </NavLink>
          {CATEGORY_ORDER.map((c) => (
            <NavLink key={c} to={`/parts/${c}`} className={({ isActive }) => `chip shrink-0 !px-4 !py-2 !text-sm ${isActive ? '!border-mint-400/50 !bg-mint-400/10 !text-mint-300' : ''}`}>
              <CategoryIcon category={c} size={14} /> {CATEGORY_META[c].plural}
            </NavLink>
          ))}
        </nav>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-white/35" />
            <input className="input !pr-10" placeholder="ابحث: RTX 5070، 9800X3D، Samsung…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="بحث" />
          </div>
          <input className="input sm:!w-48" type="number" inputMode="numeric" min={0} placeholder="أقصى سعر (ر.س)" value={max} onChange={(e) => setMax(e.target.value === '' ? '' : Number(e.target.value))} aria-label="أقصى سعر" />
          <select className="input sm:!w-48" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="الترتيب">
            <option value="newest">الأحدث أولًا</option>
            <option value="price-asc">الأرخص أولًا</option>
            <option value="price-desc">الأغلى أولًا</option>
          </select>
        </div>

        {list.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <div key={p.id} className="relative">
                <PartCard p={p} />
              </div>
            ))}
          </div>
        ) : (
          <Empty icon={<Search size={28} />} title="ما لقينا قطع بهذي المواصفات">
            جرّب كلمة بحث ثانية أو ارفع الحد الأقصى للسعر.
          </Empty>
        )}
      </div>
    </div>
  );
}
