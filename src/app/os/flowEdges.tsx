import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, MarkerType, type Edge, type EdgeProps } from "@xyflow/react";
import { flowStroke, formatCny, type FlowKind } from "../assets";

export type FlowEdgeData = { monthly: number; kind: FlowKind };
export type FlowEdge = Edge<FlowEdgeData>;

export function CashflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<FlowEdge>) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 18,
  });
  const monthly = data?.monthly ?? 0;
  const kind = data?.kind ?? "in";
  const outgoing = kind === "out" || kind === "drain";
  const color = outgoing ? "var(--pink)" : "var(--system)";
  const showLabel = monthly > 0 && kind !== "reinvest" && kind !== "link";
  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={{ type: MarkerType.ArrowClosed, color, width: 18, height: 18 }}
        style={{
          stroke: color,
          strokeWidth: flowStroke(monthly) + (selected ? 1 : 0),
          strokeDasharray: kind === "drain" || kind === "link" ? "7 5" : undefined,
        }}
      />
      {showLabel ? (
        <EdgeLabelRenderer>
          <div
            className={`os-flow-elabel nodrag nopan${selected ? " is-on" : ""}`}
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {formatCny(outgoing ? -Math.abs(monthly) : monthly)}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

export const FLOW_EDGE_TYPES = {
  cashflow: CashflowEdge,
};
