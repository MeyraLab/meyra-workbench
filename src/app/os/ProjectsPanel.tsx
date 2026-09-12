import { ArrowUpRight } from "lucide-react";
import type { PointerEvent } from "react";
import { PROJECTS, type ProjectEntry } from "../projects";
import { useInView } from "./useInView";

export function ProjectsPanel() {
  return (
    <section id="projects" className="os-rooms-section">
      <h2 className="os-world-title os-canvas-title">Projects</h2>
      <div className="os-rooms">
        {PROJECTS.map((project, index) => (
          <ProjectRoom key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function ProjectRoom({ project, index }: { project: ProjectEntry; index: number }) {
  const block = useInView<HTMLAnchorElement>();
  const pending = block.armed && !block.shown;

  const tilt = (e: PointerEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--rx", `${(-y * 9).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--ry", `${(x * 11).toFixed(2)}deg`);
  };

  const untilt = (e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <a
      ref={block.ref}
      href={project.href}
      target={project.external ? "_blank" : undefined}
      rel={project.external ? "noopener noreferrer" : undefined}
      className={`os-room os-room-${index + 1} os-reveal${pending ? " is-pending" : ""}${block.shown ? " is-in" : ""}`}
      style={{ transitionDelay: block.shown ? `${index * 80}ms` : "0ms" }}
      onPointerMove={tilt}
      onPointerLeave={untilt}
    >
      <img src={project.image} alt="" />
      <span className="os-room-orb" aria-hidden="true">
        <ArrowUpRight className="h-5 w-5" />
      </span>
      <div className="os-room-caption">
        <h3>{project.name}</h3>
      </div>
    </a>
  );
}
