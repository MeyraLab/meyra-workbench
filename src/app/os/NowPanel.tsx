import { ArrowUpRight } from "lucide-react";
import { NOW } from "../now";

export function NowPanel() {
  return (
    <section id="now" className="os-now-scene">
      <h1 className="os-now-name">{NOW.project}</h1>
      <a
        href={NOW.href}
        target="_blank"
        rel="noopener noreferrer"
        className="os-pill-btn"
      >
        Open
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </section>
  );
}
