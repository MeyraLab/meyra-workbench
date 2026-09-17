import type { ReactNode } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { deedBand, formatCny, formatPct, quadrantMeta, subtypeLabel, type FlowNodeData, type GraphStats } from "../assets";

export type FlowNode = Node<FlowNodeData, FlowNodeData["kind"]>;

type Props = NodeProps<FlowNode>;

function Ports({ kind }: { kind: FlowNodeData["kind"] }) {
  if (kind === "summary") return null;
  return (
    <>
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="source" position={Position.Right} id="r" />
    </>
  );
}

function Shell({
  data,
  selected,
  children,
}: {
  data: FlowNodeData;
  selected?: boolean;
  children: ReactNode;
}) {
  return (
    <article className={`os-fn is-deed is-${data.kind} band-${deedBand(data)}${selected ? " is-on" : ""}`}>
      <span className="os-deed-band" aria-hidden="true" />
      <Ports kind={data.kind} />
      {children}
    </article>
  );
}

export function IncomeNode({ data, selected }: Props) {
  const q = quadrantMeta(data.quadrant);
  return (
    <Shell data={data} selected={selected}>
      <p className="os-label">
        {data.quadrant ?? "E"} · {q?.label ?? "收入"}
      </p>
      <h3>{data.name}</h3>
      <p className="os-fn-amt is-plus">{formatCny(data.monthly)}<small>/月</small></p>
    </Shell>
  );
}

export function CashNode({ data, selected }: Props) {
  const net = data.monthly;
  return (
    <Shell data={data} selected={selected}>
      <p className="os-kicker">Cash pool</p>
      <h3>{data.name}</h3>
      <p className={`os-fn-amt is-lg${net >= 0 ? " is-plus" : " is-minus"}`}>
        {formatCny(net)}
        <small>/月</small>
      </p>
    </Shell>
  );
}

export function AssetNode({ data, selected }: Props) {
  return (
    <Shell data={data} selected={selected}>
      <p className="os-label">{subtypeLabel("asset", data.subtype)}</p>
      <h3>{data.name}</h3>
      {data.subtype === "digital" && data.listings != null ? (
        <p className="os-fn-meta">上架 {String(data.listings).padStart(2, "0")}</p>
      ) : null}
      <p className="os-fn-amt is-plus">{formatCny(data.monthly)}<small>/月</small></p>
    </Shell>
  );
}

export function LiabilityNode({ data, selected }: Props) {
  return (
    <Shell data={data} selected={selected}>
      <p className="os-label">{subtypeLabel("liability", data.subtype)}</p>
      <h3>{data.name}</h3>
      <p className="os-fn-amt is-minus">{formatCny(-Math.abs(data.monthly))}<small>/月</small></p>
    </Shell>
  );
}

export function ExpenseNode({ data, selected }: Props) {
  return (
    <Shell data={data} selected={selected}>
      <p className="os-label">{subtypeLabel("expense", data.subtype)}</p>
      <h3>{data.name}</h3>
      <p className="os-fn-amt is-minus">{formatCny(-Math.abs(data.monthly))}<small>/月</small></p>
    </Shell>
  );
}

export function SummaryNode({ data, selected }: Props) {
  const tone = data.summary === "coverage" ? "" : data.monthly >= 0 ? " is-plus" : " is-minus";
  const value =
    data.summary === "coverage" ? formatPct(data.monthly) : formatCny(data.monthly);
  return (
    <Shell data={data} selected={selected}>
      <p className="os-label">{data.summary === "worth" ? "Net worth" : data.summary === "net" ? "Cashflow" : "Coverage"}</p>
      <h3>{data.name}</h3>
      <p className={`os-fn-amt${tone}`}>{value}</p>
    </Shell>
  );
}

export const FLOW_NODE_TYPES = {
  income: IncomeNode,
  cash: CashNode,
  asset: AssetNode,
  liability: LiabilityNode,
  expense: ExpenseNode,
  summary: SummaryNode,
};

export function applyStatsToNodes(nodes: FlowNode[], stats: GraphStats): FlowNode[] {
  return nodes.map((node) => {
    if (node.type === "cash") {
      return { ...node, data: { ...node.data, monthly: stats.net }, draggable: true };
    }
    if (node.type === "summary") {
      const monthly =
        node.data.summary === "worth" ? stats.worth : node.data.summary === "net" ? stats.net : stats.coverage;
      return { ...node, data: { ...node.data, monthly }, draggable: true, connectable: false };
    }
    return node;
  });
}
