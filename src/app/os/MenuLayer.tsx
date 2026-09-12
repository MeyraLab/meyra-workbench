import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const ITEMS = [
  { id: "now", label: "Now" },
  { id: "projects", label: "Projects" },
  { id: "tools", label: "Tools" },
  { id: "log", label: "Log" },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MenuLayer({ open, onClose }: Props) {
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
      document.querySelector<HTMLButtonElement>("header .os-hud-pill")?.focus();
    }, 220);
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
    onClose();
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  };

  return (
    <div
      id="meyra-menu"
      className={`os-menu${leaving ? " is-leave" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
    >
      <button type="button" className="os-overlay-scrim" aria-label="Close menu" onClick={onClose} />
      <aside className="os-menu-panel">
        <div className="os-menu-top">
          <button type="button" onClick={onClose} className="os-hud-pill" aria-label="Close">
            <X className="h-4 w-4" />
            Close
          </button>
          <p id="menu-title" className="os-brand-mark">MEYRA</p>
        </div>
        <nav className="os-menu-nav" aria-label="Workspace">
          {ITEMS.map((item, i) => (
            <button
              key={item.id}
              ref={i === 0 ? first : undefined}
              type="button"
              onClick={() => go(item.id)}
              className="os-menu-chip"
              style={{ animationDelay: leaving ? "0ms" : `${40 + i * 40}ms` }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
}
