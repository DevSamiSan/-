import { getPart } from '../data/parts';
import type { Build, Case, Cooler, CPU, GPU, Motherboard, PSU, RAM, Storage } from '../data/types';

export type IssueLevel = 'error' | 'warning' | 'info';

export interface Issue {
  level: IssueLevel;
  title: string;
  detail: string;
}

export interface ResolvedBuild {
  cpu?: CPU;
  motherboard?: Motherboard;
  ram?: RAM;
  gpu?: GPU;
  storage: Storage[];
  psu?: PSU;
  case?: Case;
  cooler?: Cooler;
}

export function resolveBuild(b: Build): ResolvedBuild {
  return {
    cpu: getPart(b.cpu) as CPU | undefined,
    motherboard: getPart(b.motherboard) as Motherboard | undefined,
    ram: getPart(b.ram) as RAM | undefined,
    gpu: getPart(b.gpu) as GPU | undefined,
    storage: b.storage.map((id) => getPart(id)).filter(Boolean) as Storage[],
    psu: getPart(b.psu) as PSU | undefined,
    case: getPart(b.case) as Case | undefined,
    cooler: getPart(b.cooler) as Cooler | undefined,
  };
}

export function totalPrice(r: ResolvedBuild): number {
  return [r.cpu, r.motherboard, r.ram, r.gpu, r.psu, r.case, r.cooler, ...r.storage].reduce((s, p) => s + (p?.price ?? 0), 0);
}

/** Estimated peak system draw in watts. */
export function estimateWatts(r: ResolvedBuild): number {
  let w = 0;
  w += r.cpu?.maxPower ?? 0;
  w += r.gpu?.tgp ?? 0;
  if (r.motherboard) w += 50;
  if (r.ram) w += r.ram.modules * 5;
  w += r.storage.length * 8;
  if (r.cooler) w += r.cooler.type === 'aio' ? 15 : 5;
  if (r.case) w += Math.max(r.case.fansIncluded, 2) * 3;
  return Math.round(w);
}

/** PSU recommendation: ~30% headroom for transients and efficiency sweet spot, rounded to common sizes. */
export function recommendedPsuWatts(r: ResolvedBuild): number {
  const est = estimateWatts(r);
  const needed = Math.max(est * 1.3, r.gpu?.recommendedPsu ?? 0);
  const sizes = [550, 650, 750, 850, 1000, 1200, 1600];
  return sizes.find((s) => s >= needed) ?? 1600;
}

export function checkBuild(r: ResolvedBuild): Issue[] {
  const issues: Issue[] = [];
  const { cpu, motherboard: mb, ram, gpu, psu, case: pcCase, cooler, storage } = r;

  if (cpu && mb && cpu.socket !== mb.socket) {
    issues.push({ level: 'error', title: 'المعالج لا يركب على اللوحة الأم', detail: `المعالج ${cpu.name} يستخدم مقبس ${cpu.socket}، بينما اللوحة ${mb.name} مقبسها ${mb.socket}.` });
  }

  if (ram && mb) {
    if (ram.memType !== mb.memType) {
      issues.push({ level: 'error', title: 'نوع الرام غير مدعوم', detail: `اللوحة تدعم ${mb.memType} فقط.` });
    }
    if (ram.modules > mb.memSlots) {
      issues.push({ level: 'error', title: 'عدد شرائح الرام أكثر من المنافذ', detail: `الطقم فيه ${ram.modules} شرائح واللوحة فيها ${mb.memSlots} منافذ بس.` });
    }
    if (ram.speed > mb.memMaxMTs) {
      issues.push({ level: 'warning', title: 'سرعة الرام أعلى من دعم اللوحة', detail: `الرام بتشتغل على سرعة أقل من ${ram.speed}MT/s. أقصى سرعة تدعمها اللوحة ${mb.memMaxMTs}MT/s.` });
    }
    if (ram.cudimm && mb.socket !== 'LGA1851') {
      issues.push({ level: 'warning', title: 'رامات CUDIMM بدون فايدة هنا', detail: 'رامات CUDIMM تعطي أفضل أداء مع لوحات Intel Z890. على المنصات الثانية بتشتغل بوضع عادي بسرعة أقل، فالأفضل تختار طقم أرخص.' });
    }
  }

  if (ram && cpu?.socket === 'AM5' && ram.speed > 6400) {
    issues.push({ level: 'info', title: 'سرعة الرام فوق المثالي لـ Ryzen', detail: 'معالجات Ryzen 7000/9000 أفضل أداء لها مع DDR5-6000 CL30. فوق 6400 يتغير نظام عمل وحدة التحكم بالذاكرة، والفايدة الفعلية في الألعاب قليلة.' });
  }
  if (ram && ram.capacityGB < 32) {
    issues.push({ level: 'info', title: '16GB ممكن ما تكفي', detail: 'ألعاب 2026 الكبيرة مع ديسكورد والمتصفح تستهلك أكثر من 16GB بسهولة. الأفضل 32GB إذا الميزانية تسمح.' });
  }

  if (mb && pcCase && !pcCase.supports.includes(mb.formFactor)) {
    issues.push({ level: 'error', title: 'اللوحة الأم ما تدخل الكيس', detail: `الكيس ${pcCase.name} يدعم ${pcCase.supports.join(' / ')} فقط، واللوحة مقاسها ${mb.formFactor}.` });
  }

  if (gpu && pcCase && gpu.lengthMM > pcCase.maxGpuMM) {
    issues.push({ level: 'error', title: 'كرت الشاشة أطول من مساحة الكيس', detail: `طول الكرت حوالي ${gpu.lengthMM}mm، والكيس يستوعب لين ${pcCase.maxGpuMM}mm.` });
  } else if (gpu && pcCase && pcCase.maxGpuMM - gpu.lengthMM < 15) {
    issues.push({ level: 'warning', title: 'مساحة كرت الشاشة ضيقة', detail: 'أطوال الكروت تختلف حسب الشركة المصنعة. تأكد من طول النسخة اللي بتشتريها بالضبط.' });
  }

  if (cooler && cpu && !cooler.sockets.includes(cpu.socket)) {
    issues.push({ level: 'error', title: 'المبرد لا يدعم مقبس المعالج', detail: `المبرد يدعم ${cooler.sockets.join(' / ')} فقط.` });
  }
  if (cooler && pcCase) {
    if (cooler.type === 'air' && cooler.heightMM && cooler.heightMM > pcCase.maxCoolerMM) {
      issues.push({ level: 'error', title: 'المبرد أطول من الكيس', detail: `ارتفاع المبرد ${cooler.heightMM}mm، والكيس يستوعب لين ${pcCase.maxCoolerMM}mm.` });
    }
    if (cooler.type === 'aio' && cooler.radiatorMM && !pcCase.radiators.includes(cooler.radiatorMM)) {
      issues.push({ level: 'error', title: 'الرديتر ما يركب في الكيس', detail: `الكيس يدعم رديترات ${pcCase.radiators.join(' / ')}mm فقط.` });
    }
  }
  if (cooler && cpu && cooler.ratedW < cpu.maxPower * 0.85) {
    issues.push({ level: 'warning', title: 'المبرد ضعيف على المعالج', detail: `المعالج يوصل استهلاكه لـ ${cpu.maxPower}W، وقدرة المبرد حوالي ${cooler.ratedW}W. بتصير حرارته عالية وبيخفض سرعته تحت الضغط.` });
  }
  if (cpu && !cooler && !cpu.coolerIncluded) {
    issues.push({ level: 'error', title: 'المعالج يحتاج مبرد', detail: `${cpu.name} ما يجي معه مبرد في العلبة. لازم تختار مبرد.` });
  }
  if (cpu && !cooler && cpu.coolerIncluded) {
    issues.push({ level: 'info', title: 'بتستخدم المبرد المرفق', detail: 'المبرد اللي يجي مع المعالج يشتغل، بس صوته أعلى. مبرد هوائي بحوالي 100–170 ريال يفرق كثير.' });
  }

  if (cpu && !gpu && !cpu.igpu) {
    issues.push({ level: 'error', title: 'ما فيه مخرج صورة', detail: `${cpu.name} ما فيه معالج رسومي مدمج، فلازم تختار كرت شاشة.` });
  }

  if (storage.length && mb) {
    const m2 = storage.filter((s) => s.formFactor === 'M.2').length;
    if (m2 > mb.m2Slots) {
      issues.push({ level: 'error', title: 'أقراص M.2 أكثر من المنافذ', detail: `اخترت ${m2} أقراص M.2، واللوحة فيها ${mb.m2Slots} منافذ بس.` });
    }
    const gen5 = storage.some((s) => s.interface === 'PCIe 5.0');
    if (gen5 && !mb.pcie5M2) {
      issues.push({ level: 'warning', title: 'القرص Gen5 بيشتغل بسرعة Gen4', detail: 'اللوحة ما فيها منفذ M.2 يدعم PCIe 5.0، فبتخسر نص سرعة القرص تقريبًا. الأوفر تختار قرص Gen4.' });
    }
  }

  if (psu) {
    const est = estimateWatts(r);
    const rec = recommendedPsuWatts(r);
    if (psu.watts < est) {
      issues.push({ level: 'error', title: 'مزود الطاقة غير كافٍ', detail: `الاستهلاك المتوقع حوالي ${est}W وهو أكثر من قدرة المزود (${psu.watts}W).` });
    } else if (psu.watts < rec) {
      issues.push({ level: 'warning', title: 'مزود الطاقة على الحد', detail: `ننصح بمزود ${rec}W أو أكثر لتحمّل قفزات الطاقة المفاجئة ويشتغل بكفاءة وهدوء.` });
    }
    if (gpu?.connector === '12V-2x6' && !psu.native12v2x6) {
      issues.push({ level: 'warning', title: 'المزود ما فيه منفذ 12V-2x6 أصلي', detail: 'بتحتاج محوّل الكرت. الأفضل مزود ATX 3.1 بكيبل أصلي، وتأكد إن الفيش داخل لين آخره.' });
    }
  }

  if (cpu && gpu) {
    const gpuTier = gpu.perf;
    if (gpuTier >= 56 && cpu.gaming < 78) {
      issues.push({ level: 'warning', title: 'المعالج ممكن يقيّد الكرت', detail: `كرت بمستوى ${gpu.name} يستاهل معالج أقوى، خصوصًا على دقة 1080p و1440p مع تردد شاشة عالي.` });
    }
    if (gpuTier <= 31 && cpu.gaming >= 96 && cpu.price > 1500) {
      issues.push({ level: 'info', title: 'توزيع الميزانية غير متوازن', detail: 'الأفضل تحط جزء من ميزانية المعالج على كرت شاشة أقوى، لأن الكرت هو اللي يحدد أداء الألعاب أكثر.' });
    }
  }

  if (cpu?.id === 'i5-14400f') {
    issues.push({ level: 'info', title: 'منصة LGA1700 وصلت نهايتها', detail: 'ما فيه معالجات جديدة جاية لهذا المقبس. إذا تفكر تطوّر جهازك لاحقًا، منصة AM5 خيار أطول عمرًا.' });
  }

  return issues;
}

export type Tier = { label: string; tone: 'great' | 'good' | 'ok' | 'bad' };

/** Coarse, honest gaming-capability tiers rather than invented FPS numbers. */
export function gamingTiers(r: ResolvedBuild): { res: string; tier: Tier }[] | null {
  if (!r.gpu) return null;
  const g = r.gpu.perf;
  const c = r.cpu?.gaming ?? 80;
  const vram = r.gpu.vramGB;
  const tier = (score: number, vramNeed: number): Tier => {
    const s = vram < vramNeed ? score * 0.8 : score;
    if (s >= 1.15) return { label: 'ممتاز — إعدادات عالية وتردد مرتفع', tone: 'great' };
    if (s >= 0.85) return { label: 'جيد جدًا — إعدادات عالية', tone: 'good' };
    if (s >= 0.5) return { label: 'مقبول — مع تقنيات الرفع', tone: 'ok' };
    return { label: 'غير مناسب للألعاب الحديثة', tone: 'bad' };
  };
  const cpuFactor = Math.min(1, c / 85);
  return [
    { res: '1080p', tier: tier((g / 24) * cpuFactor, 8) },
    { res: '1440p', tier: tier((g / 42) * Math.min(1, c / 80), 12) },
    { res: '4K', tier: tier(g / 64, 16) },
  ];
}
