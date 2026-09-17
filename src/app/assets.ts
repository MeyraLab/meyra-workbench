export const ASSET_STORE_KEY = "meyra-assets-v1";

export type NodeKind = "income" | "cash" | "expense" | "asset" | "liability" | "summary";
export type Quadrant = "E" | "S" | "B" | "I";
export type FlowKind = "in" | "out" | "reinvest" | "return" | "drain" | "link";
export type SummaryKey = "worth" | "net" | "coverage";
export type AssetSubtype = "digital" | "dividend" | "rent" | "other";
export type ExpenseSubtype = "living" | "tools";
export type LiabilitySubtype = "mortgage" | "loan" | "subscription" | "other";

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

export type GraphState = {
  version: 3;
  nodes: StoredNode[];
  edges: StoredEdge[];
};

export const QUADRANTS: { id: Quadrant; label: string; en: string; hint: string }[] = [
  { id: "E", label: "雇员", en: "Employee", hint: "工资 / 课酬" },
  { id: "S", label: "自雇", en: "Self-employed", hint: "接案 / 自由职业" },
  { id: "B", label: "企业主", en: "Business owner", hint: "数字产品与系统" },
  { id: "I", label: "投资人", en: "Investor", hint: "分红 / 租金" },
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

export const SEED: GraphState = {
  version: 3,
  nodes: [
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
  ],
  edges: [
    { id: "e-e-cash", source: "inc-e", target: "cash", data: { monthly: 3200, kind: "in" } },
    { id: "e-s-cash", source: "inc-s", target: "cash", data: { monthly: 8800, kind: "in" } },
    { id: "e-kit-cash", source: "asset-kit", target: "cash", data: { monthly: 1860, kind: "return" } },
    { id: "e-tpl-cash", source: "asset-tpl", target: "cash", data: { monthly: 640, kind: "return" } },
    { id: "e-div-cash", source: "asset-div", target: "cash", data: { monthly: 180, kind: "return" } },
    { id: "e-cash-kit", source: "cash", target: "asset-kit", data: { monthly: 300, kind: "reinvest" } },
    { id: "e-cash-live", source: "cash", target: "exp-live", data: { monthly: 4800, kind: "out" } },
    { id: "e-cash-tools", source: "cash", target: "exp-tools", data: { monthly: 189, kind: "out" } },
    { id: "e-device-cash", source: "liab-device", target: "cash", data: { monthly: 680, kind: "drain" } },
  ],
};

function normalize(raw: unknown): GraphState {
  if (!raw || typeof raw !== "object") return clone(SEED);
  const data = raw as Partial<GraphState>;
  if (data.version !== 3 || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) return clone(SEED);
  const nodes = data.nodes.map(readNode).filter(Boolean) as StoredNode[];
  const ids = new Set(nodes.map((n) => n.id));
  if (!nodes.some((n) => n.type === "cash")) return clone(SEED);
  const edges = data.edges
    .map(readEdge)
    .filter((edge): edge is StoredEdge => !!edge && ids.has(edge.source) && ids.has(edge.target) && edge.source !== edge.target);
  return { version: 3, nodes, edges };
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

export function writeGraph(state: GraphState) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(ASSET_STORE_KEY, JSON.stringify(state));
}

export function resetGraph(): GraphState {
  const next = clone(SEED);
  writeGraph(next);
  return next;
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
};

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
  };
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
