import { CircuitBoard, Cpu, Fan, Gpu, HardDrive, MemoryStick, PcCase, Zap, type LucideProps } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import type { Category } from '../data/types';

const ICONS: Record<Category, (p: LucideProps) => ReactNode> = {
  cpu: (p) => <Cpu {...p} />,
  motherboard: (p) => <CircuitBoard {...p} />,
  ram: (p) => <MemoryStick {...p} />,
  gpu: (p) => <Gpu {...p} />,
  storage: (p) => <HardDrive {...p} />,
  psu: (p) => <Zap {...p} />,
  case: (p) => <PcCase {...p} />,
  cooler: (p) => <Fan {...p} />,
};

export function CategoryIcon({ category, ...props }: { category: Category } & LucideProps) {
  return ICONS[category]({ 'aria-hidden': true, ...props });
}

export function Price({ value, className = '' }: { value: number; className?: string }) {
  return (
    <span className={`font-semibold whitespace-nowrap text-white ${className}`}>
      <span className="num">{Math.round(value).toLocaleString('en')}</span> <span className="text-[0.8em] font-medium text-white/60">ر.س</span>
    </span>
  );
}

/** Sets document title and description for each route. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — SaudiPC` : 'SaudiPC — ابنِ جهازك المثالي';
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="relative mx-auto max-w-7xl px-4 pt-10 pb-8 md:px-6 md:pt-16">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{title}</h1>
      {children && <div className="mt-4 max-w-2xl text-base leading-8 text-white/65 md:text-lg">{children}</div>}
    </header>
  );
}

export function Empty({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-14 text-center">
      {icon && <div className="text-mint-400">{icon}</div>}
      <p className="text-lg font-semibold text-white">{title}</p>
      {children && <div className="max-w-md text-sm leading-7 text-white/60">{children}</div>}
    </div>
  );
}

export function ScoreBar({ value, max = 100, tone = 'mint' }: { value: number; max?: number; tone?: 'mint' | 'gold' }) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8" role="presentation">
      <div
        className={`h-full rounded-full ${tone === 'mint' ? 'bg-linear-to-l from-mint-300 to-mint-600' : 'bg-linear-to-l from-gold-300 to-gold-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
