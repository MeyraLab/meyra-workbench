import { ArrowUpRight } from "lucide-react";
import { NOW } from "../now";
import { useInView } from "./useInView";

export function NowPanel() {
  const name = useInView<HTMLHeadingElement>();
  const meta = useInView<HTMLDivElement>();

  return (
    <section id="now" className="pt-6 sm:pt-12">
      <p className="os-label mb-10 sm:mb-14">01 — Now</p>

      <h1
        ref={name.ref}
        className={`os-now-name os-reveal-name${name.shown ? " is-in" : ""}`}
      >
        {NOW.project}
      </h1>

      <div
        ref={meta.ref}
        className={`os-now-meta os-reveal${meta.shown ? " is-in" : ""}`}
      >
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
