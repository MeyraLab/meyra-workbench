import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  defaultNode,
  formatCny,
  formatPct,
  graphStats,
  inferFlowKind,
  nid,
  readGraph,
  resetGraph,
  upsertEdge,
  writeGraph,
  type FlowKind,
  type FlowNodeData,
  type NodeKind,
  type StoredEdge,
  type StoredNode,
} from "../assets";
import { FlowDrawer, type Selection } from "./FlowDrawer";
import { FLOW_EDGE_TYPES, type FlowEdge } from "./flowEdges";
import { FLOW_NODE_TYPES, applyStatsToNodes, type FlowNode } from "./flowNodes";
import { useInView } from "./useInView";

function toFlowNodes(nodes: StoredNode[]): FlowNode[] {
  return nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
    connectable: node.type !== "summary",
  }));
}

function toFlowEdges(edges: StoredEdge[]): FlowEdge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? undefined,
    targetHandle: edge.targetHandle ?? undefined,
    type: "cashflow",
    data: edge.data,
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
  }));
}

function toStoredNodes(nodes: FlowNode[]): StoredNode[] {
  return nodes.map((node) => ({
    id: node.id,
    type: (node.type as NodeKind) || node.data.kind,
    position: node.position,
    data: node.data,
  }));
}

function toStoredEdges(edges: FlowEdge[]): StoredEdge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    data: edge.data ?? { monthly: 0, kind: "in" as FlowKind },
  }));
}

export function AssetsPanel() {
  const block = useInView<HTMLElement>();
  const pending = block.armed && !block.shown;
  return (
    <section
      id="assets"
      ref={block.ref}
      className={`os-assets-section os-reveal${pending ? " is-pending" : ""}${block.shown ? " is-in" : ""}`}
      aria-labelledby="assets-title"
    >
      <header className="os-assets-head">
        <div>
          <p className="os-kicker">Cashflow · ER canvas</p>
          <h2 id="assets-title" className="os-world-title os-canvas-title">
            资产板
          </h2>
        </div>
      </header>
      <p className="os-assets-lede">
        箭头是账本。资产把钱放进口袋，负债把钱拿出口袋。数字产品走 B 象限。
      </p>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
      <footer className="os-assets-foot">
        <p>个人学习框架，非投资建议。</p>
      </footer>
    </section>
  );
}

function FlowCanvas() {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [nodes, setNodes] = useState<FlowNode[]>(() => toFlowNodes(readGraph().nodes));
  const [edges, setEdges] = useState<FlowEdge[]>(() => toFlowEdges(readGraph().edges));
  const [selection, setSelection] = useState<Selection>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    writeGraph({ version: 3, nodes: toStoredNodes(nodes), edges: toStoredEdges(edges) });
  }, [nodes, edges]);

  const storedNodes = useMemo(() => toStoredNodes(nodes), [nodes]);
  const storedEdges = useMemo(() => toStoredEdges(edges), [edges]);
  const stats = useMemo(() => graphStats(storedNodes, storedEdges), [storedNodes, storedEdges]);
  const viewNodes = useMemo(() => applyStatsToNodes(nodes, stats), [nodes, stats]);

  const onNodesChange = useCallback(
    (changes: NodeChange<FlowNode>[]) => {
      const allowed = changes.filter((change) => {
        if (change.type !== "remove") return true;
        const node = nodes.find((item) => item.id === change.id);
        return node?.type !== "cash" && node?.type !== "summary";
      });
      setNodes((current) => applyNodeChanges(allowed, current));
    },
    [nodes],
  );

  const onEdgesChange = useCallback((changes: EdgeChange<FlowEdge>[]) => {
    setEdges((current) => applyEdgeChanges(changes, current));
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target || connection.source === connection.target) return;
      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
      if (!source || !target || source.type === "summary" || target.type === "summary") return;
      const kind = inferFlowKind(source.type, target.type);
      const monthly =
        kind === "in" || kind === "return" || kind === "drain"
          ? source.data.monthly
          : kind === "out"
            ? target.data.monthly
            : 0;
      setEdges((current) =>
        addEdge(
          {
            ...connection,
            id: nid("e"),
            type: "cashflow",
            data: { monthly, kind },
            markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
          },
          current,
        ),
      );
    },
    [nodes],
  );

  const patchNode = (id: string, patch: Partial<FlowNodeData>) => {
    setNodes((current) => {
      const next = current.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...patch, kind: node.data.kind } } : node,
      );
      if (patch.monthly == null || Number.isNaN(Number(patch.monthly))) return next;
      const monthly = Math.max(0, Math.round(Number(patch.monthly) || 0));
      const node = next.find((item) => item.id === id);
      const cash = next.find((item) => item.type === "cash")?.id ?? "cash";
      if (node) {
        setEdges((edgesNow) => {
          const stored = toStoredEdges(edgesNow);
          if (node.type === "income") return toFlowEdges(upsertEdge(stored, id, cash, monthly, "in"));
          if (node.type === "asset") return toFlowEdges(upsertEdge(stored, id, cash, monthly, "return"));
          if (node.type === "liability") return toFlowEdges(upsertEdge(stored, id, cash, monthly, "drain"));
          if (node.type === "expense") return toFlowEdges(upsertEdge(stored, cash, id, monthly, "out"));
          return edgesNow;
        });
      }
      return next;
    });
  };

  const patchEdge = (id: string, monthlyRaw: number) => {
    const monthly = Math.max(0, Math.round(Number.isFinite(monthlyRaw) ? monthlyRaw : 0));
    setEdges((current) => {
      const next = current.map((edge) =>
        edge.id === id ? { ...edge, data: { ...(edge.data ?? { kind: "in" as FlowKind, monthly: 0 }), monthly } } : edge,
      );
      const edge = next.find((item) => item.id === id);
      if (edge?.data) {
        const kind = edge.data.kind;
        const nodeId =
          kind === "in" || kind === "return" || kind === "drain"
            ? edge.source
            : kind === "out"
              ? edge.target
              : null;
        if (nodeId) {
          setNodes((nodesNow) =>
            nodesNow.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, monthly } } : node)),
          );
        }
      }
      return next;
    });
  };

  const deleteNode = (id: string) => {
    setNodes((current) => {
      const target = current.find((node) => node.id === id);
      if (!target || target.type === "cash" || target.type === "summary") return current;
      return current.filter((node) => node.id !== id);
    });
    setEdges((current) => current.filter((edge) => edge.source !== id && edge.target !== id));
    setSelection(null);
  };

  const deleteEdge = (id: string) => {
    setEdges((current) => current.filter((edge) => edge.id !== id));
    setSelection(null);
  };

  const addNode = (kind: Exclude<NodeKind, "cash" | "summary">) => {
    const position =
      selection?.type === "add"
        ? { x: selection.x, y: selection.y }
        : { x: 360, y: 320 };
    const node = defaultNode(kind, position);
    setNodes((current) => [...current, ...toFlowNodes([node])]);
    setSelection({ type: "node", id: node.id });
  };

  return (
    <div className="os-flow-stage">
      <ReactFlow
        nodes={viewNodes}
        edges={edges}
        nodeTypes={FLOW_NODE_TYPES}
        edgeTypes={FLOW_EDGE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelection({ type: "node", id: node.id })}
        onEdgeClick={(_, edge) => setSelection({ type: "edge", id: edge.id })}
        onPaneClick={(event) => {
          const point = screenToFlowPosition({ x: event.clientX, y: event.clientY });
          setSelection({ type: "add", x: point.x, y: point.y });
        }}
        connectionMode={ConnectionMode.Loose}
        colorMode={theme}
        fitView
        fitViewOptions={{ padding: 0.14 }}
        minZoom={0.45}
        maxZoom={1.6}
        snapToGrid
        snapGrid={[8, 8]}
        zoomOnScroll={false}
        panOnScroll={false}
        preventScrolling={false}
        panOnDrag
        selectionOnDrag={false}
        deleteKeyCode={["Backspace", "Delete"]}
        onInit={() => fitView({ padding: 0.14 })}
        isValidConnection={(conn) => {
          if (!conn.source || !conn.target || conn.source === conn.target) return false;
          const source = nodes.find((node) => node.id === conn.source);
          const target = nodes.find((node) => node.id === conn.target);
          return source?.type !== "summary" && target?.type !== "summary";
        }}
        defaultEdgeOptions={{
          type: "cashflow",
          markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} color="var(--grid)" />
        <Controls showInteractive={false} position="bottom-left" />
        <Panel position="top-left" className="os-flow-legend">
          <span className="is-in">流入</span>
          <span className="is-out">流出</span>
          <span className="is-drain">负债抽干</span>
        </Panel>
        <Panel position="bottom-right" className="os-flow-race">
          <p className="os-label">Rat Race</p>
          <p className={`os-flow-race-flag${stats.escaped ? " is-free" : ""}`}>
            {stats.escaped ? "被动已覆盖支出" : "尚未脱离鼠赛"}
          </p>
          <p>
            被动 {formatCny(stats.passive)} / 支出 {formatCny(stats.expenses)} · 覆盖 {formatPct(stats.coverage)}
          </p>
        </Panel>
        <Panel position="bottom-center" className="os-flow-tools">
          <button type="button" onClick={() => setSelection({ type: "add", x: 380, y: 300 })}>
            添加节点
          </button>
          <button
            type="button"
            onClick={() => {
              const next = resetGraph();
              setNodes(toFlowNodes(next.nodes));
              setEdges(toFlowEdges(next.edges));
              setSelection(null);
              window.requestAnimationFrame(() => fitView({ padding: 0.14 }));
            }}
          >
            重置示例
          </button>
        </Panel>
      </ReactFlow>
      <FlowDrawer
        selection={selection}
        nodes={storedNodes}
        edges={storedEdges}
        onClose={() => setSelection(null)}
        onNode={patchNode}
        onEdge={patchEdge}
        onDeleteNode={deleteNode}
        onDeleteEdge={deleteEdge}
        onAdd={addNode}
      />
    </div>
  );
}
