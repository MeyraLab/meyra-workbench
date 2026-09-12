import { Menu, Moon, Settings2, Sun, X } from "lucide-react";
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
            className="os-hud-chip"
          >
            <span className="os-icon-swap" aria-hidden="true">
              <Menu className={menuOpen ? "is-off" : "is-on"} />
              <X className={menuOpen ? "is-on" : "is-off"} />
            </span>
            <span className="hidden sm:inline">{menuOpen ? "Close" : "Menu"}</span>
          </button>
          <div className="flex min-w-0 items-center gap-2 pl-1">
            <img src={MEYRA_AVATAR} alt="" className="h-5 w-5 shrink-0" />
            <p className="os-brand truncate">
              <span className="sm:hidden">MEYRA</span>
              <span className="hidden sm:inline">MEYRA OS</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="os-status is-live hidden md:inline pr-1">{status}</span>
          <button
            type="button"
            className="os-hud-icon"
            aria-label={resolved === "light" ? "Switch to night" : "Switch to day"}
            title={resolved === "light" ? "Night" : "Day"}
            onClick={() => onTheme(resolved === "light" ? "dark" : "light")}
          >
            {resolved === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            aria-label="Settings"
            title="Settings"
            onClick={onSettings}
            className="os-hud-icon"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
