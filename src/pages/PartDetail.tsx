import { ArrowRight, Check, ExternalLink, Plus, Scale } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DecryptedText from '../components/rb/DecryptedText';
import GlareHover from '../components/rb/GlareHover';
import { CategoryIcon, Price, usePageMeta } from '../components/ui';
import { CATEGORY_META, getPart, PARTS, PRICES_UPDATED } from '../data/parts';
import { specRows } from '../lib/specs';
import { storeLinks } from '../lib/stores';
import { useBuild } from '../state/build';
import { PartCard } from './Parts';
import NotFound from './NotFound';

export default function PartDetail() {
  const { id } = useParams();
  const p = getPart(id);
  const { build, setPart } = useBuild();
  const navigate = useNavigate();
  usePageMeta(p ? `${p.brand} ${p.name}` : 'قطعة غير موجودة', p ? `مواصفات وسعر ${p.brand} ${p.name} في السعودية.` : undefined);
  if (!p) return <NotFound />;

  const inBuild = p.category === 'storage' ? build.storage.includes(p.id) : build[p.category] === p.id;
  const similar = PARTS.filter((x) => x.category === p.category && x.id !== p.id)
    .sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    .slice(0, 4);
  const [y, m] = p.released.split('-');

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
      <Link to={`/parts/${p.category}`} className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-mint-300">
        <ArrowRight size={15} /> {CATEGORY_META[p.category].plural}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div>
          <p className="eyebrow mb-3 flex items-center gap-2">
            <CategoryIcon category={p.category} size={14} /> {CATEGORY_META[p.category].label} · {p.brand}
          </p>
          <h1 className="ltr text-right text-3xl font-bold tracking-tight text-white md:text-5xl">
            <DecryptedText text={p.name} animateOn="view" sequential speed={28} revealDirection="start" className="text-white" encryptedClassName="text-mint-400/70" />
          </h1>
          {p.note && <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{p.note}</p>}
          <p className="mt-3 text-sm text-white/40">
            تاريخ الإصدار: <span className="num">{m}/{y}</span>
          </p>

          <div className="panel mt-8 overflow-hidden">
            <h2 className="border-b border-white/6 px-5 py-4 font-semibold text-white">المواصفات</h2>
            <dl className="divide-y divide-white/5">
              {specRows(p).map((s) => (
                <div key={s.key} className="grid grid-cols-2 gap-4 px-5 py-3.5 text-sm">
                  <dt className="text-white/55">{s.label}</dt>
                  <dd className="num text-right font-medium text-white" style={{ textAlign: 'start' }}>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <GlareHover width="100%" height="auto" background="#071a13" borderRadius="24px" borderColor="rgba(61,255,176,0.18)" glareColor="#3dffb0" glareOpacity={0.18} glareSize={260} transitionDuration={900} className="!grid-cols-1 !place-items-stretch">
            <div className="w-full p-6">
              <p className="text-xs text-white/45">السعر التقريبي في السعودية</p>
              <Price value={p.price} className="mt-1 block text-4xl" />
              <p className="mt-1 text-[11px] text-white/35">
                شامل الضريبة · <span className="num">{PRICES_UPDATED}</span> · السعر يختلف حسب المتجر والنسخة
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  className={inBuild ? 'btn-ghost !border-mint-400/40 !text-mint-300' : 'btn-primary'}
                  onClick={() => {
                    if (!inBuild) setPart(p.category, p.id);
                    navigate('/build');
                  }}
                >
                  {inBuild ? <Check size={16} /> : <Plus size={16} />} {inBuild ? 'في تجميعتك — افتح المجمّع' : 'أضف لتجميعتي'}
                </button>
                <Link to={`/compare?ids=${p.id}`} className="btn-ghost">
                  <Scale size={16} /> قارنها مع قطع ثانية
                </Link>
              </div>

              <div className="mt-6 border-t border-white/8 pt-5">
                <p className="mb-3 text-sm font-semibold text-white">تحقق من السعر الحالي</p>
                <ul className="flex flex-col gap-2">
                  {storeLinks(p).map((s) => (
                    <li key={s.name}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-4 py-2.5 text-sm text-white/80 transition hover:border-mint-400/40 hover:text-white">
                        <span className="ltr">{s.name}</span>
                        <ExternalLink size={14} className="text-white/40" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlareHover>
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="mb-5 text-xl font-bold text-white">قطع قريبة في السعر</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((s) => (
            <div key={s.id} className="relative">
              <PartCard p={s} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
