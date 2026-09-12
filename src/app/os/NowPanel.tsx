import { ArrowUpRight } from "lucide-react";
import { NOW } from "../now";
import { PaiMark } from "./PaiMark";

export function NowPanel() {
  return (
    <section id="now" className="os-now-scene">
      <div className="os-now-copy">
        <p className="os-label mb-6 sm:mb-8">01 — Now</p>
        <h1 className="os-now-name">{NOW.project}</h1>
        <div className="os-now-meta">
          <div className="min-w-0">
            <p className="os-now-status">{NOW.status}</p>
            <p className="os-now-next">{NOW.next}</p>
            <p className="os-label mt-3">User {NOW.user}</p>
          </div>
          <a
            href={NOW.href}
            target="_blank"
            rel="noopener noreferrer"
            className="os-btn w-full sm:w-auto"
          >
            Open project
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      <div className="os-now-being" aria-hidden="true">
        <PaiMark className="os-now-pai" />
      </div>
    </section>
  );
}
