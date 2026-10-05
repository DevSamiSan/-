import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedContent from '../components/rb/AnimatedContent';
import SpotlightCard from '../components/rb/SpotlightCard';
import { PageHeader, usePageMeta } from '../components/ui';
import { GUIDES } from '../data/guides';

export default function Guides() {
  usePageMeta('الأدلة', 'أدلة عربية محدّثة لتجميع الكمبيوتر: حالة السوق، اختيار المعالج وكرت الشاشة، مزود الطاقة، وخطوات التجميع.');
  const [first, ...rest] = GUIDES;
  return (
    <div>
      <PageHeader eyebrow="تعلّم قبل ما تشتري" title="أدلة SaudiPC">
        شروحات مختصرة ومباشرة بالعربي، ومحدّثة لسوق أكتوبر 2026.
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedContent distance={30}>
          <Link to={`/guides/${first.slug}`} className="group block">
            <SpotlightCard className="!rounded-3xl !border-gold-400/20 !bg-linear-to-br !from-ink-800 !to-ink-900 !p-7 md:!p-10" spotlightColor="rgba(232, 194, 106, 0.12)">
              <span className="chip !border-gold-400/30 !text-gold-300">{first.tag} · الأهم الآن</span>
              <h2 className="mt-4 max-w-3xl text-2xl font-bold leading-snug text-white md:text-4xl">{first.title}</h2>
              <p className="mt-3 max-w-2xl leading-8 text-white/60">{first.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-gold-300 group-hover:gap-3">
                اقرأ الدليل <ArrowLeft size={16} />
              </span>
            </SpotlightCard>
          </Link>
        </AnimatedContent>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((g, i) => (
            <AnimatedContent key={g.slug} distance={30} delay={(i % 3) * 0.07}>
              <Link to={`/guides/${g.slug}`} className="group block h-full">
                <SpotlightCard className="h-full !rounded-2xl !border-white/8 !bg-ink-900/80 !p-6" spotlightColor="rgba(61, 255, 176, 0.10)">
                  <div className="flex items-center justify-between text-xs text-white/45">
                    <span className="chip">{g.tag}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> <span className="num">{g.minutes}</span> دقائق
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-8 text-white group-hover:text-mint-300">{g.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/55">{g.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mint-400">
                    <BookOpen size={14} /> اقرأ
                  </span>
                </SpotlightCard>
              </Link>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </div>
  );
}
