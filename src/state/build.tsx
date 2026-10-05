import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getPart } from '../data/parts';
import type { Build, Category } from '../data/types';
import { load, save } from '../lib/storage';

export const EMPTY_BUILD: Build = { storage: [] };

export interface SavedBuild {
  id: string;
  name: string;
  build: Build;
  savedAt: number;
}

const SINGLE: Exclude<Category, 'storage'>[] = ['cpu', 'motherboard', 'ram', 'gpu', 'psu', 'case', 'cooler'];
const MAX_STORAGE = 4;

/** Drops unknown ids so stale links or old saves never break the UI. */
export function sanitizeBuild(b: Partial<Build> | null | undefined): Build {
  const out: Build = { storage: [] };
  if (!b) return out;
  for (const c of SINGLE) {
    const id = b[c];
    if (typeof id === 'string' && getPart(id)?.category === c) out[c] = id;
  }
  if (Array.isArray(b.storage)) {
    out.storage = b.storage.filter((id) => typeof id === 'string' && getPart(id)?.category === 'storage').slice(0, MAX_STORAGE);
  }
  return out;
}

export function buildToQuery(b: Build): string {
  const p = new URLSearchParams();
  for (const c of SINGLE) if (b[c]) p.set(c, b[c]!);
  if (b.storage.length) p.set('storage', b.storage.join(','));
  return p.toString();
}

export function queryToBuild(search: string): Build | null {
  const p = new URLSearchParams(search);
  const raw: Partial<Build> = { storage: (p.get('storage') ?? '').split(',').filter(Boolean) };
  let any = raw.storage!.length > 0;
  for (const c of SINGLE) {
    const v = p.get(c);
    if (v) {
      raw[c] = v;
      any = true;
    }
  }
  return any ? sanitizeBuild(raw) : null;
}

export function isEmpty(b: Build) {
  return SINGLE.every((c) => !b[c]) && b.storage.length === 0;
}

interface Ctx {
  build: Build;
  setPart: (category: Category, id: string) => void;
  removePart: (category: Category, index?: number) => void;
  loadBuild: (b: Build) => void;
  clear: () => void;
  saved: SavedBuild[];
  saveCurrent: (name: string) => void;
  deleteSaved: (id: string) => void;
  maxStorage: number;
}

const BuildContext = createContext<Ctx | null>(null);

export function BuildProvider({ children }: { children: ReactNode }) {
  const [build, setBuild] = useState<Build>(() => sanitizeBuild(load<Build>('spc.build', EMPTY_BUILD)));
  const [saved, setSaved] = useState<SavedBuild[]>(() => load<SavedBuild[]>('spc.saved', []).map((s) => ({ ...s, build: sanitizeBuild(s.build) })));

  useEffect(() => save('spc.build', build), [build]);
  useEffect(() => save('spc.saved', saved), [saved]);

  const setPart = useCallback((category: Category, id: string) => {
    setBuild((b) => {
      if (category === 'storage') {
        if (b.storage.length >= MAX_STORAGE) return b;
        return { ...b, storage: [...b.storage, id] };
      }
      return { ...b, [category]: id };
    });
  }, []);

  const removePart = useCallback((category: Category, index?: number) => {
    setBuild((b) => {
      if (category === 'storage') return { ...b, storage: b.storage.filter((_, i) => i !== index) };
      const next = { ...b };
      delete next[category];
      return next;
    });
  }, []);

  const loadBuild = useCallback((b: Build) => setBuild(sanitizeBuild(b)), []);
  const clear = useCallback(() => setBuild(EMPTY_BUILD), []);

  const saveCurrent = useCallback(
    (name: string) => {
      setSaved((s) => [{ id: Math.random().toString(36).slice(2, 10), name: name.trim() || 'تجميعتي', build, savedAt: Date.now() }, ...s].slice(0, 30));
    },
    [build],
  );
  const deleteSaved = useCallback((id: string) => setSaved((s) => s.filter((x) => x.id !== id)), []);

  const value = useMemo(
    () => ({ build, setPart, removePart, loadBuild, clear, saved, saveCurrent, deleteSaved, maxStorage: MAX_STORAGE }),
    [build, setPart, removePart, loadBuild, clear, saved, saveCurrent, deleteSaved],
  );
  return <BuildContext.Provider value={value}>{children}</BuildContext.Provider>;
}

export function useBuild() {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error('useBuild must be used inside BuildProvider');
  return ctx;
}
