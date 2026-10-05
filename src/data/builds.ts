import type { Build } from './types';

export interface CuratedBuild {
  id: string;
  name: string;
  tagline: string;
  target: string;
  audience: string;
  accent: string;
  why: string[];
  build: Build;
}

export const CURATED: CuratedBuild[] = [
  {
    id: 'starter-1080p',
    name: 'البداية الذكية',
    tagline: 'أرخص تجميعة تلعب ألعاب 2026 بدقة 1080p',
    target: '1080p',
    audience: 'الطلاب وأول جهاز',
    accent: '#3dffb0',
    why: [
      'منصة AM5 تقبل معالجات أقوى لاحقًا بدون ما تغير اللوحة',
      'RTX 5060 مع DLSS 4 يعطيك أداء ممتاز في 1080p',
      'تقدر تزيد الرام لـ 32GB لاحقًا لما تنزل الأسعار',
    ],
    build: { cpu: 'r5-7600', motherboard: 'asrock-b650m-pro-rs', ram: 'kingston-beast-16-5600', gpu: 'rtx-5060', storage: ['crucial-p3plus-1tb'], psu: 'bequiet-pp12m-650', case: 'lianli-a3' },
  },
  {
    id: 'value-1440p',
    name: 'ملك القيمة',
    tagline: '1440p بإعدادات عالية بدون مبالغة في السعر',
    target: '1440p',
    audience: 'أغلب اللاعبين',
    accent: '#5cc8ff',
    why: [
      'RX 9070 بذاكرة 16GB يقارب أداء كروت أغلى منه بكثير',
      '32GB DDR5-6000 هي السرعة المثالية لمعالجات Ryzen',
      'مبرد Peerless Assassin بسعر رمزي ويبرّد بامتياز',
    ],
    build: { cpu: 'r5-9600x', motherboard: 'msi-b850-gaming-plus', ram: 'crucial-pro-32-6000', gpu: 'rx-9070', storage: ['wd-sn850x-1tb'], psu: 'corsair-rm750e', case: 'montech-xr', cooler: 'tr-pa120-se' },
  },
  {
    id: 'sweet-spot',
    name: 'النقطة الذهبية',
    tagline: 'أفضل أداء لكل ريال في الألعاب التنافسية والثقيلة',
    target: '1440p عالي التردد',
    audience: 'اللاعب الجاد',
    accent: '#e8c26a',
    why: [
      'Ryzen 7 9800X3D من أسرع معالجات الألعاب وبسعر معقول',
      'RX 9070 XT يقارب أداء RTX 5070 Ti بسعر أقل',
      'مزود 850W مع منفذ أصلي يخليك مرتاح لو طوّرت الكرت لاحقًا',
    ],
    build: { cpu: 'r7-9800x3d', motherboard: 'gb-b850-elite', ram: 'corsair-veng-32-6000', gpu: 'rx-9070-xt', storage: ['wd-sn850x-2tb'], psu: 'corsair-rm850x', case: 'lianli-lancool-217', cooler: 'tr-phantom-spirit-evo' },
  },
  {
    id: 'pro-4k',
    name: 'الـ 4K الاحترافي',
    tagline: 'لعب بدقة 4K مع تتبع الأشعة و DLSS 4',
    target: '4K',
    audience: 'عشاق الجرافيكس',
    accent: '#a78bfa',
    why: [
      'Ryzen 7 9850X3D هو أسرع معالج ألعاب حاليًا',
      'RTX 5080 مع Multi Frame Generation للعب 4K بسلاسة',
      'تبريد مائي 360mm وكيس O11 EVO للمظهر والأداء',
    ],
    build: { cpu: 'r7-9850x3d', motherboard: 'msi-x870-tomahawk', ram: 'gskill-z5neo-32-6000', gpu: 'rtx-5080', storage: ['samsung-990pro-2tb'], psu: 'seasonic-gx1000', case: 'lianli-o11-evo', cooler: 'arctic-lf3-360' },
  },
  {
    id: 'creator',
    name: 'استوديو المحتوى',
    tagline: 'مونتاج وبث وألعاب على جهاز واحد',
    target: 'إنتاجية + 1440p',
    audience: 'صنّاع المحتوى والمبرمجين',
    accent: '#ff8fab',
    why: [
      'Core Ultra 7 270K Plus فيه 24 نواة بسعر ممتاز',
      '64GB رام للمونتاج 4K والأجهزة الافتراضية',
      'RTX 5070 Ti فيه NVENC للبث وتسريع للمونتاج',
    ],
    build: { cpu: 'cu7-270k-plus', motherboard: 'msi-z890-tomahawk', ram: 'corsair-veng-64-6000', gpu: 'rtx-5070-ti', storage: ['samsung-990pro-4tb'], psu: 'corsair-rm850x', case: 'fractal-north', cooler: 'noctua-d15-g2' },
  },
  {
    id: 'itx',
    name: 'الصغير الجبار',
    tagline: 'قوة 1440p في كيس ITX صغير',
    target: '1440p',
    audience: 'محبي المكاتب المرتبة',
    accent: '#7ee787',
    why: [
      'كيس NR200P V2 يستوعب كروت حتى 336mm',
      'RTX 5070 قصير وموفر للطاقة ويناسب الأكياس الصغيرة',
      'تبريد مائي 240mm يبرّد المعالج بهدوء في المساحة الضيقة',
    ],
    build: { cpu: 'r7-9800x3d', motherboard: 'asus-b850-i', ram: 'corsair-veng-32-6000', gpu: 'rtx-5070', storage: ['wd-sn850x-2tb'], psu: 'corsair-rm750e', case: 'cm-nr200p-v2', cooler: 'arctic-lf3-240' },
  },
  {
    id: 'ultimate',
    name: 'الوحش المطلق',
    tagline: 'بدون أي تنازلات',
    target: '4K + ذكاء اصطناعي',
    audience: 'اللي يبي الأفضل وبس',
    accent: '#ff5d6c',
    why: [
      'RTX 5090 بذاكرة 32GB للألعاب وتشغيل نماذج الذكاء الاصطناعي محليًا',
      'Ryzen 9 9950X3D يجمع أداء الألعاب و16 نواة للإنتاجية',
      'مزود 1200W Platinum يتحمّل استهلاك الـ 5090 بأمان',
    ],
    build: { cpu: 'r9-9950x3d', motherboard: 'asus-x870e-e', ram: 'corsair-veng-64-6000', gpu: 'rtx-5090', storage: ['samsung-9100-2tb', 'samsung-990pro-4tb'], psu: 'corsair-hx1200i', case: 'lianli-o11-evo', cooler: 'lianli-galahad2-360' },
  },
];
