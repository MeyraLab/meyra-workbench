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
      <div className="os-header-inner">
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
          <span className="hidden h-4 w-px sm:block" style={{ background: "var(--line)" }} />
          <div className="flex min-w-0 items-center gap-2">
            <img src={MEYRA_AVATAR} alt="" className="h-5 w-5 shrink-0" />
            <p className="os-brand truncate">
              <span className="sm:hidden">MEYRA</span>
              <span className="hidden sm:inline">MEYRA OS</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <span className="os-status is-live hidden md:inline">{status}</span>
          <div className="flex" role="radiogroup" aria-label="Day or night">
            <button
              type="button"
              role="radio"
              aria-checked={resolved === "light"}
              onClick={() => onTheme("light")}
              className={`os-theme-btn${resolved === "light" ? " is-on" : ""}`}
            >
              Day
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={resolved === "dark"}
              onClick={() => onTheme("dark")}
              className={`os-theme-btn${resolved === "dark" ? " is-on" : ""}`}
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
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
