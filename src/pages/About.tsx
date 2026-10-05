import { Bot, Database, ShieldCheck, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader, usePageMeta } from '../components/ui';
import { PARTS, PRICES_UPDATED } from '../data/parts';

export default function About() {
  usePageMeta('عن SaudiPC', 'وش هو SaudiPC، ومن وين نجيب الأسعار، وكيف يشتغل فحص التوافق والمساعد الذكي.');
  const items = [
    { icon: <Database size={20} />, title: 'من وين البيانات؟', body: `المواصفات من المصادر الرسمية للشركات المصنعة. الأسعار تقريبية، جمعناها من متاجر سعودية مثل أمازون السعودية ومايكرولس وPC Palace في ${PRICES_UPDATED}. الكتالوج فيه ${PARTS.length} قطعة من أحدث القطع المتوفرة.` },
    { icon: <Wallet size={20} />, title: 'ليش الأسعار تقريبية؟', body: 'أسعار الرامات وكروت الشاشة تتغير كل أسبوع تقريبًا بسبب أزمة الذاكرة العالمية في 2026. عشان كذا كل قطعة فيها روابط مباشرة تشوف منها السعر الحالي قبل ما تشتري.' },
    { icon: <ShieldCheck size={20} />, title: 'كيف يشتغل فحص التوافق؟', body: 'نفحص أكثر من 20 قاعدة: المقبس، ونوع الرام وسرعتها، ومقاس اللوحة مع الكيس، وطول الكرت، وارتفاع المبرد ومقاس الرديتر، ومنافذ M.2، وقدرة مزود الطاقة ومنفذ 12V-2x6، والتوازن بين المعالج والكرت.' },
    { icon: <Bot size={20} />, title: 'المساعد الذكي', body: 'يشتغل على DeepSeek V4، ويعرف كتالوج القطع وأسعاره ووضع السوق الحالي. محادثاتك ما تنحفظ على خوادمنا، تنحفظ بس في متصفحك.' },
  ];
  return (
    <div>
      <PageHeader eyebrow="عن المنصة" title="SaudiPC">
        منصة سعودية مستقلة تساعدك تجمّع جهاز كمبيوتر بثقة، من غير ما تحتاج تسأل في عشرين قروب أو تخاف إن القطع ما تتوافق.
      </PageHeader>
      <div className="mx-auto grid grid-cols-1 max-w-5xl gap-5 px-4 md:grid-cols-2 md:px-6">
        {items.map((i) => (
          <div key={i.title} className="panel p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint-400/10 text-mint-400">{i.icon}</div>
            <h2 className="mt-4 text-lg font-bold text-white">{i.title}</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">{i.body}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-5xl px-4 md:px-6">
        <div className="rounded-2xl border border-white/8 bg-ink-900/60 p-6 text-sm leading-7 text-white/55">
          <strong className="text-white">تنبيه:</strong> SaudiPC ما يبيع قطع، وما عنده علاقة تجارية بأي متجر. التقديرات والتوصيات استرشادية، فتأكد دايمًا من مواصفات النسخة اللي بتشتريها بالضبط، مثل طول كرت الشاشة اللي يختلف من شركة للثانية.
        </div>
        <Link to="/build" className="btn-primary mt-8">
          ابدأ التجميع
        </Link>
      </div>
    </div>
  );
}
