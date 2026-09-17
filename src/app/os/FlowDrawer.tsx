import { X } from "lucide-react";
import {
  QUADRANTS,
  type FlowNodeData,
  type NodeKind,
  type Quadrant,
  type StoredEdge,
  type StoredNode,
} from "../assets";

export type Selection =
  | { type: "node"; id: string }
  | { type: "edge"; id: string }
  | { type: "add"; x: number; y: number }
  | null;

type Props = {
  selection: Selection;
  nodes: StoredNode[];
  edges: StoredEdge[];
  onClose: () => void;
  onNode: (id: string, patch: Partial<FlowNodeData>) => void;
  onEdge: (id: string, monthly: number) => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onAdd: (kind: Exclude<NodeKind, "cash" | "summary">) => void;
};

export function FlowDrawer({
  selection,
  nodes,
  edges,
  onClose,
  onNode,
  onEdge,
  onDeleteNode,
  onDeleteEdge,
  onAdd,
}: Props) {
  if (!selection) return null;
  const node = selection.type === "node" ? nodes.find((item) => item.id === selection.id) : undefined;
  const edge = selection.type === "edge" ? edges.find((item) => item.id === selection.id) : undefined;

  return (
    <aside className="os-flow-drawer" aria-label="编辑">
      <div className="os-flow-drawer-top">
        <p className="os-label">{titleFor(selection, node, edge)}</p>
        <button type="button" className="os-asset-x" onClick={onClose} aria-label="关闭">
          <X className="h-4 w-4" />
        </button>
      </div>

      {selection.type === "add" ? (
        <div className="os-flow-addlist">
          {(["income", "asset", "liability", "expense"] as const).map((kind) => (
            <button key={kind} type="button" className="os-flow-addbtn" onClick={() => onAdd(kind)}>
              {kind === "income" ? "收入" : kind === "asset" ? "资产" : kind === "liability" ? "负债" : "支出"}
            </button>
          ))}
        </div>
      ) : null}

      {node && node.type !== "summary" ? (
        <NodeFields node={node} onNode={onNode} onDelete={node.type === "cash" ? undefined : () => onDeleteNode(node.id)} />
      ) : null}

      {edge ? (
        <div className="os-flow-fields">
          <label>
            月现金流
            <input
              inputMode="decimal"
              defaultValue={String(edge.data.monthly)}
              key={edge.id + edge.data.monthly}
              onBlur={(e) => onEdge(edge.id, Number(e.target.value))}
            />
          </label>
          <button type="button" className="os-text-link" onClick={() => onDeleteEdge(edge.id)}>
            删除
          </button>
        </div>
      ) : null}
    </aside>
  );
}

function titleFor(selection: Selection, node?: StoredNode, edge?: StoredEdge) {
  if (selection?.type === "add") return "添加";
  if (node) return node.data.name;
  if (edge) return "箭头";
  return "编辑";
}

function NodeFields({
  node,
  onNode,
  onDelete,
}: {
  node: StoredNode;
  onNode: (id: string, patch: Partial<FlowNodeData>) => void;
  onDelete?: () => void;
}) {
  const data = node.data;
  return (
    <div className="os-flow-fields">
      <label>
        名称
        <input
          key={node.id + "-name"}
          defaultValue={data.name}
          maxLength={48}
          onBlur={(e) => onNode(node.id, { name: e.target.value })}
        />
      </label>
      {node.type === "income" ? (
        <label>
          象限
          <select
            value={data.quadrant ?? "S"}
            onChange={(e) => onNode(node.id, { quadrant: e.target.value as Quadrant })}
          >
            {QUADRANTS.map((q) => (
              <option key={q.id} value={q.id}>
                {q.id} {q.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {node.type === "asset" ? (
        <>
          <label>
            类型
            <select value={data.subtype ?? "digital"} onChange={(e) => onNode(node.id, { subtype: e.target.value })}>
              <option value="digital">数字产品</option>
              <option value="dividend">分红</option>
              <option value="rent">租金</option>
              <option value="other">其他</option>
            </select>
          </label>
          {data.subtype === "digital" ? (
            <label>
              上架数
              <input
                key={node.id + "-list"}
                inputMode="numeric"
                defaultValue={String(data.listings ?? 1)}
                onBlur={(e) => onNode(node.id, { listings: Number(e.target.value) })}
              />
            </label>
          ) : null}
        </>
      ) : null}
      {node.type === "liability" ? (
        <label>
          类型
          <select value={data.subtype ?? "loan"} onChange={(e) => onNode(node.id, { subtype: e.target.value })}>
            <option value="loan">分期 / 贷款</option>
            <option value="mortgage">房贷</option>
            <option value="subscription">订阅债</option>
            <option value="other">其他</option>
          </select>
        </label>
      ) : null}
      {node.type === "expense" ? (
        <label>
          类型
          <select value={data.subtype ?? "living"} onChange={(e) => onNode(node.id, { subtype: e.target.value })}>
            <option value="living">固定生活</option>
            <option value="tools">工具订阅</option>
          </select>
        </label>
      ) : null}
      {node.type !== "cash" ? (
        <label>
          {node.type === "income" ? "月流入" : node.type === "asset" ? "月回流" : node.type === "liability" ? "月抽干" : "月支出"}
          <input
            key={node.id + "-m"}
            inputMode="decimal"
            defaultValue={String(data.monthly)}
            onBlur={(e) => onNode(node.id, { monthly: Number(e.target.value) })}
          />
        </label>
      ) : null}
      {node.type === "asset" || node.type === "liability" ? (
        <label>
          {node.type === "asset" ? "资产净值" : "剩余本金"}
          <input
            key={node.id + "-w"}
            inputMode="decimal"
            defaultValue={String(data.worth)}
            onBlur={(e) => onNode(node.id, { worth: Number(e.target.value) })}
          />
        </label>
      ) : null}
      {onDelete ? (
        <button type="button" className="os-text-link" onClick={onDelete}>
          删除
        </button>
      ) : null}
    </div>
  );
}
