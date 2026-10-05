import { ArrowRight, Bot, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Markdown from '../components/Markdown';
import { usePageMeta } from '../components/ui';
import { getGuide, GUIDES } from '../data/guides';
import NotFound from './NotFound';

export default function GuideDetail() {
  const { slug } = useParams();
  const g = getGuide(slug);
  usePageMeta(g?.title ?? 'دليل غير موجود', g?.excerpt);
  if (!g) return <NotFound />;
  const others = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 pt-8 md:px-6">
      <Link to="/guides" className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-mint-300">
        <ArrowRight size={15} /> كل الأدلة
      </Link>
      <header className="mt-6 border-b border-white/8 pb-8">
        <span className="chip">{g.tag}</span>
        <h1 className="mt-4 text-3xl leading-snug font-bold text-white md:text-5xl md:leading-tight">{g.title}</h1>
        <p className="mt-4 text-lg leading-8 text-white/60">{g.excerpt}</p>
        <p className="mt-4 flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Clock size={12} /> <span className="num">{g.minutes}</span> دقائق قراءة
          </span>
          <span>·</span>
          <span>
            آخر تحديث <span className="num">{g.updated}</span>
          </span>
        </p>
      </header>

      <Markdown className="article mt-6">{g.body}</Markdown>

      <div className="mt-12 rounded-2xl border border-mint-400/20 bg-mint-400/[0.04] p-6">
        <p className="flex items-center gap-2 font-semibold text-white">
          <Bot size={18} className="text-mint-400" /> عندك سؤال عن هذا الموضوع؟
        </p>
        <p className="mt-2 text-sm leading-7 text-white/60">المساعد الذكي يجاوبك بالتفصيل ويرشح لك قطع حسب ميزانيتك.</p>
        <Link to="/assistant" state={{ prompt: `عندي سؤال عن: ${g.title}` }} className="btn-primary mt-4">
          اسأل المساعد
        </Link>
      </div>

      <nav className="mt-14" aria-label="أدلة أخرى">
        <h2 className="mb-4 font-bold text-white">أدلة ثانية</h2>
        <ul className="space-y-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link to={`/guides/${o.slug}`} className="block rounded-xl border border-white/8 px-4 py-3 text-white/80 transition hover:border-mint-400/40 hover:text-white">
                {o.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
