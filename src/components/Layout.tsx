import { Bot, Menu, X } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useBuild } from '../state/build';
import ClickSpark from './rb/ClickSpark';

const NAV = [
  { to: '/build', label: 'المجمّع' },
  { to: '/builds', label: 'تجميعات جاهزة' },
  { to: '/parts', label: 'القطع' },
  { to: '/compare', label: 'المقارنة' },
  { to: '/guides', label: 'الأدلة' },
  { to: '/assistant', label: 'المساعد الذكي' },
];

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className}`} aria-label="SaudiPC — الرئيسية">
      <img src="/favicon.svg" alt="" width={34} height={34} className="rounded-lg transition-transform duration-300 group-hover:rotate-6" />
      <span className="ltr text-lg font-bold tracking-tight text-white">
        Saudi<span className="text-mint-400">PC</span>
      </span>
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { build } = useBuild();
  const { pathname } = useLocation();
  const count = ['cpu', 'motherboard', 'ram', 'gpu', 'psu', 'case', 'cooler'].filter((c) => build[c as keyof typeof build]).length + build.storage.length;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${scrolled || open ? 'border-b border-white/6 bg-ink-950/80 backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6" aria-label="التنقل الرئيسي">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                className={({ isActive }) =>
                  `relative rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {n.to === '/build' && count > 0 && (
                      <span className="num ms-1.5 rounded-full bg-mint-400 px-1.5 text-[10px] font-bold text-ink-950">{count}</span>
                    )}
                    {isActive && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-linear-to-l from-transparent via-mint-400 to-transparent" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link to="/build" className="btn-primary hidden !py-2 sm:inline-flex">
            ابدأ التجميع
          </Link>
          <button className="btn-ghost !p-2 lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-white/6 px-4 pb-4 lg:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  className={({ isActive }) => `block rounded-xl px-4 py-3 text-base ${isActive ? 'bg-mint-400/10 text-mint-300' : 'text-white/75 hover:bg-white/5'}`}
                >
                  {n.label}
                  {n.to === '/build' && count > 0 && <span className="num ms-2 text-xs text-mint-400">({count})</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/assistant')) return null;
  return (
    <footer className="relative mt-24 border-t border-white/6 bg-ink-950">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-md text-sm leading-7 text-white/55">
            منصة سعودية تساعدك تجمّع جهازك بثقة: فحص توافق فوري، وحساب للطاقة، وأسعار تقريبية بالريال، ومساعد ذكي يجاوبك بالعربي.
          </p>
          <p className="mt-4 text-xs leading-6 text-white/40">
            الأسعار تقريبية من السوق السعودي وتتغير باستمرار، خصوصًا مع أزمة الذاكرة الحالية. تأكد من السعر النهائي في المتجر قبل الشراء.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">الأدوات</p>
          <ul className="space-y-2 text-sm text-white/55">
            <li><Link className="hover:text-mint-300" to="/build">مجمّع القطع</Link></li>
            <li><Link className="hover:text-mint-300" to="/builds">تجميعات جاهزة</Link></li>
            <li><Link className="hover:text-mint-300" to="/compare">مقارنة القطع</Link></li>
            <li><Link className="hover:text-mint-300" to="/assistant">المساعد الذكي</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">تعلّم</p>
          <ul className="space-y-2 text-sm text-white/55">
            <li><Link className="hover:text-mint-300" to="/guides/market-2026">حالة السوق 2026</Link></li>
            <li><Link className="hover:text-mint-300" to="/guides/amd-vs-intel-2026">AMD أو Intel؟</Link></li>
            <li><Link className="hover:text-mint-300" to="/guides/build-steps">خطوات التجميع</Link></li>
            <li><Link className="hover:text-mint-300" to="/about">عن SaudiPC</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/6 py-5 text-center text-xs text-white/35">
        <span className="num">© {new Date().getFullYear()}</span> SaudiPC — صُنع في السعودية 🇸🇦
      </div>
    </footer>
  );
}

function AssistantFab() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/assistant')) return null;
  return (
    <Link
      to="/assistant"
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-mint-400/30 bg-ink-900/90 py-2.5 ps-3 pe-4 text-sm font-semibold text-white shadow-[0_8px_32px_-8px_rgba(61,255,176,0.45)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-mint-400/60"
      aria-label="افتح المساعد الذكي"
    >
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-mint-400 text-ink-950">
        <Bot size={16} />
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-ink-900 bg-gold-400" />
      </span>
      <span className="hidden sm:inline">اسأل المساعد</span>
    </Link>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="جاري التحميل">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-mint-400" />
    </div>
  );
}

export default function Layout() {
  return (
    <ClickSpark sparkColor="#3dffb0" sparkSize={9} sparkRadius={18} sparkCount={8} duration={420}>
      <ScrollToTop />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-50 focus:rounded-lg focus:bg-mint-400 focus:px-3 focus:py-2 focus:text-ink-950">
        تخطَّ إلى المحتوى
      </a>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main id="main" className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
      <AssistantFab />
    </ClickSpark>
  );
}
