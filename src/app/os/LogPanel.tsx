import { LOG } from "../log";
import { useInView } from "./useInView";

export function LogPanel() {
  const block = useInView<HTMLElement>();

  return (
    <section id="log" ref={block.ref}>
      <div className="mb-10 flex items-baseline justify-between gap-3 sm:mb-12">
        <p className="os-label">04 — Meyra log</p>
        <span className="os-status">{String(LOG.length).padStart(2, "0")}</span>
      </div>
      <div>
        {LOG.map((entry, index) => (
          <div
            key={`${entry.date}-${entry.title}`}
            className={`os-log-row os-reveal${block.shown ? " is-in" : ""}`}
            style={{ transitionDelay: block.shown ? `${index * 90}ms` : "0ms" }}
          >
            <p className="os-label" style={{ color: "var(--mute)" }}>
              {entry.date}
            </p>
            <p className="os-label" style={{ color: "var(--system)" }}>
              {entry.system}
            </p>
            <p className="font-medium leading-snug sm:text-lg">{entry.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
