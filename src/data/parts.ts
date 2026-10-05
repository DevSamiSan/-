import type { Case, Category, Cooler, CPU, GPU, Motherboard, Part, PSU, RAM, Storage } from './types';

/**
 * Catalog snapshot — October 2026.
 * Prices are approximate Saudi street prices in SAR (VAT included), gathered from
 * Saudi retailers (Amazon.sa, Microless, PC Palace, Caza Souq…). Memory and GPU
 * prices are volatile during the 2026 DRAM shortage, so every part links to live
 * store searches.
 */
export const PRICES_UPDATED = '2026-10';

const cpus: CPU[] = [
  { id: 'r7-9850x3d', category: 'cpu', brand: 'AMD', name: 'Ryzen 7 9850X3D', price: 2150, released: '2026-01', socket: 'AM5', cores: 8, threads: 16, baseGHz: 4.7, boostGHz: 5.6, l3MB: 96, tdp: 120, maxPower: 162, igpu: true, coolerIncluded: false, memMaxMTs: 5600, gaming: 100, multi: 55, note: 'أسرع معالج ألعاب في السوق حاليًا بفضل 3D V-Cache وتردد 5.6GHz.' },
  { id: 'r7-9800x3d', category: 'cpu', brand: 'AMD', name: 'Ryzen 7 9800X3D', price: 1600, released: '2024-11', socket: 'AM5', cores: 8, threads: 16, baseGHz: 4.7, boostGHz: 5.2, l3MB: 96, tdp: 120, maxPower: 162, igpu: true, coolerIncluded: false, memMaxMTs: 5600, gaming: 97, multi: 52, note: 'أفضل قيمة للألعاب: أبطأ من 9850X3D بحوالي 3% فقط وأرخص منه بكثير.' },
  { id: 'r9-9950x3d', category: 'cpu', brand: 'AMD', name: 'Ryzen 9 9950X3D', price: 2900, released: '2025-03', socket: 'AM5', cores: 16, threads: 32, baseGHz: 4.3, boostGHz: 5.7, l3MB: 128, tdp: 170, maxPower: 230, igpu: true, coolerIncluded: false, memMaxMTs: 5600, gaming: 96, multi: 99, note: 'للي يبي الألعاب والإنتاجية الثقيلة بنفس الوقت: 16 نواة مع V-Cache.' },
  { id: 'r9-9950x', category: 'cpu', brand: 'AMD', name: 'Ryzen 9 9950X', price: 2100, released: '2024-08', socket: 'AM5', cores: 16, threads: 32, baseGHz: 4.3, boostGHz: 5.7, l3MB: 64, tdp: 170, maxPower: 230, igpu: true, coolerIncluded: false, memMaxMTs: 5600, gaming: 84, multi: 100, note: 'وحش المونتاج والرندر والبرمجة.' },
  { id: 'r9-9900x', category: 'cpu', brand: 'AMD', name: 'Ryzen 9 9900X', price: 1450, released: '2024-08', socket: 'AM5', cores: 12, threads: 24, baseGHz: 4.4, boostGHz: 5.6, l3MB: 64, tdp: 120, maxPower: 162, igpu: true, coolerIncluded: false, memMaxMTs: 5600, gaming: 83, multi: 78 },
  { id: 'r7-9700x', category: 'cpu', brand: 'AMD', name: 'Ryzen 7 9700X', price: 1100, released: '2024-08', socket: 'AM5', cores: 8, threads: 16, baseGHz: 3.8, boostGHz: 5.5, l3MB: 32, tdp: 65, maxPower: 88, igpu: true, coolerIncluded: false, memMaxMTs: 5600, gaming: 82, multi: 52, note: 'استهلاك منخفض جدًا وحرارة سهلة.' },
  { id: 'r5-9600x', category: 'cpu', brand: 'AMD', name: 'Ryzen 5 9600X', price: 800, released: '2024-08', socket: 'AM5', cores: 6, threads: 12, baseGHz: 3.9, boostGHz: 5.4, l3MB: 32, tdp: 65, maxPower: 88, igpu: true, coolerIncluded: false, memMaxMTs: 5600, gaming: 79, multi: 42 },
  { id: 'r5-9600', category: 'cpu', brand: 'AMD', name: 'Ryzen 5 9600', price: 730, released: '2025-02', socket: 'AM5', cores: 6, threads: 12, baseGHz: 3.8, boostGHz: 5.2, l3MB: 32, tdp: 65, maxPower: 88, igpu: true, coolerIncluded: true, memMaxMTs: 5600, gaming: 76, multi: 40, note: 'يجي معه مبرد Wraith Stealth.' },
  { id: 'r5-7600', category: 'cpu', brand: 'AMD', name: 'Ryzen 5 7600', price: 620, released: '2023-01', socket: 'AM5', cores: 6, threads: 12, baseGHz: 3.8, boostGHz: 5.1, l3MB: 32, tdp: 65, maxPower: 88, igpu: true, coolerIncluded: true, memMaxMTs: 5200, gaming: 72, multi: 36, note: 'أرخص دخول لمنصة AM5 مع مبرد مرفق، ويقبل الترقية لاحقًا.' },
  { id: 'cu9-285k', category: 'cpu', brand: 'Intel', name: 'Core Ultra 9 285K', price: 2300, released: '2024-10', socket: 'LGA1851', cores: 24, threads: 24, pCores: 8, eCores: 16, baseGHz: 3.7, boostGHz: 5.7, l3MB: 36, tdp: 125, maxPower: 250, igpu: true, coolerIncluded: false, memMaxMTs: 6400, gaming: 82, multi: 97 },
  { id: 'cu7-270k-plus', category: 'cpu', brand: 'Intel', name: 'Core Ultra 7 270K Plus', price: 1450, released: '2026-03', socket: 'LGA1851', cores: 24, threads: 24, pCores: 8, eCores: 16, baseGHz: 3.7, boostGHz: 5.5, l3MB: 36, tdp: 125, maxPower: 250, igpu: true, coolerIncluded: false, memMaxMTs: 7200, gaming: 85, multi: 93, note: 'من جيل Arrow Lake Refresh: أداء 285K تقريبًا بسعر أقل بكثير، ويدعم DDR5-7200.' },
  { id: 'cu7-265k', category: 'cpu', brand: 'Intel', name: 'Core Ultra 7 265K', price: 1250, released: '2024-10', socket: 'LGA1851', cores: 20, threads: 20, pCores: 8, eCores: 12, baseGHz: 3.9, boostGHz: 5.5, l3MB: 30, tdp: 125, maxPower: 250, igpu: true, coolerIncluded: false, memMaxMTs: 6400, gaming: 80, multi: 85 },
  { id: 'cu5-250k-plus', category: 'cpu', brand: 'Intel', name: 'Core Ultra 5 250K Plus', price: 950, released: '2026-03', socket: 'LGA1851', cores: 18, threads: 18, pCores: 6, eCores: 12, baseGHz: 4.2, boostGHz: 5.3, l3MB: 24, tdp: 125, maxPower: 159, igpu: true, coolerIncluded: false, memMaxMTs: 7200, gaming: 77, multi: 68, note: 'أقوى معالج متوسط في تعدد الأنوية بهذا السعر.' },
  { id: 'i5-14400f', category: 'cpu', brand: 'Intel', name: 'Core i5-14400F', price: 520, released: '2024-01', socket: 'LGA1700', cores: 10, threads: 16, pCores: 6, eCores: 4, baseGHz: 2.5, boostGHz: 4.7, l3MB: 20, tdp: 65, maxPower: 148, igpu: false, coolerIncluded: true, memMaxMTs: 5600, gaming: 66, multi: 38, note: 'خيار اقتصادي، بس منصته ما فيها ترقيات قادمة، وما فيه معالج رسومي مدمج.' },
];

const motherboards: Motherboard[] = [
  { id: 'asus-x870e-e', category: 'motherboard', brand: 'ASUS', name: 'ROG Strix X870E-E Gaming WiFi', price: 2100, released: '2024-10', socket: 'AM5', chipset: 'X870E', formFactor: 'ATX', memType: 'DDR5', memSlots: 4, memMaxMTs: 8000, m2Slots: 5, wifi: 'Wi-Fi 7', pcie5Gpu: true, pcie5M2: true },
  { id: 'msi-x870-tomahawk', category: 'motherboard', brand: 'MSI', name: 'MAG X870 Tomahawk WiFi', price: 1250, released: '2024-10', socket: 'AM5', chipset: 'X870', formFactor: 'ATX', memType: 'DDR5', memSlots: 4, memMaxMTs: 8000, m2Slots: 4, wifi: 'Wi-Fi 7', pcie5Gpu: true, pcie5M2: true, note: 'من أفضل لوحات AM5 من حيث القيمة والمزايا.' },
  { id: 'gb-b850-elite', category: 'motherboard', brand: 'Gigabyte', name: 'B850 Aorus Elite WiFi7', price: 950, released: '2025-01', socket: 'AM5', chipset: 'B850', formFactor: 'ATX', memType: 'DDR5', memSlots: 4, memMaxMTs: 8000, m2Slots: 3, wifi: 'Wi-Fi 7', pcie5Gpu: true, pcie5M2: true },
  { id: 'msi-b850-gaming-plus', category: 'motherboard', brand: 'MSI', name: 'B850 Gaming Plus WiFi', price: 800, released: '2025-01', socket: 'AM5', chipset: 'B850', formFactor: 'ATX', memType: 'DDR5', memSlots: 4, memMaxMTs: 8000, m2Slots: 3, wifi: 'Wi-Fi 7', pcie5Gpu: false, pcie5M2: true },
  { id: 'asrock-b650m-pro-rs', category: 'motherboard', brand: 'ASRock', name: 'B650M Pro RS WiFi', price: 520, released: '2023-05', socket: 'AM5', chipset: 'B650', formFactor: 'mATX', memType: 'DDR5', memSlots: 4, memMaxMTs: 6400, m2Slots: 3, wifi: 'Wi-Fi 6E', pcie5Gpu: false, pcie5M2: true, note: 'لوحة اقتصادية ممتازة. تأكد إن الـ BIOS محدّث إذا بتركب معالج من سلسلة 9000.' },
  { id: 'asus-b850-i', category: 'motherboard', brand: 'ASUS', name: 'ROG Strix B850-I Gaming WiFi', price: 1300, released: '2025-01', socket: 'AM5', chipset: 'B850', formFactor: 'ITX', memType: 'DDR5', memSlots: 2, memMaxMTs: 8000, m2Slots: 2, wifi: 'Wi-Fi 7', pcie5Gpu: true, pcie5M2: true },
  { id: 'asus-z890-e', category: 'motherboard', brand: 'ASUS', name: 'ROG Strix Z890-E Gaming WiFi', price: 2200, released: '2024-10', socket: 'LGA1851', chipset: 'Z890', formFactor: 'ATX', memType: 'DDR5', memSlots: 4, memMaxMTs: 9000, m2Slots: 5, wifi: 'Wi-Fi 7', pcie5Gpu: true, pcie5M2: true },
  { id: 'msi-z890-tomahawk', category: 'motherboard', brand: 'MSI', name: 'MAG Z890 Tomahawk WiFi', price: 1250, released: '2024-10', socket: 'LGA1851', chipset: 'Z890', formFactor: 'ATX', memType: 'DDR5', memSlots: 4, memMaxMTs: 9000, m2Slots: 4, wifi: 'Wi-Fi 7', pcie5Gpu: true, pcie5M2: true },
  { id: 'gb-b860-elite', category: 'motherboard', brand: 'Gigabyte', name: 'B860 Aorus Elite WiFi7', price: 850, released: '2025-01', socket: 'LGA1851', chipset: 'B860', formFactor: 'ATX', memType: 'DDR5', memSlots: 4, memMaxMTs: 8000, m2Slots: 3, wifi: 'Wi-Fi 7', pcie5Gpu: true, pcie5M2: false, note: 'شريحة B860 ما تدعم كسر سرعة المعالج، بس تدعم كسر سرعة الرامات.' },
  { id: 'msi-b860m-a', category: 'motherboard', brand: 'MSI', name: 'PRO B860M-A WiFi', price: 560, released: '2025-01', socket: 'LGA1851', chipset: 'B860', formFactor: 'mATX', memType: 'DDR5', memSlots: 4, memMaxMTs: 7200, m2Slots: 2, wifi: 'Wi-Fi 6E', pcie5Gpu: false, pcie5M2: false },
  { id: 'msi-b760m-a', category: 'motherboard', brand: 'MSI', name: 'PRO B760M-A WiFi (DDR5)', price: 520, released: '2023-01', socket: 'LGA1700', chipset: 'B760', formFactor: 'mATX', memType: 'DDR5', memSlots: 4, memMaxMTs: 6800, m2Slots: 2, wifi: 'Wi-Fi 6E', pcie5Gpu: false, pcie5M2: false },
];

const rams: RAM[] = [
  { id: 'gskill-z5neo-32-6000', category: 'ram', brand: 'G.Skill', name: 'Trident Z5 Neo RGB 32GB (2×16) DDR5-6000 CL30', price: 2900, released: '2023-03', memType: 'DDR5', capacityGB: 32, modules: 2, speed: 6000, cl: 30, rgb: true, note: 'مصممة لمنصة AM5 (EXPO)، وتوقيتاتها ممتازة.' },
  { id: 'corsair-veng-32-6000', category: 'ram', brand: 'Corsair', name: 'Vengeance 32GB (2×16) DDR5-6000 CL30', price: 2200, released: '2023-01', memType: 'DDR5', capacityGB: 32, modules: 2, speed: 6000, cl: 30, rgb: false, note: 'السرعة المثالية لمعالجات Ryzen: 6000MT/s مع CL30.' },
  { id: 'crucial-pro-32-6000', category: 'ram', brand: 'Crucial', name: 'Pro 32GB (2×16) DDR5-6000 CL36', price: 1990, released: '2024-02', memType: 'DDR5', capacityGB: 32, modules: 2, speed: 6000, cl: 36, rgb: false },
  { id: 'kingston-beast-32-5600', category: 'ram', brand: 'Kingston', name: 'Fury Beast 32GB (2×16) DDR5-5600 CL36', price: 1850, released: '2023-01', memType: 'DDR5', capacityGB: 32, modules: 2, speed: 5600, cl: 36, rgb: false },
  { id: 'kingston-beast-16-5600', category: 'ram', brand: 'Kingston', name: 'Fury Beast 16GB (2×8) DDR5-5600 CL36', price: 1050, released: '2023-01', memType: 'DDR5', capacityGB: 16, modules: 2, speed: 5600, cl: 36, rgb: false, note: '16GB تكفي للألعاب الخفيفة، بس 32GB صارت المعيار في 2026.' },
  { id: 'gskill-flare-48-6000', category: 'ram', brand: 'G.Skill', name: 'Flare X5 48GB (2×24) DDR5-6000 CL36', price: 3100, released: '2024-01', memType: 'DDR5', capacityGB: 48, modules: 2, speed: 6000, cl: 36, rgb: false },
  { id: 'corsair-veng-64-6000', category: 'ram', brand: 'Corsair', name: 'Vengeance 64GB (2×32) DDR5-6000 CL30', price: 4300, released: '2024-03', memType: 'DDR5', capacityGB: 64, modules: 2, speed: 6000, cl: 30, rgb: false, note: 'للمونتاج والذكاء الاصطناعي المحلي والأجهزة الافتراضية.' },
  { id: 'kingston-renegade-32-8200', category: 'ram', brand: 'Kingston', name: 'Fury Renegade 32GB (2×16) DDR5-8200 CUDIMM', price: 3000, released: '2024-11', memType: 'DDR5', capacityGB: 32, modules: 2, speed: 8200, cl: 40, rgb: true, cudimm: true, note: 'رامات CUDIMM سريعة مخصصة للوحات Intel Z890.' },
];

const gpus: GPU[] = [
  { id: 'rtx-5090', category: 'gpu', brand: 'NVIDIA', vendor: 'NVIDIA', name: 'GeForce RTX 5090 32GB', chip: 'GB202 (Blackwell)', price: 17500, released: '2025-01', vramGB: 32, vramType: 'GDDR7', busBits: 512, tgp: 575, recommendedPsu: 1000, lengthMM: 340, connector: '12V-2x6', perf: 100, upscaler: 'DLSS 4', note: 'الأقوى بلا منافس، بس سعره في السوق صار أكثر من ضعف سعره الرسمي بسبب أزمة الذاكرة.' },
  { id: 'rtx-5080', category: 'gpu', brand: 'NVIDIA', vendor: 'NVIDIA', name: 'GeForce RTX 5080 16GB', chip: 'GB203 (Blackwell)', price: 5800, released: '2025-01', vramGB: 16, vramType: 'GDDR7', busBits: 256, tgp: 360, recommendedPsu: 850, lengthMM: 330, connector: '12V-2x6', perf: 66, upscaler: 'DLSS 4' },
  { id: 'rtx-5070-ti', category: 'gpu', brand: 'NVIDIA', vendor: 'NVIDIA', name: 'GeForce RTX 5070 Ti 16GB', chip: 'GB203 (Blackwell)', price: 4700, released: '2025-02', vramGB: 16, vramType: 'GDDR7', busBits: 256, tgp: 300, recommendedPsu: 750, lengthMM: 305, connector: '12V-2x6', perf: 57, upscaler: 'DLSS 4', note: 'أفضل كرت NVIDIA للدقة 1440p العالية وبداية 4K.' },
  { id: 'rtx-5070', category: 'gpu', brand: 'NVIDIA', vendor: 'NVIDIA', name: 'GeForce RTX 5070 12GB', chip: 'GB205 (Blackwell)', price: 2900, released: '2025-03', vramGB: 12, vramType: 'GDDR7', busBits: 192, tgp: 250, recommendedPsu: 650, lengthMM: 270, connector: '12V-2x6', perf: 45, upscaler: 'DLSS 4' },
  { id: 'rtx-5060-ti-16', category: 'gpu', brand: 'NVIDIA', vendor: 'NVIDIA', name: 'GeForce RTX 5060 Ti 16GB', chip: 'GB206 (Blackwell)', price: 2100, released: '2025-04', vramGB: 16, vramType: 'GDDR7', busBits: 128, tgp: 180, recommendedPsu: 600, lengthMM: 240, connector: '8-pin', perf: 33, upscaler: 'DLSS 4', note: 'نسخة 16GB أفضل بكثير من 8GB للألعاب الحديثة.' },
  { id: 'rtx-5060-ti-8', category: 'gpu', brand: 'NVIDIA', vendor: 'NVIDIA', name: 'GeForce RTX 5060 Ti 8GB', chip: 'GB206 (Blackwell)', price: 1750, released: '2025-04', vramGB: 8, vramType: 'GDDR7', busBits: 128, tgp: 180, recommendedPsu: 600, lengthMM: 240, connector: '8-pin', perf: 30, upscaler: 'DLSS 4', note: 'ذاكرة 8GB صارت محدودة في ألعاب 2026 على الإعدادات العالية.' },
  { id: 'rtx-5060', category: 'gpu', brand: 'NVIDIA', vendor: 'NVIDIA', name: 'GeForce RTX 5060 8GB', chip: 'GB206 (Blackwell)', price: 1400, released: '2025-05', vramGB: 8, vramType: 'GDDR7', busBits: 128, tgp: 145, recommendedPsu: 550, lengthMM: 230, connector: '8-pin', perf: 27, upscaler: 'DLSS 4' },
  { id: 'rtx-5050', category: 'gpu', brand: 'NVIDIA', vendor: 'NVIDIA', name: 'GeForce RTX 5050 8GB', chip: 'GB207 (Blackwell)', price: 1150, released: '2025-07', vramGB: 8, vramType: 'GDDR6', busBits: 128, tgp: 130, recommendedPsu: 550, lengthMM: 220, connector: '8-pin', perf: 21, upscaler: 'DLSS 4', note: 'خيار ميزانية للعب بدقة 1080p.' },
  { id: 'rx-9070-xt', category: 'gpu', brand: 'AMD', vendor: 'AMD', name: 'Radeon RX 9070 XT 16GB', chip: 'Navi 48 (RDNA 4)', price: 3300, released: '2025-03', vramGB: 16, vramType: 'GDDR6', busBits: 256, tgp: 304, recommendedPsu: 750, lengthMM: 320, connector: '8-pin', perf: 56, upscaler: 'FSR 4', note: 'يقارب أداء RTX 5070 Ti بسعر أقل بحوالي 1,400 ريال. ملك القيمة في 1440p.' },
  { id: 'rx-9070', category: 'gpu', brand: 'AMD', vendor: 'AMD', name: 'Radeon RX 9070 16GB', chip: 'Navi 48 (RDNA 4)', price: 2900, released: '2025-03', vramGB: 16, vramType: 'GDDR6', busBits: 256, tgp: 220, recommendedPsu: 650, lengthMM: 300, connector: '8-pin', perf: 50, upscaler: 'FSR 4', note: 'استهلاك طاقة ممتاز، وأداؤه قريب من 9070 XT.' },
  { id: 'rx-9060-xt-16', category: 'gpu', brand: 'AMD', vendor: 'AMD', name: 'Radeon RX 9060 XT 16GB', chip: 'Navi 44 (RDNA 4)', price: 1800, released: '2025-06', vramGB: 16, vramType: 'GDDR6', busBits: 128, tgp: 160, recommendedPsu: 500, lengthMM: 250, connector: '8-pin', perf: 31, upscaler: 'FSR 4' },
  { id: 'rx-9060-xt-8', category: 'gpu', brand: 'AMD', vendor: 'AMD', name: 'Radeon RX 9060 XT 8GB', chip: 'Navi 44 (RDNA 4)', price: 1450, released: '2025-06', vramGB: 8, vramType: 'GDDR6', busBits: 128, tgp: 150, recommendedPsu: 500, lengthMM: 240, connector: '8-pin', perf: 28, upscaler: 'FSR 4' },
  { id: 'arc-b580', category: 'gpu', brand: 'Intel', vendor: 'Intel', name: 'Arc B580 12GB', chip: 'BMG-G21 (Battlemage)', price: 1250, released: '2024-12', vramGB: 12, vramType: 'GDDR6', busBits: 192, tgp: 190, recommendedPsu: 600, lengthMM: 272, connector: '8-pin', perf: 24, upscaler: 'XeSS 2', note: 'ذاكرة 12GB بسعر اقتصادي. يحتاج تفعيل Resizable BAR.' },
  { id: 'arc-b570', category: 'gpu', brand: 'Intel', vendor: 'Intel', name: 'Arc B570 10GB', chip: 'BMG-G21 (Battlemage)', price: 1050, released: '2025-01', vramGB: 10, vramType: 'GDDR6', busBits: 160, tgp: 150, recommendedPsu: 500, lengthMM: 250, connector: '8-pin', perf: 21, upscaler: 'XeSS 2' },
];

const storages: Storage[] = [
  { id: 'samsung-9100-2tb', category: 'storage', brand: 'Samsung', name: '9100 Pro 2TB', price: 1600, released: '2025-03', interface: 'PCIe 5.0', formFactor: 'M.2', capacityGB: 2000, readMBs: 14700, writeMBs: 13400, dram: true },
  { id: 'crucial-t705-2tb', category: 'storage', brand: 'Crucial', name: 'T705 2TB', price: 1500, released: '2024-03', interface: 'PCIe 5.0', formFactor: 'M.2', capacityGB: 2000, readMBs: 14500, writeMBs: 12700, dram: true },
  { id: 'samsung-990pro-4tb', category: 'storage', brand: 'Samsung', name: '990 Pro 4TB', price: 2100, released: '2023-10', interface: 'PCIe 4.0', formFactor: 'M.2', capacityGB: 4000, readMBs: 7450, writeMBs: 6900, dram: true },
  { id: 'samsung-990pro-2tb', category: 'storage', brand: 'Samsung', name: '990 Pro 2TB', price: 1050, released: '2022-10', interface: 'PCIe 4.0', formFactor: 'M.2', capacityGB: 2000, readMBs: 7450, writeMBs: 6900, dram: true },
  { id: 'wd-sn850x-2tb', category: 'storage', brand: 'WD', name: 'Black SN850X 2TB', price: 950, released: '2022-08', interface: 'PCIe 4.0', formFactor: 'M.2', capacityGB: 2000, readMBs: 7300, writeMBs: 6600, dram: true },
  { id: 'wd-sn850x-1tb', category: 'storage', brand: 'WD', name: 'Black SN850X 1TB', price: 520, released: '2022-08', interface: 'PCIe 4.0', formFactor: 'M.2', capacityGB: 1000, readMBs: 7300, writeMBs: 6300, dram: true },
  { id: 'kingston-nv3-2tb', category: 'storage', brand: 'Kingston', name: 'NV3 2TB', price: 650, released: '2024-09', interface: 'PCIe 4.0', formFactor: 'M.2', capacityGB: 2000, readMBs: 6000, writeMBs: 5000, dram: false },
  { id: 'crucial-p3plus-1tb', category: 'storage', brand: 'Crucial', name: 'P3 Plus 1TB', price: 380, released: '2022-06', interface: 'PCIe 4.0', formFactor: 'M.2', capacityGB: 1000, readMBs: 5000, writeMBs: 3600, dram: false },
  { id: 'samsung-870evo-1tb', category: 'storage', brand: 'Samsung', name: '870 EVO 1TB (SATA)', price: 420, released: '2021-01', interface: 'SATA', formFactor: '2.5"', capacityGB: 1000, readMBs: 560, writeMBs: 530, dram: true, note: 'مناسب كقرص ثاني للتخزين، مو للنظام.' },
];

const psus: PSU[] = [
  { id: 'corsair-hx1200i', category: 'psu', brand: 'Corsair', name: 'HX1200i (ATX 3.1)', price: 1500, released: '2024-06', watts: 1200, rating: '80+ Platinum', atx31: true, native12v2x6: true, modular: 'كامل' },
  { id: 'seasonic-gx1000', category: 'psu', brand: 'Seasonic', name: 'Focus GX-1000 (ATX 3.1)', price: 850, released: '2024-03', watts: 1000, rating: '80+ Gold', atx31: true, native12v2x6: true, modular: 'كامل' },
  { id: 'corsair-rm850x', category: 'psu', brand: 'Corsair', name: 'RM850x (ATX 3.1)', price: 620, released: '2024-06', watts: 850, rating: '80+ Gold', atx31: true, native12v2x6: true, modular: 'كامل' },
  { id: 'msi-a850gl', category: 'psu', brand: 'MSI', name: 'MAG A850GL PCIE5', price: 430, released: '2023-06', watts: 850, rating: '80+ Gold', atx31: true, native12v2x6: true, modular: 'كامل' },
  { id: 'corsair-rm750e', category: 'psu', brand: 'Corsair', name: 'RM750e (ATX 3.1)', price: 450, released: '2025-01', watts: 750, rating: '80+ Gold', atx31: true, native12v2x6: true, modular: 'كامل' },
  { id: 'bequiet-pp12m-650', category: 'psu', brand: 'be quiet!', name: 'Pure Power 12 M 650W', price: 380, released: '2023-03', watts: 650, rating: '80+ Gold', atx31: true, native12v2x6: true, modular: 'كامل' },
  { id: 'msi-a650bn', category: 'psu', brand: 'MSI', name: 'MAG A650BN', price: 230, released: '2021-06', watts: 650, rating: '80+ Bronze', atx31: false, native12v2x6: false, modular: 'غير معياري', note: 'ميزانية فقط. ما فيه منفذ 12V-2x6 ولا يدعم ATX 3.1.' },
];

const cases: Case[] = [
  { id: 'lianli-o11-evo', category: 'case', brand: 'Lian Li', name: 'O11 Dynamic EVO', price: 650, released: '2022-03', supports: ['ATX', 'mATX', 'ITX'], maxGpuMM: 422, maxCoolerMM: 167, radiators: [240, 280, 360], fansIncluded: 0, note: 'الكيس الأيقوني بزجاج من جهتين، بس المراوح تشتريها لحالها.' },
  { id: 'lianli-lancool-217', category: 'case', brand: 'Lian Li', name: 'Lancool 217', price: 450, released: '2023-06', supports: ['ATX', 'mATX', 'ITX'], maxGpuMM: 400, maxCoolerMM: 180, radiators: [240, 280, 360], fansIncluded: 5 },
  { id: 'fractal-north', category: 'case', brand: 'Fractal Design', name: 'North', price: 600, released: '2022-10', supports: ['ATX', 'mATX', 'ITX'], maxGpuMM: 355, maxCoolerMM: 170, radiators: [240, 280, 360], fansIncluded: 2, note: 'تصميم أنيق بلمسة خشب طبيعي.' },
  { id: 'nzxt-h6-flow', category: 'case', brand: 'NZXT', name: 'H6 Flow', price: 500, released: '2023-06', supports: ['ATX', 'mATX', 'ITX'], maxGpuMM: 365, maxCoolerMM: 163, radiators: [240, 280, 360], fansIncluded: 3 },
  { id: 'corsair-4000d', category: 'case', brand: 'Corsair', name: '4000D Airflow', price: 380, released: '2020-09', supports: ['ATX', 'mATX', 'ITX'], maxGpuMM: 360, maxCoolerMM: 170, radiators: [240, 280, 360], fansIncluded: 2 },
  { id: 'montech-xr', category: 'case', brand: 'Montech', name: 'XR', price: 320, released: '2024-03', supports: ['ATX', 'mATX', 'ITX'], maxGpuMM: 420, maxCoolerMM: 175, radiators: [240, 280, 360], fansIncluded: 3, note: 'قيمة ممتازة مع 3 مراوح ARGB.' },
  { id: 'lianli-a3', category: 'case', brand: 'Lian Li', name: 'A3-mATX', price: 350, released: '2024-06', supports: ['mATX', 'ITX'], maxGpuMM: 415, maxCoolerMM: 165, radiators: [240, 280, 360], fansIncluded: 0 },
  { id: 'cm-nr200p-v2', category: 'case', brand: 'Cooler Master', name: 'NR200P V2', price: 450, released: '2024-01', supports: ['ITX'], maxGpuMM: 336, maxCoolerMM: 155, radiators: [240, 280], fansIncluded: 2, note: 'كيس ITX صغير يستوعب كروت كبيرة.' },
];

const coolers: Cooler[] = [
  { id: 'arctic-lf3-360', category: 'cooler', brand: 'Arctic', name: 'Liquid Freezer III Pro 360', price: 480, released: '2024-09', type: 'aio', radiatorMM: 360, ratedW: 300, sockets: ['AM5', 'LGA1851', 'LGA1700'], note: 'من أفضل مبردات المياه أداءً مقابل السعر.' },
  { id: 'arctic-lf3-240', category: 'cooler', brand: 'Arctic', name: 'Liquid Freezer III Pro 240', price: 380, released: '2024-09', type: 'aio', radiatorMM: 240, ratedW: 250, sockets: ['AM5', 'LGA1851', 'LGA1700'] },
  { id: 'lianli-galahad2-360', category: 'cooler', brand: 'Lian Li', name: 'Galahad II Trinity 360', price: 700, released: '2023-06', type: 'aio', radiatorMM: 360, ratedW: 300, sockets: ['AM5', 'LGA1851', 'LGA1700'] },
  { id: 'noctua-d15-g2', category: 'cooler', brand: 'Noctua', name: 'NH-D15 G2', price: 650, released: '2024-06', type: 'air', heightMM: 168, ratedW: 280, sockets: ['AM5', 'LGA1851', 'LGA1700'] },
  { id: 'deepcool-ak620-digital', category: 'cooler', brand: 'DeepCool', name: 'AK620 Digital', price: 330, released: '2023-03', type: 'air', heightMM: 162, ratedW: 260, sockets: ['AM5', 'LGA1851', 'LGA1700'] },
  { id: 'tr-phantom-spirit-evo', category: 'cooler', brand: 'Thermalright', name: 'Phantom Spirit 120 EVO', price: 240, released: '2024-03', type: 'air', heightMM: 157, ratedW: 260, sockets: ['AM5', 'LGA1851', 'LGA1700'], note: 'ينافس مبردات بضعف سعره.' },
  { id: 'tr-pa120-se', category: 'cooler', brand: 'Thermalright', name: 'Peerless Assassin 120 SE', price: 170, released: '2022-06', type: 'air', heightMM: 155, ratedW: 240, sockets: ['AM5', 'LGA1851', 'LGA1700'], note: 'أفضل مبرد هواء اقتصادي.' },
  { id: 'idc-se224-xts', category: 'cooler', brand: 'ID-Cooling', name: 'SE-224-XTS', price: 100, released: '2022-01', type: 'air', heightMM: 150, ratedW: 180, sockets: ['AM5', 'LGA1851', 'LGA1700'] },
  { id: 'tr-axp90-x47', category: 'cooler', brand: 'Thermalright', name: 'AXP90-X47 (منخفض)', price: 120, released: '2021-06', type: 'air', heightMM: 47, ratedW: 110, sockets: ['AM5', 'LGA1851', 'LGA1700'], note: 'للأكياس الصغيرة جدًا والمعالجات الاقتصادية فقط.' },
];

export const PARTS: Part[] = [...cpus, ...motherboards, ...rams, ...gpus, ...storages, ...psus, ...cases, ...coolers];

const byId = new Map(PARTS.map((p) => [p.id, p]));

export function getPart(id: string | undefined | null): Part | undefined {
  return id ? byId.get(id) : undefined;
}

export function partsIn<C extends Category>(category: C) {
  return PARTS.filter((p): p is Extract<Part, { category: C }> => p.category === category);
}

export const CATEGORY_META: Record<Category, { label: string; plural: string; short: string }> = {
  cpu: { label: 'المعالج', plural: 'المعالجات', short: 'CPU' },
  motherboard: { label: 'اللوحة الأم', plural: 'اللوحات الأم', short: 'Motherboard' },
  ram: { label: 'الذاكرة (RAM)', plural: 'الرامات', short: 'RAM' },
  gpu: { label: 'كرت الشاشة', plural: 'كروت الشاشة', short: 'GPU' },
  storage: { label: 'التخزين', plural: 'أقراص التخزين', short: 'SSD' },
  psu: { label: 'مزود الطاقة', plural: 'مزودات الطاقة', short: 'PSU' },
  case: { label: 'الكيس', plural: 'الأكياس', short: 'Case' },
  cooler: { label: 'مبرد المعالج', plural: 'المبردات', short: 'Cooler' },
};

export const CATEGORY_ORDER: Category[] = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case', 'cooler'];
