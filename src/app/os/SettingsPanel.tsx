import { useEffect } from "react";
import { X } from "lucide-react";
import { APPS, ROLE_LABELS, ROLES, type AppRole } from "../apps";
import {
  appKey,
  makeBackup,
  parseBackup,
  type IconOverrides,
} from "../iconOverrides";
import { AppMark } from "./AppMark";

type Props = {
  overrides: IconOverrides;
  hidden: string[];
  onClose: () => void;
  onSet: (key: string, src?: string) => void;
  onToggleHidden: (key: string, hide: boolean) => void;
  onImport: (next: { overrides: IconOverrides; hidden: string[] }) => void;
};

export function SettingsPanel({
  overrides,
  hidden,
  onClose,
  onSet,
  onToggleHidden,
  onImport,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="os-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <button type="button" className="os-overlay-scrim" aria-label="Close settings" onClick={onClose} />
      <aside className="os-sheet">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="settings-title" className="os-label" style={{ color: "var(--text)" }}>
            System settings
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center"
            style={{ background: "var(--chip)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-6 flex gap-2">
            <button
              type="button"
              className="os-btn os-btn-ghost"
              onClick={() => {
                const blob = new Blob([JSON.stringify(makeBackup(overrides, hidden))], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "meyra-workbench.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export
            </button>
            <label className="os-btn os-btn-ghost cursor-pointer">
              Import
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") {
                      const parsed = parseBackup(reader.result);
                      if (parsed) onImport(parsed);
                    }
                  };
                  reader.readAsText(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {ROLES.map((role: AppRole) => (
            <section key={role} className="mb-7">
              <h3 className="os-label mb-2">{ROLE_LABELS[role]}</h3>
              <div className="space-y-2">
                {APPS.filter((app) => app.role === role).map((app) => {
                  const key = appKey(app.name, app.role);
                  const customSrc = overrides[key];
                  const isHidden = hidden.includes(key);
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 px-3 py-2"
                      style={{ background: "var(--chip)", opacity: isHidden ? 0.45 : 1 }}
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center"
                        style={{ background: "var(--bg-elev)" }}
                      >
                        <AppMark app={app} customSrc={customSrc} />
                      </span>
                      <p className="min-w-0 flex-1 truncate text-sm">{app.name}</p>
                      {customSrc && !isHidden ? (
                        <button type="button" className="text-xs text-mute" onClick={() => onSet(key)}>
                          Reset
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="min-h-11 px-2.5 text-xs"
                        style={{ background: "var(--bg-elev)", border: "1px solid var(--line)" }}
                        onClick={() => onToggleHidden(key, !isHidden)}
                      >
                        {isHidden ? "Show" : "Hide"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </div>
  );
}
