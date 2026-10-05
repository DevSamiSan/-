# SaudiPC

منصة سعودية لتجميع أجهزة الكمبيوتر: مجمّع قطع مع فحص توافق فوري، وحساب للطاقة، وأسعار تقريبية بالريال، وتجميعات جاهزة، وأدلة، ومساعد ذكي (DeepSeek).

## التقنيات
- React 19 + Vite + TypeScript + Tailwind CSS v4
- مكونات حركة من [React Bits](https://reactbits.dev) في `src/components/rb`
- Cloudflare Pages + Pages Functions (`functions/api/chat.ts` و `functions/api/health.ts`)

## التشغيل
```bash
npm install
npm run dev        # الواجهة فقط
npm run preview    # الواجهة + الـ Functions عبر wrangler
npm run deploy     # نشر على مشروع saudipc في Cloudflare Pages
```

## المتغيرات (في إعدادات مشروع Pages)
- `DEEPSEEK_API_KEY` (سر) — مفتاح DeepSeek. لا يوصل للمتصفح أبدًا.
- `DEEPSEEK_MODEL` (اختياري) — لتحديد الموديل. بدونه يختار الخادم موديل Flash من قائمة `/models` تلقائيًا.

## البيانات
- القطع والأسعار: `src/data/parts.ts`. حدّث `PRICES_UPDATED` كل ما تحدّث الأسعار.
- التجميعات الجاهزة: `src/data/builds.ts`
- الأدلة: `src/data/guides.ts`
- قواعد التوافق: `src/lib/compat.ts`
