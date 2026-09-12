import { ArrowUpRight } from "lucide-react";
import { NOW } from "../now";

export function NowPanel() {
  return (
    <section id="now" className="os-now-scene">
      <p className="os-kicker">01 — Now</p>
      <h1 className="os-now-name">{NOW.project}</h1>
      <p className="os-now-status">{NOW.status}</p>
      <p className="os-now-next">{NOW.next}</p>
      <a
        href={NOW.href}
        target="_blank"
        rel="noopener noreferrer"
        className="os-pill-btn"
      >
        Open project
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </section>
  );
}
