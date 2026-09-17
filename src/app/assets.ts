export const ASSET_STORE_KEY = "meyra-assets-v1";

export type NodeKind = "income" | "cash" | "expense" | "asset" | "liability" | "summary";
export type Quadrant = "E" | "S" | "B" | "I";
export type FlowKind = "in" | "out" | "reinvest" | "return" | "drain" | "link";
export type SummaryKey = "worth" | "net" | "coverage";
export type AssetSubtype = "digital" | "dividend" | "rent" | "other";
export type ExpenseSubtype = "living" | "tools";
export type LiabilitySubtype = "mortgage" | "loan" | "subscription" | "other";
export type DeedBand =
  | "teal"
  | "gold"
  | "indigo"
  | "copper"
  | "rose"
  | "cream"
  | "maroon"
  | "slate"
  | "steel"
  | "plum"
  | "ash";

export type FlowNodeData = {
  kind: NodeKind;
  name: string;
  monthly: number;
  worth: number;
  quadrant?: Quadrant;
  subtype?: string;
  listings?: number;
  summary?: SummaryKey;
  example?: boolean;
};

export type StoredNode = {
  id: string;
  type: NodeKind;
  position: { x: number; y: number };
  data: FlowNodeData;
};

export type StoredEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  data: { monthly: number; kind: FlowKind };
};

/** One row on the personal financial statement (PFS-shaped, not PFS UI). */
export type StatementLine = {
  id: string;
  name: string;
  monthly: number;
  worth: number;
  quadrant?: Quadrant;
  subtype?: string;
  listings?: number;
  example?: boolean;
};

export type EsbiState = {
  current: Quadrant;
  target: Quadrant;
  E: number;
  S: number;
  B: number;
  I: number;
};

/**
 * Persisted board. Statement fields are first-class so a JSON dump reads like a
 * personal financial statement; nodes + edges keep the cashflow canvas layout.
 */
export type GraphState = {
  version: 4;
  income: StatementLine[];
  expenses: StatementLine[];
  assets: StatementLine[];
  liabilities: StatementLine[];
  monthlyCashflow: number;
  passiveIncome: number;
  netWorth: number;
  esbi: EsbiState;
  nodes: StoredNode[];
  edges: StoredEdge[];
};

export const QUADRANTS: { id: Quadrant; label: string; en: string; hint: string }[] = [
  { id: "E", label: "雇员", en: "Employee", hint: "工资 / 课酬" },
  { id: "S", label: "自雇", en: "Self-employed", hint: "接案 / 自由职业" },
  { id: "B", label: "企业主", en: "Business owner", hint: "数字产品与系统" },
  { id: "I", label: "投资人", en: "Investor", hint: "分红 / 租金" },
];

export const CHANCE_TIPS = [
  { title: "分清口袋", body: "资产把钱放进口袋，负债把钱拿出口袋。先分类，再决定买不买。" },
  { title: "先看现金流", body: "价格是故事，月净流入才是规则。问：它每个月给我钱，还是向我要钱？" },
  { title: "象限右移", body: "E / S 用时间换钱；B / I 用系统与资产换钱。目标不是更忙，而是换引擎。" },
  { title: "买会付钱的", body: "先积累会流出利息、租金、分红、特许权的东西，再考虑生活方式升级。" },
  { title: "左边养右边", body: "工作收入可以是种子。关键是把左边赚来的钱，种进右边的资产栏。" },
];

export function nid(prefix = "n") {
  const core =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}-${core}`;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function asNumber(value: unknown, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asMoney(value: unknown, fallback = 0) {
  return Math.round(asNumber(value, fallback));
}

function asQuadrant(value: unknown, fallback: Quadrant = "S"): Quadrant {
  return value === "E" || value === "S" || value === "B" || value === "I" ? value : fallback;
}

const FLOW_KINDS = new Set<FlowKind>(["in", "out", "reinvest", "return", "drain", "link"]);
const NODE_KINDS = new Set<NodeKind>(["income", "cash", "expense", "asset", "liability", "summary"]);

function readNode(raw: unknown): StoredNode | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<StoredNode> & { data?: Partial<FlowNodeData> };
  const type = (item.type || item.data?.kind) as NodeKind;
  if (!NODE_KINDS.has(type) || typeof item.id !== "string") return null;
  const data = item.data ?? {};
  return {
    id: item.id,
    type,
    position: {
      x: asNumber(item.position?.x, 80),
      y: asNumber(item.position?.y, 80),
    },
    data: {
      kind: type,
      name: typeof data.name === "string" && data.name.trim() ? data.name.trim().slice(0, 48) : "未命名",
      monthly: Math.max(0, asMoney(data.monthly, 0)),
      worth: Math.max(0, asMoney(data.worth, 0)),
      quadrant: data.quadrant,
      subtype: typeof data.subtype === "string" ? data.subtype : undefined,
      listings: data.listings != null ? Math.max(0, Math.round(asNumber(data.listings, 0))) : undefined,
      summary: data.summary,
      example: data.example === true,
    },
  };
}

function readEdge(raw: unknown): StoredEdge | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<StoredEdge> & { data?: Partial<StoredEdge["data"]> };
  if (typeof item.id !== "string" || typeof item.source !== "string" || typeof item.target !== "string") return null;
  const kind = FLOW_KINDS.has(item.data?.kind as FlowKind) ? (item.data?.kind as FlowKind) : "in";
  return {
    id: item.id,
    source: item.source,
    target: item.target,
    sourceHandle: item.sourceHandle,
    targetHandle: item.targetHandle,
    data: {
      monthly: Math.max(0, asMoney(item.data?.monthly, 0)),
      kind,
    },
  };
}

function lineFromNode(node: StoredNode): StatementLine {
  return {
    id: node.id,
    name: node.data.name,
    monthly: node.data.monthly,
    worth: node.data.worth,
    quadrant: node.data.quadrant,
    subtype: node.data.subtype,
    listings: node.data.listings,
    example: node.data.example,
  };
}

function readLine(raw: unknown, fallbackKind: Exclude<NodeKind, "cash" | "summary">): StatementLine | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const name = typeof item.name === "string" ? item.name.trim().slice(0, 48) : "";
  if (!name) return null;
  const monthlyRaw = item.monthly ?? item.amount ?? item.cashflow ?? item.monthlySales;
  const worthRaw =
    item.worth ?? item.principal ?? (fallbackKind === "asset" || fallbackKind === "liability" ? item.value : 0);
  const monthly = Math.max(
    0,
    asMoney(monthlyRaw ?? (fallbackKind === "income" || fallbackKind === "expense" ? item.value : 0), 0),
  );
  const worth = Math.max(0, asMoney(worthRaw, 0));
  const id = typeof item.id === "string" && item.id ? item.id : nid(fallbackKind.slice(0, 1));
  const listings = item.listings != null ? Math.max(0, Math.round(asNumber(item.listings, 0))) : undefined;
  return {
    id,
    name,
    monthly: fallbackKind === "liability" || fallbackKind === "expense" ? Math.abs(monthly) : monthly,
    worth,
    quadrant: asQuadrant(item.quadrant, fallbackKind === "income" ? "S" : "I"),
    subtype: typeof item.subtype === "string" ? item.subtype : typeof item.kind === "string" ? item.kind : undefined,
    listings,
    example: item.example === true,
  };
}

function readLines(raw: unknown, kind: Exclude<NodeKind, "cash" | "summary">): StatementLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => readLine(item, kind)).filter(Boolean) as StatementLine[];
}

const HUB = {
  cash: { x: 390, y: 196 },
  worth: { x: 900, y: 24 },
  net: { x: 900, y: 136 },
  cover: { x: 900, y: 248 },
};

function nodeFromLine(
  line: StatementLine,
  type: Exclude<NodeKind, "cash" | "summary">,
  position: { x: number; y: number },
): StoredNode {
  return {
    id: line.id,
    type,
    position,
    data: {
      kind: type,
      name: line.name,
      monthly: line.monthly,
      worth: line.worth,
      quadrant: type === "income" ? asQuadrant(line.quadrant, "S") : undefined,
      subtype: line.subtype,
      listings: line.listings,
      example: line.example,
    },
  };
}

function layoutFromStatement(
  income: StatementLine[],
  expenses: StatementLine[],
  assets: StatementLine[],
  liabilities: StatementLine[],
): { nodes: StoredNode[]; edges: StoredEdge[] } {
  const nodes: StoredNode[] = [
    ...income.map((line, i) => nodeFromLine(line, "income", { x: 32 + (i % 4) * 204, y: 24 + Math.floor(i / 4) * 120 })),
    {
      id: "sum-worth",
      type: "summary",
      position: HUB.worth,
      data: { kind: "summary", name: "净资产", monthly: 0, worth: 0, summary: "worth" },
    },
    {
      id: "sum-net",
      type: "summary",
      position: HUB.net,
      data: { kind: "summary", name: "月净现金流", monthly: 0, worth: 0, summary: "net" },
    },
    {
      id: "sum-cover",
      type: "summary",
      position: HUB.cover,
      data: { kind: "summary", name: "被动覆盖率", monthly: 0, worth: 0, summary: "coverage" },
    },
    { id: "cash", type: "cash", position: HUB.cash, data: { kind: "cash", name: "现金池", monthly: 0, worth: 0 } },
    ...assets.map((line, i) => nodeFromLine(line, "asset", { x: 24, y: 420 + i * 128 })),
    ...liabilities.map((line, i) => nodeFromLine(line, "liability", { x: 860, y: 420 + i * 128 })),
    ...expenses.map((line, i) => nodeFromLine(line, "expense", { x: 300 + (i % 3) * 230, y: 700 + Math.floor(i / 3) * 120 })),
  ];
  const edges: StoredEdge[] = [
    ...income.map((line) => ({
      id: `e-${line.id}-cash`,
      source: line.id,
      target: "cash",
      data: { monthly: line.monthly, kind: "in" as const },
    })),
    ...assets.map((line) => ({
      id: `e-${line.id}-cash`,
      source: line.id,
      target: "cash",
      data: { monthly: line.monthly, kind: "return" as const },
    })),
    ...expenses.map((line) => ({
      id: `e-cash-${line.id}`,
      source: "cash",
      target: line.id,
      data: { monthly: line.monthly, kind: "out" as const },
    })),
    ...liabilities.map((line) => ({
      id: `e-${line.id}-cash`,
      source: line.id,
      target: "cash",
      data: { monthly: line.monthly, kind: "drain" as const },
    })),
  ];
  return { nodes, edges };
}

function readGraphArrays(raw: unknown): { nodes: StoredNode[]; edges: StoredEdge[] } | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as { nodes?: unknown; edges?: unknown };
  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) return null;
  const nodes = data.nodes.map(readNode).filter(Boolean) as StoredNode[];
  const ids = new Set(nodes.map((n) => n.id));
  if (!nodes.some((n) => n.type === "cash")) return null;
  const edges = data.edges
    .map(readEdge)
    .filter((edge): edge is StoredEdge => !!edge && ids.has(edge.source) && ids.has(edge.target) && edge.source !== edge.target);
  return { nodes, edges };
}

const SEED_NODES: StoredNode[] = [
  { id: "inc-e", type: "income", position: { x: 32, y: 24 }, data: { kind: "income", name: "兼职课酬", monthly: 3200, worth: 0, quadrant: "E", example: true } },
  { id: "inc-s", type: "income", position: { x: 236, y: 24 }, data: { kind: "income", name: "设计接案", monthly: 8800, worth: 0, quadrant: "S", example: true } },
  { id: "inc-b", type: "income", position: { x: 440, y: 24 }, data: { kind: "income", name: "数字产品", monthly: 0, worth: 0, quadrant: "B", example: true } },
  { id: "inc-i", type: "income", position: { x: 644, y: 24 }, data: { kind: "income", name: "分红 / 租金", monthly: 0, worth: 0, quadrant: "I", example: true } },
  { id: "sum-worth", type: "summary", position: { x: 900, y: 24 }, data: { kind: "summary", name: "净资产", monthly: 0, worth: 0, summary: "worth" } },
  { id: "sum-net", type: "summary", position: { x: 900, y: 136 }, data: { kind: "summary", name: "月净现金流", monthly: 0, worth: 0, summary: "net" } },
  { id: "sum-cover", type: "summary", position: { x: 900, y: 248 }, data: { kind: "summary", name: "被动覆盖率", monthly: 0, worth: 0, summary: "coverage" } },
  { id: "cash", type: "cash", position: { x: 390, y: 196 }, data: { kind: "cash", name: "现金池", monthly: 0, worth: 0 } },
  { id: "asset-kit", type: "asset", position: { x: 24, y: 420 }, data: { kind: "asset", name: "Prompt Kit", monthly: 1860, worth: 8000, subtype: "digital", listings: 3, example: true } },
  { id: "asset-tpl", type: "asset", position: { x: 24, y: 548 }, data: { kind: "asset", name: "版式模板包", monthly: 640, worth: 2400, subtype: "digital", listings: 2, example: true } },
  { id: "asset-div", type: "asset", position: { x: 24, y: 676 }, data: { kind: "asset", name: "指数分红", monthly: 180, worth: 12000, subtype: "dividend", example: true } },
  { id: "liab-device", type: "liability", position: { x: 860, y: 420 }, data: { kind: "liability", name: "设备分期", monthly: 680, worth: 9600, subtype: "loan", example: true } },
  { id: "exp-live", type: "expense", position: { x: 300, y: 700 }, data: { kind: "expense", name: "固定生活", monthly: 4800, worth: 0, subtype: "living", example: true } },
  { id: "exp-tools", type: "expense", position: { x: 530, y: 700 }, data: { kind: "expense", name: "软件订阅", monthly: 189, worth: 0, subtype: "tools", example: true } },
];

const SEED_EDGES: StoredEdge[] = [
  { id: "e-e-cash", source: "inc-e", target: "cash", data: { monthly: 3200, kind: "in" } },
  { id: "e-s-cash", source: "inc-s", target: "cash", data: { monthly: 8800, kind: "in" } },
  { id: "e-kit-cash", source: "asset-kit", target: "cash", data: { monthly: 1860, kind: "return" } },
  { id: "e-tpl-cash", source: "asset-tpl", target: "cash", data: { monthly: 640, kind: "return" } },
  { id: "e-div-cash", source: "asset-div", target: "cash", data: { monthly: 180, kind: "return" } },
  { id: "e-cash-kit", source: "cash", target: "asset-kit", data: { monthly: 300, kind: "reinvest" } },
  { id: "e-cash-live", source: "cash", target: "exp-live", data: { monthly: 4800, kind: "out" } },
  { id: "e-cash-tools", source: "cash", target: "exp-tools", data: { monthly: 189, kind: "out" } },
  { id: "e-device-cash", source: "liab-device", target: "cash", data: { monthly: 680, kind: "drain" } },
];

export function inferFlowKind(sourceType: string | undefined, targetType: string | undefined): FlowKind {
  if (sourceType === "income" && targetType === "cash") return "in";
  if (sourceType === "cash" && targetType === "expense") return "out";
  if (sourceType === "cash" && targetType === "asset") return "reinvest";
  if (sourceType === "asset" && targetType === "cash") return "return";
  if (sourceType === "liability" && targetType === "cash") return "drain";
  if ((sourceType === "asset" && targetType === "liability") || (sourceType === "liability" && targetType === "asset")) {
    return "link";
  }
  return "in";
}

export type GraphStats = {
  earned: number;
  passive: number;
  expenses: number;
  drain: number;
  reinvest: number;
  net: number;
  worth: number;
  coverage: number;
  escaped: boolean;
  esbi: Record<Quadrant, number>;
};

export function graphStats(nodes: StoredNode[], edges: StoredEdge[]): GraphStats {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  let earned = 0;
  let passive = 0;
  let expenses = 0;
  let drain = 0;
  let reinvest = 0;
  for (const edge of edges) {
    const source = byId.get(edge.source);
    const target = byId.get(edge.target);
    const amount = Math.max(0, edge.data.monthly);
    const kind = edge.data.kind || inferFlowKind(source?.type, target?.type);
    if (kind === "in") earned += amount;
    else if (kind === "return") passive += amount;
    else if (kind === "out") expenses += amount;
    else if (kind === "drain") drain += amount;
    else if (kind === "reinvest") reinvest += amount;
  }
  const esbi: Record<Quadrant, number> = { E: 0, S: 0, B: 0, I: 0 };
  for (const node of nodes) {
    if (node.type !== "income") continue;
    const q = asQuadrant(node.data.quadrant, "S");
    esbi[q] += Math.max(0, node.data.monthly);
  }
  esbi.I += passive;
  const assetWorth = nodes.filter((n) => n.type === "asset").reduce((sum, n) => sum + n.data.worth, 0);
  const liabWorth = nodes.filter((n) => n.type === "liability").reduce((sum, n) => sum + n.data.worth, 0);
  const totalExpenses = expenses + drain;
  const net = earned + passive - totalExpenses;
  const coverage = totalExpenses > 0 ? passive / totalExpenses : passive > 0 ? 1 : 0;
  return {
    earned,
    passive,
    expenses: totalExpenses,
    drain,
    reinvest,
    net,
    worth: assetWorth - liabWorth,
    coverage,
    escaped: totalExpenses > 0 && passive >= totalExpenses,
    esbi,
  };
}

export function packBoard(
  nodes: StoredNode[],
  edges: StoredEdge[],
  pick: Pick<EsbiState, "current" | "target"> = { current: "S", target: "B" },
): GraphState {
  const stats = graphStats(nodes, edges);
  return {
    version: 4,
    income: nodes.filter((n) => n.type === "income").map(lineFromNode),
    expenses: nodes.filter((n) => n.type === "expense").map(lineFromNode),
    assets: nodes.filter((n) => n.type === "asset").map(lineFromNode),
    liabilities: nodes.filter((n) => n.type === "liability").map(lineFromNode),
    monthlyCashflow: stats.net,
    passiveIncome: stats.passive,
    netWorth: stats.worth,
    esbi: {
      current: asQuadrant(pick.current, "S"),
      target: asQuadrant(pick.target, "B"),
      E: stats.esbi.E,
      S: stats.esbi.S,
      B: stats.esbi.B,
      I: stats.esbi.I,
    },
    nodes,
    edges,
  };
}

export const SEED: GraphState = packBoard(SEED_NODES, SEED_EDGES, { current: "S", target: "B" });

function migrateLegacyLists(raw: Record<string, unknown>): { nodes: StoredNode[]; edges: StoredEdge[] } {
  const income = readLines(raw.income, "income");
  const expenses = readLines(raw.expenses, "expense");
  const assets = readLines(raw.assets, "asset");
  const liabilities = readLines(raw.liabilities, "liability");
  const products = Array.isArray(raw.products) ? raw.products : [];
  for (const product of products) {
    const line = readLine(product, "asset");
    if (line) {
      line.subtype = "digital";
      line.monthly = Math.max(0, asMoney((product as { monthlySales?: unknown }).monthlySales, line.monthly));
      assets.push(line);
    }
  }
  if (income.length === 0) {
    const active = Math.max(0, asMoney(raw.activeIncome, 0));
    if (active > 0) {
      income.push({
        id: "inc-active",
        name: "主动收入",
        monthly: active,
        worth: 0,
        quadrant: asQuadrant(raw.current, "S"),
      });
    }
  }
  if (expenses.length === 0) {
    const fixed = Math.max(0, asMoney(raw.fixedExpenses, 0));
    if (fixed > 0) {
      expenses.push({ id: "exp-fixed", name: "固定生活", monthly: fixed, worth: 0, subtype: "living" });
    }
  }
  if (!income.length && !expenses.length && !assets.length && !liabilities.length) {
    return { nodes: clone(SEED_NODES), edges: clone(SEED_EDGES) };
  }
  return layoutFromStatement(income, expenses, assets, liabilities);
}

function normalize(raw: unknown): GraphState {
  if (!raw || typeof raw !== "object") return clone(SEED);
  const data = raw as Record<string, unknown>;
  const pick = {
    current: asQuadrant((data.esbi as EsbiState | undefined)?.current ?? data.current, "S"),
    target: asQuadrant((data.esbi as EsbiState | undefined)?.target ?? data.target, "B"),
  };
  const graph = readGraphArrays(data);
  if (graph) return packBoard(graph.nodes, graph.edges, pick);
  if (
    Array.isArray(data.income) ||
    Array.isArray(data.expenses) ||
    Array.isArray(data.assets) ||
    Array.isArray(data.liabilities) ||
    Array.isArray(data.products)
  ) {
    const migrated = migrateLegacyLists(data);
    return packBoard(migrated.nodes, migrated.edges, pick);
  }
  return clone(SEED);
}

export function readGraph(): GraphState {
  if (typeof localStorage === "undefined") return clone(SEED);
  try {
    const raw = localStorage.getItem(ASSET_STORE_KEY);
    if (!raw) return clone(SEED);
    return normalize(JSON.parse(raw) as unknown);
  } catch {
    return clone(SEED);
  }
}

export function writeGraph(state: GraphState | { nodes: StoredNode[]; edges: StoredEdge[]; esbi?: Pick<EsbiState, "current" | "target"> }) {
  if (typeof localStorage === "undefined") return;
  const packed =
    "version" in state && state.version === 4
      ? packBoard(state.nodes, state.edges, state.esbi)
      : packBoard(state.nodes, state.edges, "esbi" in state ? state.esbi : undefined);
  localStorage.setItem(ASSET_STORE_KEY, JSON.stringify(packed));
}

export function resetGraph(): GraphState {
  const next = clone(SEED);
  writeGraph(next);
  return next;
}

export function parseBoardJson(text: string): GraphState {
  return normalize(JSON.parse(text) as unknown);
}

export function exportBoardJson(state: GraphState) {
  const packed = packBoard(state.nodes, state.edges, state.esbi);
  return `${JSON.stringify(packed, null, 2)}\n`;
}

export function upsertEdge(
  edges: StoredEdge[],
  source: string,
  target: string,
  monthly: number,
  kind: FlowKind,
): StoredEdge[] {
  const found = edges.find((edge) => edge.source === source && edge.target === target);
  if (found) {
    return edges.map((edge) =>
      edge.id === found.id ? { ...edge, data: { monthly: Math.max(0, Math.round(monthly)), kind } } : edge,
    );
  }
  return [
    ...edges,
    {
      id: nid("e"),
      source,
      target,
      data: { monthly: Math.max(0, Math.round(monthly)), kind },
    },
  ];
}

export function defaultNode(kind: Exclude<NodeKind, "cash" | "summary">, position: { x: number; y: number }): StoredNode {
  const id = nid(kind.slice(0, 1));
  if (kind === "income") {
    return { id, type: kind, position, data: { kind, name: "新收入", monthly: 0, worth: 0, quadrant: "S" } };
  }
  if (kind === "asset") {
    return { id, type: kind, position, data: { kind, name: "新资产", monthly: 0, worth: 0, subtype: "digital", listings: 1 } };
  }
  if (kind === "liability") {
    return { id, type: kind, position, data: { kind, name: "新负债", monthly: 0, worth: 0, subtype: "loan" } };
  }
  return { id, type: kind, position, data: { kind, name: "新支出", monthly: 0, worth: 0, subtype: "living" } };
}

export function formatCny(value: number) {
  const abs = Math.abs(Math.round(value));
  const body = abs.toLocaleString("zh-CN");
  if (value > 0) return `+¥${body}`;
  if (value < 0) return `-¥${body}`;
  return `¥${body}`;
}

export function formatPct(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${Math.round(value * 100)}%`;
}

export function flowStroke(monthly: number) {
  return Math.min(6.5, Math.max(1.6, Math.abs(monthly) / 900 + 1.4));
}

export function quadrantMeta(id?: Quadrant) {
  return QUADRANTS.find((item) => item.id === id);
}

export function subtypeLabel(kind: NodeKind, subtype?: string) {
  if (kind === "asset") {
    if (subtype === "digital") return "数字产品";
    if (subtype === "dividend") return "分红";
    if (subtype === "rent") return "租金";
    return "资产";
  }
  if (kind === "liability") {
    if (subtype === "mortgage") return "房贷";
    if (subtype === "loan") return "分期 / 贷款";
    if (subtype === "subscription") return "订阅债";
    return "负债";
  }
  if (kind === "expense") {
    if (subtype === "tools") return "工具订阅";
    return "固定生活";
  }
  return "";
}

export function deedBand(data: FlowNodeData): DeedBand {
  if (data.kind === "income") {
    if (data.quadrant === "E") return "cream";
    if (data.quadrant === "S") return "gold";
    if (data.quadrant === "B") return "teal";
    return "indigo";
  }
  if (data.kind === "asset") {
    if (data.subtype === "digital") return "rose";
    if (data.subtype === "dividend") return "indigo";
    if (data.subtype === "rent") return "teal";
    return "copper";
  }
  if (data.kind === "liability") {
    if (data.subtype === "mortgage") return "maroon";
    if (data.subtype === "subscription") return "plum";
    if (data.subtype === "loan") return "slate";
    return "ash";
  }
  if (data.kind === "expense") return data.subtype === "tools" ? "steel" : "ash";
  if (data.kind === "cash") return "gold";
  return "cream";
}

export function todayTip() {
  const i = Math.floor(Date.now() / 86_400_000) % CHANCE_TIPS.length;
  return CHANCE_TIPS[i];
}
