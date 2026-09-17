export const ASSET_STORE_KEY = "meyra-assets-v1";

export type Side = "asset" | "liability";
export type Quadrant = "E" | "S" | "B" | "I";

export type BoardItem = {
  id: string;
  name: string;
  monthly: number;
  note: string;
  example?: boolean;
};

export type DigitalProduct = {
  id: string;
  name: string;
  listings: number;
  monthlySales: number;
  updateCost: number;
  note: string;
  example?: boolean;
};

export type BoardState = {
  version: 2;
  activeIncome: number;
  fixedExpenses: number;
  current: Quadrant;
  target: Quadrant;
  assets: BoardItem[];
  liabilities: BoardItem[];
  products: DigitalProduct[];
};

export const QUADRANTS: { id: Quadrant; label: string; en: string; hint: string }[] = [
  { id: "E", label: "雇员", en: "Employee", hint: "用时间换钱" },
  { id: "S", label: "自雇", en: "Self-employed", hint: "为自己工作" },
  { id: "B", label: "企业主", en: "Business owner", hint: "系统为你工作" },
  { id: "I", label: "投资人", en: "Investor", hint: "钱为你工作" },
];

const QUADRANT_SET = new Set<Quadrant>(["E", "S", "B", "I"]);

export const SEED: BoardState = {
  version: 2,
  activeIncome: 12000,
  fixedExpenses: 4800,
  current: "S",
  target: "B",
  assets: [
    {
      id: "ex-license",
      name: "旧课授权",
      monthly: 200,
      note: "偶尔的授权费",
      example: true,
    },
  ],
  liabilities: [
    {
      id: "ex-subs",
      name: "工具订阅",
      monthly: -189,
      note: "设计与模型月费",
      example: true,
    },
  ],
  products: [
    {
      id: "ex-prompt",
      name: "Prompt Kit",
      listings: 3,
      monthlySales: 1860,
      updateCost: 120,
      note: "模板与提示词套装",
      example: true,
    },
    {
      id: "ex-pack",
      name: "版式模板包",
      listings: 2,
      monthlySales: 640,
      updateCost: 40,
      note: "可复用排版",
      example: true,
    },
  ],
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nid(prefix: string) {
  const core =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}-${core}`;
}

function asNumber(value: unknown, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asMoney(value: unknown, fallback = 0) {
  return Math.max(0, Math.round(asNumber(value, fallback)));
}

function readLine(raw: unknown, side: Side): BoardItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<BoardItem>;
  if (typeof item.name !== "string" || !item.name.trim()) return null;
  const monthly = asNumber(item.monthly, 0);
  return {
    id: typeof item.id === "string" && item.id ? item.id : nid(side === "asset" ? "a" : "l"),
    name: item.name.trim().slice(0, 48),
    monthly: side === "asset" ? Math.abs(monthly) : -Math.abs(monthly),
    note: typeof item.note === "string" ? item.note.trim().slice(0, 120) : "",
    example: item.example === true,
  };
}

function readProduct(raw: unknown): DigitalProduct | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<DigitalProduct>;
  if (typeof item.name !== "string" || !item.name.trim()) return null;
  return {
    id: typeof item.id === "string" && item.id ? item.id : nid("p"),
    name: item.name.trim().slice(0, 48),
    listings: Math.max(0, Math.round(asNumber(item.listings, 0))),
    monthlySales: asMoney(item.monthlySales, 0),
    updateCost: asMoney(item.updateCost, 0),
    note: typeof item.note === "string" ? item.note.trim().slice(0, 120) : "",
    example: item.example === true,
  };
}

function normalize(raw: unknown): BoardState {
  if (!raw || typeof raw !== "object") return clone(SEED);
  const data = raw as Partial<BoardState> & { version?: number };
  const assets = Array.isArray(data.assets)
    ? (data.assets.map((item) => readLine(item, "asset")).filter(Boolean) as BoardItem[])
    : [];
  const liabilities = Array.isArray(data.liabilities)
    ? (data.liabilities.map((item) => readLine(item, "liability")).filter(Boolean) as BoardItem[])
    : [];
  const products = Array.isArray(data.products)
    ? (data.products.map((item) => readProduct(item)).filter(Boolean) as DigitalProduct[])
    : [];
  return {
    version: 2,
    activeIncome: asMoney(data.activeIncome, 0),
    fixedExpenses: asMoney(data.fixedExpenses, 0),
    current: QUADRANT_SET.has(data.current as Quadrant) ? (data.current as Quadrant) : "S",
    target: QUADRANT_SET.has(data.target as Quadrant) ? (data.target as Quadrant) : "B",
    assets,
    liabilities,
    products,
  };
}

export function productNet(item: DigitalProduct) {
  return item.monthlySales - item.updateCost;
}

export function readBoard(): BoardState {
  if (typeof localStorage === "undefined") return clone(SEED);
  try {
    const raw = localStorage.getItem(ASSET_STORE_KEY);
    if (!raw) return clone(SEED);
    return normalize(JSON.parse(raw) as unknown);
  } catch {
    return clone(SEED);
  }
}

export function writeBoard(state: BoardState) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(ASSET_STORE_KEY, JSON.stringify(state));
}

export function makeLine(
  side: Side,
  draft: { name: string; monthly: number; note: string; id?: string; example?: boolean },
): BoardItem {
  const monthly = asNumber(draft.monthly, 0);
  return {
    id: draft.id || nid(side === "asset" ? "a" : "l"),
    name: draft.name.trim().slice(0, 48),
    monthly: side === "asset" ? Math.abs(monthly) : -Math.abs(monthly),
    note: draft.note.trim().slice(0, 120),
    example: draft.example === true,
  };
}

export function makeProduct(draft: {
  name: string;
  listings: number;
  monthlySales: number;
  updateCost: number;
  note: string;
  id?: string;
  example?: boolean;
}): DigitalProduct {
  return {
    id: draft.id || nid("p"),
    name: draft.name.trim().slice(0, 48),
    listings: Math.max(0, Math.round(asNumber(draft.listings, 0))),
    monthlySales: asMoney(draft.monthlySales, 0),
    updateCost: asMoney(draft.updateCost, 0),
    note: draft.note.trim().slice(0, 120),
    example: draft.example === true,
  };
}

export function totals(state: BoardState) {
  const assetFlow = state.assets.reduce((sum, item) => sum + item.monthly, 0);
  const liabilityFlow = state.liabilities.reduce((sum, item) => sum + item.monthly, 0);
  const digitalSales = state.products.reduce((sum, item) => sum + item.monthlySales, 0);
  const digitalCost = state.products.reduce((sum, item) => sum + item.updateCost, 0);
  const digitalNet = digitalSales - digitalCost;
  const passive = assetFlow + digitalNet;
  const expenses = state.fixedExpenses + Math.abs(liabilityFlow);
  const net = state.activeIncome + passive - state.fixedExpenses + liabilityFlow;
  return {
    active: state.activeIncome,
    assetFlow,
    digitalNet,
    digitalSales,
    digitalCost,
    passive,
    fixed: state.fixedExpenses,
    liabilityFlow,
    expenses,
    net,
    assetCount: state.assets.length,
    liabilityCount: state.liabilities.length,
    productCount: state.products.length,
  };
}

export function formatCny(value: number) {
  const abs = Math.abs(Math.round(value));
  const body = abs.toLocaleString("zh-CN");
  if (value > 0) return `+¥${body}`;
  if (value < 0) return `-¥${body}`;
  return `¥${body}`;
}

export function hasExamples(state: BoardState) {
  return (
    state.assets.some((item) => item.example) ||
    state.liabilities.some((item) => item.example) ||
    state.products.some((item) => item.example)
  );
}
