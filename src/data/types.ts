export type Category = 'cpu' | 'motherboard' | 'ram' | 'gpu' | 'storage' | 'psu' | 'case' | 'cooler';

export type Socket = 'AM5' | 'LGA1851' | 'LGA1700';
export type FormFactor = 'ATX' | 'mATX' | 'ITX';

interface PartBase {
  id: string;
  category: Category;
  brand: string;
  name: string;
  /** Approximate Saudi street price in SAR, VAT included. */
  price: number;
  /** YYYY-MM */
  released: string;
  /** Short Arabic note shown on cards and detail pages. */
  note?: string;
  /** Search phrase used to build store links. */
  query?: string;
}

export interface CPU extends PartBase {
  category: 'cpu';
  socket: Socket;
  cores: number;
  threads: number;
  pCores?: number;
  eCores?: number;
  baseGHz: number;
  boostGHz: number;
  l3MB: number;
  tdp: number;
  /** Peak package power used for PSU sizing (AMD PPT / Intel MTP). */
  maxPower: number;
  igpu: boolean;
  coolerIncluded: boolean;
  memMaxMTs: number;
  /** Relative gaming performance, fastest gaming CPU = 100. */
  gaming: number;
  /** Relative multi-thread performance, fastest = 100. */
  multi: number;
}

export interface Motherboard extends PartBase {
  category: 'motherboard';
  socket: Socket;
  chipset: string;
  formFactor: FormFactor;
  memType: 'DDR5';
  memSlots: number;
  memMaxMTs: number;
  m2Slots: number;
  wifi: string | null;
  pcie5Gpu: boolean;
  pcie5M2: boolean;
}

export interface RAM extends PartBase {
  category: 'ram';
  memType: 'DDR5';
  capacityGB: number;
  modules: number;
  speed: number;
  cl: number;
  rgb: boolean;
  cudimm?: boolean;
}

export interface GPU extends PartBase {
  category: 'gpu';
  vendor: 'NVIDIA' | 'AMD' | 'Intel';
  chip: string;
  vramGB: number;
  vramType: string;
  busBits: number;
  tgp: number;
  recommendedPsu: number;
  lengthMM: number;
  connector: '12V-2x6' | '8-pin';
  /** Relative 4K raster performance, RTX 5090 = 100. */
  perf: number;
  upscaler: string;
}

export interface Storage extends PartBase {
  category: 'storage';
  interface: 'PCIe 5.0' | 'PCIe 4.0' | 'SATA';
  formFactor: 'M.2' | '2.5"';
  capacityGB: number;
  readMBs: number;
  writeMBs: number;
  dram: boolean;
}

export interface PSU extends PartBase {
  category: 'psu';
  watts: number;
  rating: '80+ Bronze' | '80+ Gold' | '80+ Platinum' | 'Cybenetics Platinum';
  atx31: boolean;
  native12v2x6: boolean;
  modular: 'كامل' | 'جزئي' | 'غير معياري';
}

export interface Case extends PartBase {
  category: 'case';
  supports: FormFactor[];
  maxGpuMM: number;
  maxCoolerMM: number;
  radiators: number[];
  fansIncluded: number;
}

export interface Cooler extends PartBase {
  category: 'cooler';
  type: 'air' | 'aio';
  heightMM?: number;
  radiatorMM?: number;
  /** Approximate heat it can comfortably handle. */
  ratedW: number;
  sockets: Socket[];
}

export type Part = CPU | Motherboard | RAM | GPU | Storage | PSU | Case | Cooler;

export type PartOf<C extends Category> = Extract<Part, { category: C }>;

export interface Build {
  cpu?: string;
  motherboard?: string;
  ram?: string;
  gpu?: string;
  storage: string[];
  psu?: string;
  case?: string;
  cooler?: string;
}
