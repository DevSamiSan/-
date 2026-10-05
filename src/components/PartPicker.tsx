import { Check, Search, TriangleAlert, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORY_META, partsIn } from '../data/parts';
import type { Build, Category, Part } from '../data/types';
import { checkBuild, resolveBuild } from '../lib/compat';
import { shortSpec } from '../lib/specs';
import { CategoryIcon, Price } from './ui';

type Sort = 'popular' | 'price-asc' | 'price-desc' | 'newest' | 'perf';

function perfOf(p: Part): number {
  switch (p.category) {
    case 'cpu':
      return p.gaming * 2 + p.multi;
    case 'gpu':
      return p.perf;
    case 'ram':
      return p.capacityGB * 100 + p.speed / p.cl;
    case 'storage':
      return p.readMBs;
    case 'psu':
      return p.watts;
    case 'cooler':
      return p.ratedW;
    case 'case':
      return p.maxGpuMM;
    case 'motherboard':
      return p.m2Slots * 100 + p.memMaxMTs / 100;
  }
}

/** Errors this candidate would introduce into the current build. */
function conflictsFor(build: Build, category: Category, id: string): string[] {
  const base: Build = category === 'storage' ? build : { ...build, [category]: undefined };
  const withPart: Build = category === 'storage' ? { ...build, storage: [...build.storage, id] } : { ...build, [category]: id };
  const before = new Set(checkBuild(resolveBuild(base)).filter((i) => i.level === 'error').map((i) => i.title));
  return checkBuild(resolveBuild(withPart))
    .filter((i) => i.level === 'error' && !before.has(i.title) && i.title !== 'المعالج يحتاج مبرد' && i.title !== 'ما فيه مخرج صورة')
    .map((i) => i.title);
}

export default function PartPicker({
  category,
  build,
  onPick,
  onClose,
}: {
  category: Category;
  build: Build;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('all');
  const [sort, setSort] = useState<Sort>('popular');
  const [onlyCompatible, setOnlyCompatible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const all = useMemo(() => partsIn(category) as Part[], [category]);
  const brands = useMemo(() => [...new Set(all.map((p) => p.brand))], [all]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = all
      .filter((p) => brand === 'all' || p.brand === brand)
      .filter((p) => !term || `${p.brand} ${p.name}`.toLowerCase().includes(term))
      .map((p) => ({ p, conflicts: conflictsFor(build, category, p.id) }));
    if (onlyCompatible) list = list.filter((r) => r.conflicts.length === 0);
    const sorters: Record<Sort, (a: Part, b: Part) => number> = {
      popular: () => 0,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      newest: (a, b) => b.released.localeCompare(a.released),
      perf: (a, b) => perfOf(b) - perfOf(a),
    };
    return [...list].sort((a, b) => sorters[sort](a.p, b.p));
  }, [all, brand, q, sort, onlyCompatible, build, category]);

  const hidden = onlyCompatible ? all.length - rows.length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`اختر ${CATEGORY_META[category].label}`}>
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-label="إغلاق" tabIndex={-1} />
      <div className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-ink-900 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-400/10 text-mint-400">
              <CategoryIcon category={category} size={20} />
            </span>
            <div>
              <h2 className="font-bold text-white">اختر {CATEGORY_META[category].label}</h2>
              <p className="text-xs text-white/45">{rows.length} خيار{hidden > 0 && ` · ${hidden} مخفي لعدم التوافق`}</p>
            </div>
          </div>
          <button className="btn-ghost !p-2" onClick={onClose} aria-label="إغلاق">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-white/8 px-5 py-4">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-white/35" />
            <input ref={inputRef} className="input !pr-10" placeholder="ابحث بالاسم أو الموديل…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="input !w-auto !py-2" value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="الشركة">
              <option value="all">كل الشركات</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <select className="input !w-auto !py-2" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="الترتيب">
              <option value="popular">الترتيب المقترح</option>
              <option value="perf">الأقوى أولًا</option>
              <option value="price-asc">الأرخص أولًا</option>
              <option value="price-desc">الأغلى أولًا</option>
              <option value="newest">الأحدث أولًا</option>
            </select>
            <label className="ms-auto flex cursor-pointer items-center gap-2 text-sm text-white/65">
              <input type="checkbox" className="h-4 w-4 accent-mint-400" checked={onlyCompatible} onChange={(e) => setOnlyCompatible(e.target.checked)} />
              المتوافق فقط
            </label>
          </div>
        </div>

        <ul className="scrollbar-thin flex-1 divide-y divide-white/5 overflow-y-auto">
          {rows.map(({ p, conflicts }) => {
            const selected = category === 'storage' ? false : build[category] === p.id;
            return (
              <li key={p.id}>
                <button
                  onClick={() => onPick(p.id)}
                  className={`flex w-full items-center gap-4 px-5 py-4 text-start transition-colors hover:bg-white/[0.03] ${selected ? 'bg-mint-400/[0.06]' : ''}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40">{p.brand}</span>
                      {p.released >= '2025-06' && <span className="chip !border-gold-400/30 !py-0 !text-[10px] !text-gold-300">جديد</span>}
                    </div>
                    <p className="truncate font-semibold text-white">{p.name}</p>
                    <p className="mt-0.5 text-xs text-white/50">{shortSpec(p)}</p>
                    {conflicts.length > 0 && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-danger">
                        <TriangleAlert size={12} /> {conflicts[0]}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <Price value={p.price} />
                    <span className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${selected ? 'bg-mint-400 text-ink-950' : 'bg-white/6 text-white/80'}`}>
                      {selected ? (
                        <>
                          <Check size={12} /> مختار
                        </>
                      ) : (
                        'اختر'
                      )}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
          {rows.length === 0 && (
            <li className="px-5 py-14 text-center text-sm text-white/50">
              ما فيه نتائج.{' '}
              {onlyCompatible && (
                <button className="text-mint-400 underline" onClick={() => setOnlyCompatible(false)}>
                  اعرض كل القطع
                </button>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
