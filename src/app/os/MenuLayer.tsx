import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const ITEMS = [
  { id: "now", label: "Now" },
  { id: "projects", label: "Projects" },
  { id: "tools", label: "Tools" },
  { id: "log", label: "Log" },
  { id: "archive", label: "Archive" },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  onArchive: () => void;
};

export function MenuLayer({ open, onClose, onArchive }: Props) {
  const [shown, setShown] = useState(open);
  const [leaving, setLeaving] = useState(false);
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setShown(true);
      setLeaving(false);
      return;
    }
    if (!shown) return;
    setLeaving(true);
    const t = window.setTimeout(() => {
      setShown(false);
      setLeaving(false);
    }, 180);
    return () => window.clearTimeout(t);
  }, [open, shown]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && shown && !leaving) first.current?.focus();
  }, [open, shown, leaving]);

  if (!shown) return null;

  const go = (id: string) => {
    if (id === "archive") {
      onArchive();
      onClose();
      return;
    }
    onClose();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`os-menu${leaving ? " is-leave" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
    >
      <button type="button" className="os-overlay-scrim" aria-label="Close menu" onClick={onClose} />
      <aside className="os-menu-panel">
        <div className="flex items-center justify-between px-6 py-5">
          <p id="menu-title" className="os-label">
            Menu
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-1 px-6 pb-16" aria-label="Workspace">
          {ITEMS.map((item, i) => (
            <button
              key={item.id}
              ref={i === 0 ? first : undefined}
              type="button"
              onClick={() => go(item.id)}
              className="os-menu-item"
              style={{ animationDelay: leaving ? "0ms" : `${60 + i * 45}ms` }}
            >
              <span className="os-label">{String(i + 1).padStart(2, "0")}</span>
              <span className="os-display">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
}
