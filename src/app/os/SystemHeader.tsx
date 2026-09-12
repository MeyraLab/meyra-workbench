import { Menu, Moon, Settings2, Sun, X } from "lucide-react";
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
      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="meyra-menu"
        onClick={onMenu}
        className="os-hud-pill"
      >
        <span className="os-icon-swap" aria-hidden="true">
          <Menu className={menuOpen ? "is-off" : "is-on"} />
          <X className={menuOpen ? "is-on" : "is-off"} />
        </span>
        {menuOpen ? "Close" : "Menu"}
      </button>

      <div className="os-hud-right">
        <span className="os-hud-status">{status}</span>
        <button
          type="button"
          className="os-hud-round"
          aria-label={resolved === "light" ? "Switch to night" : "Switch to day"}
          aria-pressed={resolved === "dark"}
          onClick={() => onTheme(resolved === "light" ? "dark" : "light")}
        >
          {resolved === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button type="button" aria-label="Settings" onClick={onSettings} className="os-hud-round">
          <Settings2 className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
