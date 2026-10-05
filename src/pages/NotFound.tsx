import { Link } from 'react-router-dom';
import FuzzyNumber from '../components/rb/DecryptedText';
import { usePageMeta } from '../components/ui';

export default function NotFound() {
  usePageMeta('الصفحة غير موجودة');
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="num text-8xl font-bold text-mint-400 md:text-9xl">
        <FuzzyNumber text="404" animateOn="view" speed={60} maxIterations={14} characters="0123456789" />
      </p>
      <h1 className="mt-4 text-2xl font-bold text-white">الصفحة اللي تدورها مو موجودة</h1>
      <p className="mt-3 text-white/55">يمكن الرابط قديم أو فيه خطأ في الكتابة.</p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-primary">
          الرئيسية
        </Link>
        <Link to="/build" className="btn-ghost">
          المجمّع
        </Link>
      </div>
    </div>
  );
}
