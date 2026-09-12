import { ArrowUpRight } from "lucide-react";
import { NOW } from "../now";

export function NowPanel() {
  return (
    <section id="now" className="pt-8 sm:pt-14">
      <p className="os-label mb-10 sm:mb-16">01 — Now</p>

      <h1 className="os-now-name">{NOW.project}</h1>

      <div className="os-now-meta">
        <div className="min-w-0">
          <p className="os-now-status">{NOW.status}</p>
          <p className="os-now-next">{NOW.next}</p>
          <p className="os-label mt-4">User {NOW.user}</p>
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
    </section>
  );
}
