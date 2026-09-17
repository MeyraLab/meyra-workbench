export const ASSET_STORE_KEY = "meyra-assets-v1";

export type Side = "asset" | "liability";
export type Quadrant = "E" | "S" | "B" | "I";
export type SkillKey = "accounting" | "investing" | "markets" | "law";

export type AssetKind = "real-estate" | "business" | "paper" | "commodity" | "ip" | "other";
export type LiabilityKind = "mortgage" | "consumer" | "auto" | "subscription" | "other";

export type BoardItem = {
  id: string;
  name: string;
  kind: string;
  monthly: number;
  note: string;
  example?: boolean;
};

export type SkillLevels = Record<SkillKey, number>;

export type BoardState = {
  version: 1;
  assets: BoardItem[];
  liabilities: BoardItem[];
  current: Quadrant;
  target: Quadrant;
  skills: SkillLevels;
};

export const ASSET_KINDS: { id: AssetKind; label: string; en: string; band: string }[] = [
  { id: "real-estate", label: "房产", en: "Real estate", band: "teal" },
  { id: "business", label: "企业", en: "Business", band: "gold" },
  { id: "paper", label: "纸面资产", en: "Paper", band: "indigo" },
  { id: "commodity", label: "商品", en: "Commodity", band: "copper" },
  { id: "ip", label: "知识产权", en: "IP", band: "rose" },
  { id: "other", label: "其他", en: "Other", band: "cream" },
];

export const LIABILITY_KINDS: { id: LiabilityKind; label: string; en: string; band: string }[] = [
  { id: "mortgage", label: "房贷", en: "Mortgage", band: "maroon" },
  { id: "consumer", label: "消费贷", en: "Consumer", band: "slate" },
  { id: "auto", label: "车贷", en: "Auto", band: "steel" },
  { id: "subscription", label: "订阅", en: "Subscription", band: "plum" },
  { id: "other", label: "其他", en: "Other", band: "ash" },
];

export const QUADRANTS: { id: Quadrant; label: string; en: string; hint: string }[] = [
  { id: "E", label: "雇员", en: "Employee", hint: "用时间换钱" },
  { id: "S", label: "自雇", en: "Self-employed", hint: "为自己工作" },
  { id: "B", label: "企业主", en: "Business owner", hint: "系统为你工作" },
  { id: "I", label: "投资人", en: "Investor", hint: "钱为你工作" },
];

export const SKILLS: { id: SkillKey; label: string; en: string }[] = [
  { id: "accounting", label: "会计", en: "Accounting" },
  { id: "investing", label: "投资", en: "Investing" },
  { id: "markets", label: "市场", en: "Markets" },
  { id: "law", label: "法律", en: "Law" },
];

export const CHANCE_TIPS = [
  { title: "分清口袋", body: "资产把钱放进口袋，负债把钱拿出口袋。先分类，再决定买不买。" },
  { title: "先看现金流", body: "价格是故事，月净流入才是规则。问：它每个月给我钱，还是向我要钱？" },
  { title: "象限右移", body: "E / S 用时间换钱；B / I 用系统与资产换钱。目标不是更忙，而是换引擎。" },
  { title: "四根柱子", body: "财务智商靠会计、投资、市场、法律一起长。缺一根，棋盘会倾斜。" },
  { title: "买会付钱的", body: "先积累会流出利息、租金、分红、特许权的东西，再考虑生活方式升级。" },
  { title: "房子也要过关", body: "住着很舒服，可如果每月都在掏钱，它更接近负债。用现金流检验，而不是用感情。" },
  { title: "素养决定流向", body: "钱会流向更懂规则的人。先把损益表和资产负债表读懂，再加大赌注。" },
  { title: "左边养右边", body: "工作收入可以是种子。关键是把左边赚来的钱，种进右边的资产栏。" },
];

const QUADRANT_SET = new Set<Quadrant>(["E", "S", "B", "I"]);
const ASSET_KIND_SET = new Set(ASSET_KINDS.map((k) => k.id));
const LIABILITY_KIND_SET = new Set(LIABILITY_KINDS.map((k) => k.id));
const SKILL_IDS = SKILLS.map((s) => s.id);

export const SEED: BoardState = {
  version: 1,
  current: "E",
  target: "B",
  skills: { accounting: 2, investing: 2, markets: 3, law: 1 },
  assets: [
    {
      id: "ex-rent",
      name: "出租小套房",
      kind: "real-estate",
      monthly: 3200,
      note: "月租金净额（扣税与维修后）",
      example: true,
    },
    {
      id: "ex-ip",
      name: "内容订阅",
      kind: "ip",
      monthly: 480,
      note: "数字产品的被动流入",
      example: true,
    },
  ],
  liabilities: [
    {
      id: "ex-debt",
      name: "消费分期",
      kind: "consumer",
      monthly: -900,
      note: "把钱从口袋拿走的账单",
      example: true,
    },
  ],
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nid(prefix: string) {
  const core = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}-${core}`;
}

function asNumber(value: unknown, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clampSkill(value: unknown) {
  return Math.min(5, Math.max(1, Math.round(asNumber(value, 1))));
}

function readItem(raw: unknown, side: Side): BoardItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<BoardItem>;
  if (typeof item.name !== "string" || !item.name.trim()) return null;
  const kind = typeof item.kind === "string" ? item.kind : "other";
  const allowed = side === "asset" ? ASSET_KIND_SET : LIABILITY_KIND_SET;
  const monthly = asNumber(item.monthly, 0);
  return {
    id: typeof item.id === "string" && item.id ? item.id : nid(side === "asset" ? "a" : "l"),
    name: item.name.trim().slice(0, 48),
    kind: allowed.has(kind as never) ? kind : "other",
    monthly: side === "asset" ? Math.abs(monthly) : -Math.abs(monthly),
    note: typeof item.note === "string" ? item.note.trim().slice(0, 120) : "",
    example: item.example === true,
  };
}

function normalize(raw: unknown): BoardState {
  const base = clone(SEED);
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Partial<BoardState>;
  const assets = Array.isArray(data.assets)
    ? data.assets.map((item) => readItem(item, "asset")).filter(Boolean) as BoardItem[]
    : base.assets;
  const liabilities = Array.isArray(data.liabilities)
    ? data.liabilities.map((item) => readItem(item, "liability")).filter(Boolean) as BoardItem[]
    : base.liabilities;
  const skills = { ...base.skills };
  if (data.skills && typeof data.skills === "object") {
    for (const key of SKILL_IDS) {
      skills[key] = clampSkill((data.skills as SkillLevels)[key]);
    }
  }
  return {
    version: 1,
    assets,
    liabilities,
    current: QUADRANT_SET.has(data.current as Quadrant) ? (data.current as Quadrant) : base.current,
    target: QUADRANT_SET.has(data.target as Quadrant) ? (data.target as Quadrant) : base.target,
    skills,
  };
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

export function makeItem(side: Side, draft: { name: string; kind: string; monthly: number; note: string; id?: string; example?: boolean }): BoardItem {
  const monthly = asNumber(draft.monthly, 0);
  return {
    id: draft.id || nid(side === "asset" ? "a" : "l"),
    name: draft.name.trim().slice(0, 48),
    kind: draft.kind,
    monthly: side === "asset" ? Math.abs(monthly) : -Math.abs(monthly),
    note: draft.note.trim().slice(0, 120),
    example: draft.example === true,
  };
}

export function totals(state: BoardState) {
  const inflow = state.assets.reduce((sum, item) => sum + item.monthly, 0);
  const outflow = state.liabilities.reduce((sum, item) => sum + item.monthly, 0);
  return {
    inflow,
    outflow,
    net: inflow + outflow,
    assetCount: state.assets.length,
    liabilityCount: state.liabilities.length,
  };
}

export function formatCny(value: number) {
  const abs = Math.abs(Math.round(value));
  const body = abs.toLocaleString("zh-CN");
  if (value > 0) return `+¥${body}`;
  if (value < 0) return `-¥${body}`;
  return `¥${body}`;
}

export function kindMeta(side: Side, kind: string) {
  const list = side === "asset" ? ASSET_KINDS : LIABILITY_KINDS;
  return list.find((item) => item.id === kind) ?? list[list.length - 1];
}

export function hasExamples(state: BoardState) {
  return state.assets.some((item) => item.example) || state.liabilities.some((item) => item.example);
}
