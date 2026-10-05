import { ArrowLeft, Bot, Gauge, Layers, Scale, ShieldCheck, TrendingUp, Wallet, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedContent from '../components/rb/AnimatedContent';
import BlurText from '../components/rb/BlurText';
import CountUp from '../components/rb/CountUp';
import GradientText from '../components/rb/GradientText';
import LightRays from '../components/rb/LightRays';
import LogoLoop from '../components/rb/LogoLoop';
import MagicBento from '../components/rb/MagicBento';
import RotatingText from '../components/rb/RotatingText';
import ShinyText from '../components/rb/ShinyText';
import SpotlightCard from '../components/rb/SpotlightCard';
import StarBorder from '../components/rb/StarBorder';
import { Price, usePageMeta } from '../components/ui';
import { CURATED } from '../data/builds';
import { PARTS } from '../data/parts';
import { resolveBuild, totalPrice } from '../lib/compat';

const BRANDS = ['AMD', 'NVIDIA', 'Intel', 'ASUS', 'MSI', 'Gigabyte', 'ASRock', 'Corsair', 'G.Skill', 'Kingston', 'Samsung', 'WD', 'Crucial', 'Lian Li', 'Fractal', 'NZXT', 'Noctua', 'Arctic', 'Thermalright', 'Seasonic', 'be quiet!'];

const PULSE = [
  { icon: <TrendingUp size={18} />, tone: 'text-danger', title: 'الرامات أغلى 4 مرات', body: 'طقم 32GB DDR5 كان بحوالي 100 دولار وصار الحين حوالي 420 دولار، بسبب طلب مراكز الذكاء الاصطناعي على الذاكرة.' },
  { icon: <Zap size={18} />, tone: 'text-gold-400', title: 'RTX 50 Super تأجلت', body: 'NVIDIA أجلت سلسلة Super إلى أجل غير مسمى، والجيل الجاي ما هو متوقع قبل 2027–2028.' },
  { icon: <Gauge size={18} />, tone: 'text-mint-400', title: '9850X3D ملك الألعاب', body: 'أسرع معالج ألعاب حاليًا. بس 9800X3D يبقى القيمة الأفضل، لأن الفرق بينهم حوالي 3% بس.' },
  { icon: <Wallet size={18} />, tone: 'text-sky-300', title: 'Intel ترجع بقوة', body: 'معالج Core Ultra 7 270K Plus فيه 24 نواة بسعر منافس، ومناسب جدًا للمونتاج والإنتاجية.' },
];

export default function Home() {
  usePageMeta('', 'SaudiPC: مجمّع قطع ذكي بأسعار السوق السعودي، فحص توافق فوري، تجميعات جاهزة لكل ميزانية، ومساعد ذكي بالعربي.');
  const featured = CURATED.slice(1, 4);

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative -mt-16 overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0 h-[min(92vh,900px)]" aria-hidden="true">
          <LightRays raysOrigin="top-center" raysColor="#3dffb0" raysSpeed={0.9} lightSpread={0.9} rayLength={1.4} followMouse mouseInfluence={0.08} noiseAmount={0.06} distortion={0.04} className="opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--color-ink-950)_72%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-ink-950" />
        </div>

        <div className="relative mx-auto flex min-h-[min(88vh,860px)] max-w-5xl flex-col items-center justify-center px-4 pt-10 pb-16 text-center md:px-6">
          <Link to="/guides/market-2026" className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-white/75 transition hover:border-mint-400/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint-400" />
            <ShinyText text="محدّث لسوق أكتوبر 2026 — اقرأ حالة السوق" speed={3} color="#b5c9c0" shineColor="#ffffff" />
            <ArrowLeft size={14} />
          </Link>

          <BlurText
            text="ابنِ جهازك المثالي"
            animateBy="words"
            direction="top"
            delay={120}
            className="justify-center font-ar text-5xl leading-[1.2] font-bold text-white sm:text-6xl md:text-7xl lg:text-8xl"
          />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-ar text-xl text-white/75 sm:text-2xl md:text-3xl">
            <span>جهاز مصمم</span>
            <RotatingText
              texts={['للألعاب التنافسية', 'لتجربة 4K', 'للمونتاج والبث', 'للبرمجة والذكاء الاصطناعي', 'للدراسة والعمل']}
              splitBy="words"
              mainClassName="overflow-hidden rounded-xl bg-mint-400 px-3 py-1 text-ink-950 font-bold"
              staggerFrom="last"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.03}
              splitLevelClassName="overflow-hidden pb-1"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={2600}
            />
          </div>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
            اختر قطعك، وإحنا نفحص التوافق ونحسب الطاقة والسعر بالريال لحظيًا. وإذا احترت، المساعد الذكي يرشح لك الأنسب لميزانيتك.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <StarBorder as={Link} to="/build" color="#3dffb0" speed="5s" className="w-full sm:w-auto" backgroundColor="#06140e">
              <span className="flex items-center justify-center gap-2 px-2 font-semibold">
                ابدأ التجميع الآن <ArrowLeft size={18} />
              </span>
            </StarBorder>
            <Link to="/assistant" className="btn-ghost w-full !rounded-[20px] !px-6 !py-4 sm:w-auto">
              <Bot size={18} /> اسأل المساعد الذكي
            </Link>
          </div>

          <dl className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { n: PARTS.length, label: 'قطعة محدّثة' },
              { n: 20, label: 'فحص توافق' },
              { n: CURATED.length, label: 'تجميعات جاهزة' },
              { n: 2026, label: 'بيانات سنة', plain: true },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl px-4 py-4">
                <dt className="sr-only">{s.label}</dt>
                <dd className="num text-2xl font-bold text-white md:text-3xl">
                  {s.plain ? s.n : <CountUp to={s.n} duration={1.6} />}
                  {!s.plain && <span className="text-mint-400">+</span>}
                </dd>
                <dd className="mt-1 text-xs text-white/50">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* BRANDS */}
      <section aria-label="الشركات المدعومة" dir="ltr" className="overflow-hidden border-y border-white/6 bg-ink-900/40 py-6">
        <LogoLoop
          logos={BRANDS.map((b) => ({ node: <span className="ltr text-lg font-semibold tracking-tight text-white/35 transition-colors hover:text-mint-300">{b}</span>, title: b }))}
          speed={45}
          direction="right"
          logoHeight={28}
          gap={48}
          pauseOnHover
          fadeOut
          fadeOutColor="#020806"
          ariaLabel="الشركات المصنعة"
        />
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">ليش SaudiPC؟</p>
          <h2 className="section-title">
            كل اللي تحتاجه عشان{' '}
            <GradientText colors={['#3dffb0', '#e8c26a', '#3dffb0']} animationSpeed={6} className="inline-flex">
              تشتري صح
            </GradientText>
          </h2>
        </div>
        <MagicBento
          glowColor="61, 255, 176"
          particleCount={10}
          spotlightRadius={280}
          enableTilt={false}
          enableMagnetism={false}
          textAutoHide={false}
          cards={[
            { label: 'فحص فوري', title: 'توافق مضمون', description: 'نفحص المقبس ونوع الرام والمقاسات وطول الكرت وارتفاع المبرد والطاقة، وكل هذا لحظيًا.', icon: <ShieldCheck size={20} className="text-mint-400" />, color: '#06120d' },
            { label: 'بالريال', title: 'أسعار السوق السعودي', description: 'أسعار تقريبية من المتاجر المحلية، مع روابط مباشرة لأمازون ومايكرولس ونون.', icon: <Wallet size={20} className="text-gold-400" />, color: '#06120d' },
            { label: 'DeepSeek V4', title: 'مساعد ذكي يفهمك', description: 'قله ميزانيتك ووش تبي تسوي، ويرشح لك تجميعة كاملة ويشرح لك ليش اختارها.', icon: <Bot size={20} className="text-mint-400" />, color: '#06120d' },
            { label: 'حساب دقيق', title: 'مزود الطاقة المناسب', description: 'نحسب أقصى استهلاك للجهاز مع هامش أمان، وننبهك إذا المزود ما فيه منفذ 12V-2x6.', icon: <Zap size={20} className="text-gold-400" />, color: '#06120d' },
            { label: 'جنبًا إلى جنب', title: 'مقارنة القطع', description: 'قارن لين 4 قطع مع إبراز الأفضل في كل مواصفة.', icon: <Scale size={20} className="text-mint-400" />, color: '#06120d' },
            { label: 'شارك', title: 'رابط لتجميعتك', description: 'احفظ تجميعتك وشاركها برابط مع أصحابك أو المحل.', icon: <Layers size={20} className="text-gold-400" />, color: '#06120d' },
          ]}
        />
      </section>

      {/* MARKET PULSE */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedContent distance={40} duration={0.8}>
          <div className="panel relative overflow-hidden p-6 md:p-10">
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow mb-3 !text-gold-400">نبض السوق · أكتوبر 2026</p>
                <h2 className="section-title">اعرف السوق قبل ما تشتري</h2>
              </div>
              <Link to="/guides/market-2026" className="btn-ghost self-start md:self-auto">
                التحليل الكامل <ArrowLeft size={16} />
              </Link>
            </div>
            <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PULSE.map((p) => (
                <div key={p.title} className="rounded-2xl border border-white/6 bg-ink-950/50 p-5">
                  <div className={`mb-3 ${p.tone}`}>{p.icon}</div>
                  <h3 className="font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/55">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContent>
      </section>

      {/* FEATURED BUILDS */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-3">تجميعات مجرّبة</p>
            <h2 className="section-title">ابدأ من تجميعة جاهزة</h2>
            <p className="mt-3 max-w-xl text-white/55">كل تجميعة مفحوصة التوافق وموزونة الميزانية. حمّلها في المجمّع وعدّل عليها براحتك.</p>
          </div>
          <Link to="/builds" className="btn-ghost self-start">
            كل التجميعات <ArrowLeft size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((b, i) => {
            const r = resolveBuild(b.build);
            return (
              <AnimatedContent key={b.id} distance={50} delay={i * 0.1} duration={0.7}>
                <SpotlightCard className="h-full !rounded-3xl !border-white/8 !bg-ink-900/80 !p-6" spotlightColor="rgba(61, 255, 176, 0.14)">
                  <div className="flex items-center justify-between">
                    <span className="chip" style={{ color: b.accent, borderColor: `${b.accent}40` }}>{b.target}</span>
                    <span className="text-xs text-white/40">{b.audience}</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-white">{b.name}</h3>
                  <p className="mt-1 text-sm text-white/55">{b.tagline}</p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {[r.cpu, r.gpu, r.ram].map((p) =>
                      p ? (
                        <li key={p.id} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 text-white/75">
                          <span className="truncate">{p.name}</span>
                        </li>
                      ) : null,
                    )}
                  </ul>
                  <div className="mt-6 flex items-center justify-between">
                    <Price value={totalPrice(r)} className="text-xl" />
                    <Link to={`/builds#${b.id}`} className="text-sm font-semibold text-mint-400 hover:text-mint-300">
                      التفاصيل ←
                    </Link>
                  </div>
                </SpotlightCard>
              </AnimatedContent>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-mint-400/20 bg-linear-to-br from-ink-800 via-ink-900 to-ink-950 px-6 py-14 text-center md:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(61,255,176,0.18),transparent_60%)]" />
          <Bot size={40} className="relative mx-auto text-mint-400" />
          <h2 className="relative mt-5 text-3xl font-bold text-white md:text-4xl">محتار؟ خل المساعد يختار عنك</h2>
          <p className="relative mx-auto mt-4 max-w-xl leading-8 text-white/60">
            مثلًا: «عندي 8000 ريال وأبي ألعب Battlefield 6 على 1440p». يجاوبك بتجميعة كاملة من قطع متوفرة بالسوق، ويشرح لك ليش اختار كل قطعة.
          </p>
          <Link to="/assistant" className="btn-primary relative mt-8 !px-6 !py-3 text-base">
            جرّب المساعد مجانًا <ArrowLeft size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
