import { Menu, Settings2, X } from "lucide-react";
import type { ThemePref } from "../theme";
import { ThemeSwitch } from "./ThemeSwitch";

type Props = {
  resolved: "light" | "dark";
  beat: number;
  total: number;
  menuOpen: boolean;
  onMenu: () => void;
  onTheme: (pref: ThemePref) => void;
  onSettings: () => void;
};

export function SystemHeader({
  resolved,
  beat,
  total,
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
        <ThemeSwitch
          resolved={resolved}
          beat={beat}
          total={total}
          onTheme={() => onTheme(resolved === "light" ? "dark" : "light")}
        />
        <button type="button" aria-label="Settings" onClick={onSettings} className="os-hud-round">
          <Settings2 className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
