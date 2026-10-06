import { ArrowUpRight, File, Folder, FolderOpen, Minus, Plus } from "lucide-react";
import { ROLE_LABELS, ROLES, type AppEntry, type AppRole } from "../apps";

import type { IconOverrides } from "../iconOverrides";
import { useState } from "react";
import "./ToolsPanel.css";

type Props = {
  apps: AppEntry[];
  overrides: IconOverrides;
  open: boolean;
  onToggle: () => void;
};

export function ToolsPanel({ apps, open, onToggle }: Props) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const byRole = (role: AppRole) => apps.filter((app) => app.role === role);

  return (
    <section id="tools">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="os-tools-toggle"
      >
        <span>
          <span className="os-tools-word">Tools</span>
        </span>
        <span
          className="os-label flex items-center gap-3"
          style={{ color: open ? "var(--system)" : "var(--dim)" }}
        >
          {String(apps.length).padStart(2, "0")}
          <span className="os-icon-swap" aria-hidden="true">
            <Plus className={open ? "is-off" : "is-on"} />
            <Minus className={open ? "is-on" : "is-off"} />
          </span>
        </span>
      </button>
      <div className={`os-tools-body${open ? " is-open" : ""}`}>
        <div className="os-tools-inner" inert={!open}>
          <nav className="os-tools-tree" aria-label="工具目录">
            <ul className="os-tree-root">
              {ROLES.map((role) => {
                const list = byRole(role);
                if (!list.length) return null;
                return (
                  <li key={role} className="os-tree-item">
                    <details className="os-tree-folder" open>
                      <summary className="os-tree-row os-tree-label">
                        <Folder className="os-tree-icon os-tree-closed" aria-hidden="true" />
                        <FolderOpen className="os-tree-icon os-tree-open" aria-hidden="true" />
                        <span className="os-tree-name">{ROLE_LABELS[role]}</span>
                        <span className="os-tree-count">{String(list.length).padStart(2, "0")}</span>
                      </summary>
                      <ul className="os-tree-children">
                        {list.map((app) => (
                          <li key={`${app.role}-${app.name}`} className="os-tree-item">
                            <AppRow app={app} selected={selectedKey === `${app.role}-${app.name}`} onSelect={() => setSelectedKey(`${app.role}-${app.name}`)} />
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}

function AppRow({ app, selected, onSelect }: { app: AppEntry; selected: boolean; onSelect: () => void }) {
  const internal = app.url.startsWith("/");
  return (
    <a
      href={app.url}
      target={internal ? undefined : "_blank"}
      rel={internal ? undefined : "noopener noreferrer"}
      onClick={onSelect}
      className={`os-tree-row os-tree-file${selected ? " is-selected" : ""}`}
    >
      <File className="os-tree-icon" aria-hidden="true" />
      <span className="os-tree-name">{app.name}</span>
      <ArrowUpRight className="os-tree-external" aria-hidden="true" />
    </a>
  );
}
