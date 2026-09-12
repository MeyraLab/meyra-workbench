import { LOG } from "../log";
import { useInView } from "./useInView";

export function LogPanel() {
  const block = useInView<HTMLElement>();
  const pending = block.armed && !block.shown;

  return (
    <section id="log" ref={block.ref}>
      <div className="mb-10 flex items-baseline justify-between gap-3 sm:mb-12">
        <p className="os-world-title" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>Log</p>
        <span className="os-status">{String(LOG.length).padStart(2, "0")}</span>
      </div>
      <div>
        {LOG.map((entry, index) => (
          <div
            key={`${entry.date}-${entry.title}`}
            className={`os-log-row os-reveal os-reveal-quiet${pending ? " is-pending" : ""}${block.shown ? " is-in" : ""}`}
            style={{ transitionDelay: block.shown ? `${index * 50}ms` : "0ms" }}
          >
            <p className="os-label">{entry.date}</p>
            <p className="os-label">{entry.system}</p>
            <p className="os-log-title">{entry.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
