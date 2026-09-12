import { PROJECTS, type ProjectEntry } from "../projects";
import { useInView } from "./useInView";

export function ProjectsPanel() {
  return (
    <section id="projects" className="os-rooms-section">
      <div className="os-rooms-head">
        <h2 className="os-world-title">My projects</h2>
        <span className="os-kicker">{String(PROJECTS.length).padStart(2, "0")}</span>
      </div>
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

  return (
    <a
      ref={block.ref}
      href={project.href}
      target={project.external ? "_blank" : undefined}
      rel={project.external ? "noopener noreferrer" : undefined}
      className={`os-room os-room-${index + 1} os-reveal${pending ? " is-pending" : ""}${block.shown ? " is-in" : ""}`}
      style={{ transitionDelay: block.shown ? `${index * 80}ms` : "0ms" }}
    >
      <img src={project.image} alt="" />
      <span className="os-room-orb" aria-hidden="true" />
      <div className="os-room-caption">
        <p className="os-kicker">
          {String(index + 1).padStart(2, "0")} · {project.status}
        </p>
        <h3>{project.name}</h3>
        <p>{project.blurb}</p>
      </div>
    </a>
  );
}
