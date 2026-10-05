import type { Part } from '../data/types';

export interface StoreLink {
  name: string;
  url: string;
}

export function storeLinks(p: Part): StoreLink[] {
  const q = encodeURIComponent(p.query ?? `${p.brand} ${p.name}`.replace(/\(.*?\)/g, '').trim());
  return [
    { name: 'Amazon.sa', url: `https://www.amazon.sa/s?k=${q}` },
    { name: 'Microless', url: `https://saudi.microless.com/search/?query=${q}` },
    { name: 'noon', url: `https://www.noon.com/saudi-ar/search/?q=${q}` },
  ];
}
