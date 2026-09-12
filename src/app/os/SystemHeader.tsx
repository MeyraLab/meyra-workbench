import { Menu, Settings2, X } from "lucide-react";
import { MEYRA_AVATAR } from "../avatar";
import type { ThemePref } from "../theme";

type Props = {
  resolved: "light" | "dark";
  status: string;
  menuOpen: boolean;
  onMenu: () => void;
  onTheme: (pref: ThemePref) => void;
  onSettings: () => void;
};

export function SystemHeader({
  resolved,
  status,
  menuOpen,
  onMenu,
  onTheme,
  onSettings,
}: Props) {
  return (
    <header className="os-header">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={onMenu}
            className="os-label flex h-11 items-center gap-2 px-1"
            style={{ color: "var(--text)" }}
          >
            <span className="os-icon-swap" aria-hidden="true">
              <Menu className={menuOpen ? "is-off" : "is-on"} />
              <X className={menuOpen ? "is-on" : "is-off"} />
            </span>
            <span className="hidden sm:inline">{menuOpen ? "Close" : "Menu"}</span>
          </button>
          <span className="text-line hidden h-4 w-px sm:block" style={{ background: "var(--line)" }} />
          <div className="flex min-w-0 items-center gap-2">
            <img src={MEYRA_AVATAR} alt="" className="h-5 w-5 shrink-0" />
            <p className="os-label truncate" style={{ color: "var(--text)" }}>
              <span className="sm:hidden">MEYRA</span>
              <span className="hidden sm:inline">MEYRA OS</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="os-status is-live hidden md:inline">{status}</span>
          <div className="flex" role="radiogroup" aria-label="Day or night">
            <button
              type="button"
              role="radio"
              aria-checked={resolved === "light"}
              onClick={() => onTheme("light")}
              className="os-label min-h-11 px-2.5"
              style={{
                color: resolved === "light" ? "var(--text)" : "var(--dim)",
                boxShadow: resolved === "light" ? "inset 0 -1px 0 var(--system)" : "none",
              }}
            >
              Day
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={resolved === "dark"}
              onClick={() => onTheme("dark")}
              className="os-label min-h-11 px-2.5"
              style={{
                color: resolved === "dark" ? "var(--text)" : "var(--dim)",
                boxShadow: resolved === "dark" ? "inset 0 -1px 0 var(--system)" : "none",
              }}
            >
              Night
            </button>
          </div>
          <button
            type="button"
            aria-label="Settings"
            title="Settings"
            onClick={onSettings}
            className="flex h-11 w-11 items-center justify-center"
            style={{ color: "var(--mute)" }}
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
