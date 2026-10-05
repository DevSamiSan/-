import { Plus, Scale, Trophy, X } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CategoryIcon, Empty, PageHeader, Price, usePageMeta } from '../components/ui';
import { CATEGORY_META, CATEGORY_ORDER, getPart, partsIn } from '../data/parts';
import type { Category, Part } from '../data/types';
import { specRows, type SpecRow } from '../lib/specs';

const MAX = 4;

export default function Compare() {
  usePageMeta('مقارنة القطع', 'قارن بين قطع الكمبيوتر جنبًا إلى جنب مع إبراز الأفضل في كل مواصفة.');
  const [params, setParams] = useSearchParams();
  const ids = (params.get('ids') ?? '').split(',').filter(Boolean);
  const parts = ids.map((id) => getPart(id)).filter(Boolean) as Part[];
  const category: Category = (parts[0]?.category ?? (params.get('c') as Category)) || 'gpu';
  const sameCat = parts.filter((p) => p.category === category).slice(0, MAX);

  const setIds = (next: string[]) => {
    const p = new URLSearchParams();
    if (next.length) p.set('ids', next.join(','));
    else p.set('c', category);
    setParams(p, { replace: true });
  };

  const options = partsIn(category).filter((p) => !sameCat.some((s) => s.id === p.id));

  const rows = useMemo(() => {
    if (!sameCat.length) return [];
    const specs = sameCat.map((p) => specRows(p));
    const keys = specs[0].map((s) => s.key);
    for (const sp of specs.slice(1)) for (const s of sp) if (!keys.includes(s.key)) keys.push(s.key);
    return keys.map((key) => {
      const cells = specs.map((sp) => sp.find((s) => s.key === key));
      const ref = cells.find(Boolean) as SpecRow;
      let best: number | null = null;
      if (ref.better && sameCat.length > 1) {
        const nums = cells.map((c) => c?.n);
        const valid = nums.filter((n): n is number => typeof n === 'number');
        if (valid.length > 1 && new Set(valid).size > 1) best = ref.better === 'high' ? Math.max(...valid) : Math.min(...valid);
      }
      return { key, label: ref.label, cells, best };
    });
  }, [sameCat]);

  const cheapest = sameCat.length > 1 ? Math.min(...sameCat.map((p) => p.price)) : null;
  const cols = `minmax(130px,1fr) repeat(${sameCat.length + (sameCat.length < MAX ? 1 : 0)}, minmax(170px,1fr))`;

  return (
    <div>
      <PageHeader eyebrow="المقارنة" title="قارن القطع جنبًا إلى جنب">
        اختر الفئة، وأضف لين {MAX} قطع. الأفضل في كل مواصفة يتلوّن بالأخضر.
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="scrollbar-thin -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2">
          {CATEGORY_ORDER.map((c) => (
            <button
              key={c}
              onClick={() => setParams({ c }, { replace: true })}
              className={`chip shrink-0 !px-4 !py-2 !text-sm ${c === category ? '!border-mint-400/50 !bg-mint-400/10 !text-mint-300' : ''}`}
            >
              <CategoryIcon category={c} size={14} /> {CATEGORY_META[c].plural}
            </button>
          ))}
        </div>

        {sameCat.length === 0 ? (
          <Empty icon={<Scale size={30} />} title={`اختر أول ${CATEGORY_META[category].label} للمقارنة`}>
            <select className="input mt-3" value="" onChange={(e) => e.target.value && setIds([e.target.value])} aria-label="اختر قطعة">
              <option value="">— اختر من القائمة —</option>
              {options.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} {p.name}
                </option>
              ))}
            </select>
          </Empty>
        ) : (
          <div className="panel scrollbar-thin overflow-x-auto">
            <div className="min-w-fit" style={{ display: 'grid', gridTemplateColumns: cols }}>
              {/* header row */}
              <div className="sticky right-0 z-10 border-b border-white/8 bg-ink-900 p-4" />
              {sameCat.map((p) => (
                <div key={p.id} className="relative border-b border-white/8 p-4">
                  <button className="absolute top-3 left-3 rounded-lg p-1 text-white/40 hover:bg-white/5 hover:text-danger" onClick={() => setIds(sameCat.filter((x) => x.id !== p.id).map((x) => x.id))} aria-label={`إزالة ${p.name}`}>
                    <X size={15} />
                  </button>
                  <p className="text-xs text-white/40">{p.brand}</p>
                  <Link to={`/part/${p.id}`} className="block pe-6 font-semibold leading-6 text-white hover:text-mint-300">
                    {p.name}
                  </Link>
                  <div className="mt-2 flex items-center gap-2">
                    <Price value={p.price} />
                    {cheapest === p.price && <span className="chip !border-mint-400/30 !py-0 !text-[10px] !text-mint-300">الأرخص</span>}
                  </div>
                </div>
              ))}
              {sameCat.length < MAX && (
                <div className="border-b border-white/8 p-4">
                  <label className="flex h-full flex-col justify-center gap-2 rounded-xl border border-dashed border-white/12 p-3 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Plus size={13} /> أضف للمقارنة
                    </span>
                    <select className="input !py-1.5 text-xs" value="" onChange={(e) => e.target.value && setIds([...sameCat.map((x) => x.id), e.target.value])}>
                      <option value="">اختر…</option>
                      {options.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.brand} {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              {rows.map((row, ri) => (
                <div key={row.key} className="contents">
                  <div className={`sticky right-0 z-10 p-4 text-sm text-white/55 ${ri % 2 ? 'bg-ink-900' : 'bg-[#061510]'}`}>{row.label}</div>
                  {row.cells.map((c, i) => {
                    const win = row.best !== null && c?.n === row.best;
                    return (
                      <div key={i} className={`num p-4 text-sm ${ri % 2 ? '' : 'bg-white/[0.015]'} ${win ? 'font-semibold text-mint-300' : 'text-white/85'}`} style={{ textAlign: 'start' }}>
                        <span className="inline-flex items-center gap-1.5">
                          {c?.value ?? '—'}
                          {win && <Trophy size={12} className="text-gold-400" />}
                        </span>
                      </div>
                    );
                  })}
                  {sameCat.length < MAX && <div className={ri % 2 ? '' : 'bg-white/[0.015]'} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
