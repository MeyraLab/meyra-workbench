import { WORKFLOW, WORKFLOW_ACTIVE } from "../now";

export function WorkflowBar() {
  return (
    <section aria-label="Workflow" className="py-1">
      <div className="os-flow">
        {WORKFLOW.map((step, index) => {
          const on = index === WORKFLOW_ACTIVE;
          return (
            <div key={step} className="os-flow-step">
              <span className="os-label" style={{ color: on ? "var(--system)" : "var(--dim)" }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className="os-flow-name"
                style={{ color: on ? "var(--text)" : "var(--mute)" }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
