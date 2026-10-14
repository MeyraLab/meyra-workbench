import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { APPS, ROLE_LABELS } from "../apps";
import { AssetsPanel as EditableAssets } from "../os/AssetsPanel";
import { ToolsPanel as ToolTree } from "../os/ToolsPanel";
import type { AppEntry } from "../apps";
import type { IconOverrides } from "../iconOverrides";
export const WorkbenchContext = createContext<{ apps: AppEntry[]; overrides: IconOverrides }>({ apps: APPS, overrides: {} });
import { LOG } from "../log";
import { NOW, WORKFLOW, WORKFLOW_ACTIVE } from "../now";
import { PROJECTS } from "../projects";

export function openOut(url: string) {
  window.open(new URL(url, window.location.href).href, "_blank", "noopener,noreferrer");
}

function OutLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"

    >
      {children}
    </a>
  );
}

const SECTIONS = [
  { id: "now", label: "Now", hint: NOW.project },
  { id: "projects", label: "Projects", hint: `${PROJECTS.length} rooms` },
  { id: "tools", label: "Tools", hint: `${APPS.length} links` },
  { id: "assets", label: "资产板", hint: "Cashflow" },
  { id: "log", label: "Log", hint: `${LOG.length} entries` },
  { id: "social", label: "Social", hint: "X · YouTube · 微信读书 · Grok" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

const SOCIAL = [
  { name: "X", href: "https://x.com" },
  { name: "YouTube", href: "https://youtube.com" },
  { name: "微信读书", href: "https://weread.qq.com" },
  { name: "Grok", href: "https://grok.com" },
] as const;

export function NowPanel() {
  return (
    <div className="wb-pad">
      <p className="wb-kicker">
        {NOW.status} · {NOW.user}
      </p>
      <h2 className="wb-name">{NOW.project}</h2>
      <p className="wb-next">{NOW.next}</p>
      <OutLink className="wb-open" href={NOW.href}>
        Open
      </OutLink>
      <p className="wb-steps" aria-label="Workflow">
        {WORKFLOW.map((step, index) => (
          <span key={step}>
            {index > 0 ? <span className="wb-dash"> — </span> : null}
            <span className={index === WORKFLOW_ACTIVE ? "is-on" : ""}>{step}</span>
          </span>
        ))}
      </p>
    </div>
  );
}

export function ProjectsPanel() {
  return (
    <div className="wb-pad">
      <p className="wb-kicker">Projects</p>
      <div className="wb-grid">
        {PROJECTS.map((project) => (
          <OutLink key={project.id} className="wb-card" href={project.href}>
            <img src={project.image} alt="" />
            <span className="wb-card-copy">
              <b>{project.name}</b>
              <small>
                {project.status} · {project.blurb}
              </small>
            </span>
          </OutLink>
        ))}
      </div>
    </div>
  );
}

export function ToolsPanel() {
  const { apps, overrides } = useContext(WorkbenchContext);
  const [open, setOpen] = useState(true);
  return <div className="wb-pad wb-tool-tree"><ToolTree apps={apps} overrides={overrides} open={open} onToggle={() => setOpen(value => !value)} /></div>;
}

export function AssetsPanel() {
  return <div className="wb-pad wb-editable-assets"><EditableAssets /></div>;
}

export function LogPanel() {
  return (
    <div className="wb-pad">
      <p className="wb-kicker">
        Log <span>{String(LOG.length).padStart(2, "0")}</span>
      </p>
      <ul className="wb-log">
        {LOG.map((entry) => (
          <li key={`${entry.date}-${entry.title}`}>
            <small>{entry.date}</small>
            <small>{entry.system}</small>
            <b>{entry.title}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SocialPanel() {
  return (
    <div className="wb-pad">
      <p className="wb-kicker">Social</p>
      <div className="wb-social">
        {SOCIAL.map((item) => (
          <OutLink key={item.name} href={item.href}>
            {item.name}
          </OutLink>
        ))}
      </div>
    </div>
  );
}

export function Launchpad({ onClose }: { onClose: () => void }) {
  const { apps } = useContext(WorkbenchContext);
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((app) => `${app.name} ${ROLE_LABELS[app.role]}`.toLowerCase().includes(q));
  }, [query, apps]);
  return (
    <div className="cdp-over cdp-launch" onClick={onClose}>
      <input
        className="cdp-launch-q"
        placeholder="Tools"
        value={query}
        aria-label="Search tools"
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="cdp-launch-grid" onClick={(event) => event.stopPropagation()}>
        {list.map((app) => (
          <OutLink key={`${app.role}-${app.name}`} className="wb-launch" href={app.url}>
            <span>{app.name.slice(0, 1)}</span>
            <b>{app.name}</b>
            <small>{ROLE_LABELS[app.role]}</small>
          </OutLink>
        ))}
      </div>
    </div>
  );
}

export function Spotlight({ onClose, onOpen }: { onClose: () => void; onOpen: (id: SectionId) => void }) {
  const { apps } = useContext(WorkbenchContext);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sections = SECTIONS.filter((item) => !q || `${item.label} ${item.hint}`.toLowerCase().includes(q)).map((item) => ({
      key: item.id,
      title: item.label,
      meta: item.hint,
      open: () => onOpen(item.id),
    }));
    const projects = PROJECTS.filter((item) => !q || `${item.name} ${item.blurb} ${item.status}`.toLowerCase().includes(q)).map((item) => ({
      key: item.id,
      title: item.name,
      meta: item.blurb,
      open: () => onOpen("projects"),
    }));
    const toolHits = apps.filter((item) => !q || item.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((item) => ({
        key: `${item.role}-${item.name}`,
        title: item.name,
        meta: ROLE_LABELS[item.role],
        open: () => openOut(item.url),
      }));
    return [...sections, ...projects, ...toolHits];
  }, [onOpen, query, apps]);
  const current = hits[Math.min(cursor, Math.max(0, hits.length - 1))];
  return (
    <div className="cdp-over cdp-spot-wrap" onClick={onClose}>
      <div className="cdp-spot" onClick={(event) => event.stopPropagation()}>
        <label className="cdp-spot-in">
          <input
            autoFocus
            placeholder="Spotlight"
            value={query}
            aria-label="Spotlight"
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setCursor((index) => Math.min(hits.length - 1, index + 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setCursor((index) => Math.max(0, index - 1));
              } else if (event.key === "Enter" && current) {
                current.open();
                onClose();
              } else if (event.key === "Escape") onClose();
            }}
          />
        </label>
        <ul className="cdp-spot-list">
          {hits.map((hit, index) => (
            <li key={hit.key}>
              <button
                type="button"
                className={index === cursor ? "is-on" : ""}
                onMouseEnter={() => setCursor(index)}
                onClick={() => {
                  hit.open();
                  onClose();
                }}
              >
                <b>{hit.title}</b>
                <span className="cdp-muted">{hit.meta}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
