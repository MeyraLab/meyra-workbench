import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type ProjectEntry } from "../projects";
import { useInView } from "./useInView";

export function ProjectsPanel() {
  return (
    <section id="projects">
      <div className="mb-12 flex items-baseline justify-between gap-3 sm:mb-16">
        <p className="os-label">02 — My projects</p>
        <span className="os-status">{String(PROJECTS.length).padStart(2, "0")}</span>
      </div>
      <div className="os-projects">
        {PROJECTS.map((project, index) => (
          <ProjectObject key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function ProjectObject({ project, index }: { project: ProjectEntry; index: number }) {
  const block = useInView<HTMLElement>();

  return (
    <article
      ref={block.ref}
      className={`os-project os-reveal${block.shown ? " is-in" : ""}`}
      style={{ transitionDelay: block.shown ? `${index * 90}ms` : "0ms" }}
    >
      <p className="os-label mb-3">{String(index + 1).padStart(2, "0")}</p>
      <p className="p-name">{project.name}</p>
      <p
        className="os-status mt-3"
        style={{ color: project.status === "ACTIVE" ? "var(--system)" : "var(--pink)" }}
      >
        {project.status}
      </p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-mute">{project.blurb}</p>
      <div className="mt-6">
        {project.here ? (
          <span className="os-label" style={{ color: "var(--system)" }}>
            Here
          </span>
        ) : (
          <a
            href={project.href}
            target={project.external ? "_blank" : undefined}
            rel={project.external ? "noopener noreferrer" : undefined}
            className="os-btn os-btn-ghost"
          >
            Open
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
