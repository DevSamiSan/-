// Generates public/sitemap.xml from the catalog. Run: npm run sitemap
import { writeFileSync } from 'node:fs';
import { GUIDES } from '../src/data/guides';
import { CATEGORY_ORDER, PARTS } from '../src/data/parts';

const base = 'https://saudipc.dev';
const paths = ['/', '/build', '/builds', '/parts', '/compare', '/guides', '/assistant', '/about', ...CATEGORY_ORDER.map((c) => `/parts/${c}`), ...GUIDES.map((g) => `/guides/${g.slug}`), ...PARTS.map((p) => `/part/${p.id}`)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync('public/sitemap.xml', xml);
console.log(`sitemap: ${paths.length} urls`);
