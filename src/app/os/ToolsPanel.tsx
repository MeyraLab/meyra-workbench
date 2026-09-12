import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { ROLE_LABELS, ROLES, type AppEntry, type AppRole } from "../apps";
import { appKey, type IconOverrides } from "../iconOverrides";
import { AppMark } from "./AppMark";

type Props = {
  apps: AppEntry[];
  overrides: IconOverrides;
  open: boolean;
  onToggle: () => void;
};

export function ToolsPanel({ apps, overrides, open, onToggle }: Props) {
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
          <div className="os-tools-list">
            {ROLES.map((role) => {
              const list = byRole(role);
              if (!list.length) return null;
              return (
                <div key={role} className="os-tool-group">
                  <div className="mb-4 flex items-center gap-2">
                    <h2 className="os-label">{ROLE_LABELS[role]}</h2>
                    <span className="os-status">{String(list.length).padStart(2, "0")}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((app) => (
                      <AppRow
                        key={`${app.role}-${app.name}`}
                        app={app}
                        customSrc={overrides[appKey(app.name, app.role)]}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AppRow({ app, customSrc }: { app: AppEntry; customSrc?: string }) {
  const internal = app.url.startsWith("/");
  return (
    <a
      href={app.url}
      target={internal ? undefined : "_blank"}
      rel={internal ? undefined : "noopener noreferrer"}
      className="os-app-card group"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        <AppMark app={app} customSrc={customSrc} />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{app.name}</span>
      <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-70" />
    </a>
  );
}
