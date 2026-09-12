import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type ProjectEntry } from "../projects";
import { useInView } from "./useInView";

export function ProjectsPanel() {
  return (
    <section id="projects">
      <div className="mb-12 flex items-baseline justify-between gap-3 sm:mb-16">
        <p className="os-label">02 — Projects</p>
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
  const pending = block.armed && !block.shown;

  return (
    <article
      ref={block.ref}
      className={`os-project os-project-${index + 1} os-reveal${pending ? " is-pending" : ""}${block.shown ? " is-in" : ""}`}
      style={{ transitionDelay: block.shown ? `${index * 70}ms` : "0ms" }}
    >
      <div className="os-project-kicker">
        <p className="os-label">{String(index + 1).padStart(2, "0")}</p>
        <p
          className="os-status"
          style={{ color: project.status === "BUILDING" ? "var(--pink)" : "var(--dim)" }}
        >
          {project.status}
        </p>
      </div>
      <p className="p-name">{project.name}</p>
      <p className="os-body mt-3 max-w-xs">{project.blurb}</p>
      <div className="mt-4">
        {project.here ? (
          <span className="os-label" style={{ color: "var(--system)" }}>
            Here
          </span>
        ) : (
          <a
            href={project.href}
            target={project.external ? "_blank" : undefined}
            rel={project.external ? "noopener noreferrer" : undefined}
            className="os-text-link"
          >
            Open
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
