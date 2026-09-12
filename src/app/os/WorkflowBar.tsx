import { WORKFLOW, WORKFLOW_ACTIVE } from "../now";

export function WorkflowBar() {
  return (
    <section aria-label="Workflow" className="py-1">
      <div className="os-flow">
        {WORKFLOW.map((step, index) => {
          const on = index === WORKFLOW_ACTIVE;
          return (
            <div key={step} className="os-flow-step">
              {index > 0 ? (
                <span className="os-flow-dash" aria-hidden="true">
                  —
                </span>
              ) : null}
              <span className={`os-flow-name${on ? " is-on" : ""}`}>{step}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
