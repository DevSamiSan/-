import type { Part } from '../data/types';

export interface SpecRow {
  key: string;
  label: string;
  value: string;
  /** Numeric value used when comparing parts. */
  n?: number;
  /** Which direction is better when comparing. */
  better?: 'high' | 'low';
}

const gb = (n: number) => (n >= 1000 ? `${n / 1000}TB` : `${n}GB`);

export function specRows(p: Part): SpecRow[] {
  switch (p.category) {
    case 'cpu':
      return [
        { key: 'socket', label: 'المقبس', value: p.socket },
        { key: 'cores', label: 'الأنوية / المسارات', value: `${p.cores} / ${p.threads}`, n: p.cores, better: 'high' },
        ...(p.pCores ? [{ key: 'pe', label: 'أداء + كفاءة', value: `${p.pCores}P + ${p.eCores}E` }] : []),
        { key: 'boost', label: 'أقصى تردد', value: `${p.boostGHz} GHz`, n: p.boostGHz, better: 'high' },
        { key: 'base', label: 'التردد الأساسي', value: `${p.baseGHz} GHz`, n: p.baseGHz, better: 'high' },
        { key: 'l3', label: 'ذاكرة L3', value: `${p.l3MB} MB`, n: p.l3MB, better: 'high' },
        { key: 'tdp', label: 'TDP', value: `${p.tdp}W`, n: p.tdp, better: 'low' },
        { key: 'maxPower', label: 'أقصى استهلاك', value: `${p.maxPower}W`, n: p.maxPower, better: 'low' },
        { key: 'mem', label: 'الذاكرة الرسمية', value: `DDR5-${p.memMaxMTs}` },
        { key: 'igpu', label: 'رسوميات مدمجة', value: p.igpu ? 'نعم' : 'لا' },
        { key: 'cooler', label: 'مبرد مرفق', value: p.coolerIncluded ? 'نعم' : 'لا' },
        { key: 'gaming', label: 'مؤشر الألعاب', value: `${p.gaming}/100`, n: p.gaming, better: 'high' },
        { key: 'multi', label: 'مؤشر تعدد الأنوية', value: `${p.multi}/100`, n: p.multi, better: 'high' },
      ];
    case 'gpu':
      return [
        { key: 'chip', label: 'المعالج الرسومي', value: p.chip },
        { key: 'vram', label: 'الذاكرة', value: `${p.vramGB}GB ${p.vramType}`, n: p.vramGB, better: 'high' },
        { key: 'bus', label: 'عرض الناقل', value: `${p.busBits}-bit`, n: p.busBits, better: 'high' },
        { key: 'tgp', label: 'استهلاك الطاقة', value: `${p.tgp}W`, n: p.tgp, better: 'low' },
        { key: 'psu', label: 'مزود طاقة مقترح', value: `${p.recommendedPsu}W`, n: p.recommendedPsu, better: 'low' },
        { key: 'length', label: 'الطول التقريبي', value: `${p.lengthMM} mm`, n: p.lengthMM, better: 'low' },
        { key: 'connector', label: 'منفذ الطاقة', value: p.connector },
        { key: 'upscaler', label: 'تقنية الرفع', value: p.upscaler },
        { key: 'perf', label: 'مؤشر الأداء (4K)', value: `${p.perf}/100`, n: p.perf, better: 'high' },
      ];
    case 'motherboard':
      return [
        { key: 'socket', label: 'المقبس', value: p.socket },
        { key: 'chipset', label: 'الشريحة', value: p.chipset },
        { key: 'ff', label: 'المقاس', value: p.formFactor },
        { key: 'mem', label: 'الذاكرة', value: `${p.memType} × ${p.memSlots}`, n: p.memSlots, better: 'high' },
        { key: 'memMax', label: 'أقصى سرعة رام', value: `${p.memMaxMTs} MT/s`, n: p.memMaxMTs, better: 'high' },
        { key: 'm2', label: 'منافذ M.2', value: `${p.m2Slots}`, n: p.m2Slots, better: 'high' },
        { key: 'wifi', label: 'الواي فاي', value: p.wifi ?? 'لا يوجد' },
        { key: 'pcie5gpu', label: 'PCIe 5.0 للكرت', value: p.pcie5Gpu ? 'نعم' : 'لا' },
        { key: 'pcie5m2', label: 'PCIe 5.0 للتخزين', value: p.pcie5M2 ? 'نعم' : 'لا' },
      ];
    case 'ram':
      return [
        { key: 'type', label: 'النوع', value: p.memType + (p.cudimm ? ' CUDIMM' : '') },
        { key: 'cap', label: 'السعة', value: `${p.capacityGB}GB (${p.modules}×${p.capacityGB / p.modules})`, n: p.capacityGB, better: 'high' },
        { key: 'speed', label: 'السرعة', value: `${p.speed} MT/s`, n: p.speed, better: 'high' },
        { key: 'cl', label: 'زمن الاستجابة', value: `CL${p.cl}`, n: p.cl, better: 'low' },
        { key: 'lat', label: 'الاستجابة الفعلية', value: `${((p.cl * 2000) / p.speed).toFixed(1)} ns`, n: (p.cl * 2000) / p.speed, better: 'low' },
        { key: 'rgb', label: 'إضاءة RGB', value: p.rgb ? 'نعم' : 'لا' },
      ];
    case 'storage':
      return [
        { key: 'cap', label: 'السعة', value: gb(p.capacityGB), n: p.capacityGB, better: 'high' },
        { key: 'iface', label: 'الواجهة', value: p.interface },
        { key: 'ff', label: 'المقاس', value: p.formFactor },
        { key: 'read', label: 'سرعة القراءة', value: `${p.readMBs.toLocaleString('en')} MB/s`, n: p.readMBs, better: 'high' },
        { key: 'write', label: 'سرعة الكتابة', value: `${p.writeMBs.toLocaleString('en')} MB/s`, n: p.writeMBs, better: 'high' },
        { key: 'dram', label: 'ذاكرة DRAM مؤقتة', value: p.dram ? 'نعم' : 'لا' },
        { key: 'ppt', label: 'سعر الـ TB', value: `${Math.round(p.price / (p.capacityGB / 1000))} ر.س`, n: p.price / (p.capacityGB / 1000), better: 'low' },
      ];
    case 'psu':
      return [
        { key: 'w', label: 'القدرة', value: `${p.watts}W`, n: p.watts, better: 'high' },
        { key: 'rating', label: 'الكفاءة', value: p.rating },
        { key: 'atx', label: 'ATX 3.1', value: p.atx31 ? 'نعم' : 'لا' },
        { key: '12v', label: 'منفذ 12V-2x6 أصلي', value: p.native12v2x6 ? 'نعم' : 'لا' },
        { key: 'mod', label: 'الكابلات', value: p.modular },
      ];
    case 'case':
      return [
        { key: 'ff', label: 'اللوحات المدعومة', value: p.supports.join(' / ') },
        { key: 'gpu', label: 'أقصى طول للكرت', value: `${p.maxGpuMM} mm`, n: p.maxGpuMM, better: 'high' },
        { key: 'cooler', label: 'أقصى ارتفاع للمبرد', value: `${p.maxCoolerMM} mm`, n: p.maxCoolerMM, better: 'high' },
        { key: 'rad', label: 'الرديترات', value: p.radiators.map((r) => `${r}mm`).join(' / ') },
        { key: 'fans', label: 'مراوح مرفقة', value: `${p.fansIncluded}`, n: p.fansIncluded, better: 'high' },
      ];
    case 'cooler':
      return [
        { key: 'type', label: 'النوع', value: p.type === 'aio' ? 'تبريد مائي متكامل' : 'تبريد هوائي' },
        ...(p.heightMM ? [{ key: 'h', label: 'الارتفاع', value: `${p.heightMM} mm`, n: p.heightMM, better: 'low' as const }] : []),
        ...(p.radiatorMM ? [{ key: 'rad', label: 'الرديتر', value: `${p.radiatorMM} mm` }] : []),
        { key: 'w', label: 'قدرة التبريد التقريبية', value: `~${p.ratedW}W`, n: p.ratedW, better: 'high' },
        { key: 'sockets', label: 'المقابس', value: p.sockets.join(' / ') },
      ];
  }
}

/** One-line summary for cards and the assistant context. */
export function shortSpec(p: Part): string {
  switch (p.category) {
    case 'cpu':
      return `${p.cores} نواة · ${p.boostGHz}GHz · ${p.socket}`;
    case 'gpu':
      return `${p.vramGB}GB ${p.vramType} · ${p.tgp}W`;
    case 'motherboard':
      return `${p.chipset} · ${p.formFactor} · ${p.socket}`;
    case 'ram':
      return `${p.capacityGB}GB · ${p.speed} · CL${p.cl}`;
    case 'storage':
      return `${gb(p.capacityGB)} · ${p.interface} · ${p.readMBs.toLocaleString('en')}MB/s`;
    case 'psu':
      return `${p.watts}W · ${p.rating}`;
    case 'case':
      return `${p.supports.join('/')} · كرت حتى ${p.maxGpuMM}mm`;
    case 'cooler':
      return p.type === 'aio' ? `مائي ${p.radiatorMM}mm` : `هوائي · ${p.heightMM}mm`;
  }
}

export const sar = (n: number) => `${Math.round(n).toLocaleString('en')} ر.س`;
