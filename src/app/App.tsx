import { useCallback, useEffect, useMemo, useState } from "react";
import { APPS } from "./apps";
import { SocialQuad } from "./components/SocialQuad";
import {
  appKey,
  readHiddenApps,
  readIconOverrides,
  writeHiddenApps,
  writeIconOverrides,
  type IconOverrides,
} from "./iconOverrides";
import { applyTheme, readThemePref, resolveTheme, type ThemePref } from "./theme";
import { LogPanel } from "./os/LogPanel";
import { MenuLayer } from "./os/MenuLayer";
import { NowPanel } from "./os/NowPanel";
import { OsIntro } from "./os/OsIntro";
import { ProjectsPanel } from "./os/ProjectsPanel";
import { SettingsPanel } from "./os/SettingsPanel";
import { SystemHeader } from "./os/SystemHeader";
import { ToolsPanel } from "./os/ToolsPanel";
import { WorkflowBar } from "./os/WorkflowBar";
import { WorldLayer } from "./os/WorldLayer";

export default function App() {
  const [resolved, setResolved] = useState<"light" | "dark">("light");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [overrides, setOverrides] = useState<IconOverrides>({});
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    const initial = readThemePref();
    applyTheme(initial);
    setResolved(resolveTheme(initial));
    setOverrides(readIconOverrides());
    setHidden(readHiddenApps());

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const entered = sessionStorage.getItem("meyra-os-entered") === "1";
    if (reduced || entered) setReady(true);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readThemePref() === "system") {
        applyTheme("system");
        setResolved(resolveTheme("system"));
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const locked = !ready || menuOpen || settingsOpen;

  useEffect(() => {
    document.body.classList.toggle("os-locked", locked);
    return () => document.body.classList.remove("os-locked");
  }, [locked]);

  const enter = useCallback(() => {
    sessionStorage.setItem("meyra-os-entered", "1");
    document.documentElement.dataset.entered = "1";
    setReady(true);
  }, []);

  const setTheme = (next: ThemePref) => {
    applyTheme(next);
    setResolved(resolveTheme(next));
  };

  const visibleApps = useMemo(
    () => APPS.filter((app) => !hidden.includes(appKey(app.name, app.role))),
    [hidden],
  );

  const toggleHidden = (key: string, hide: boolean) => {
    setHidden((prev) => {
      const next = hide ? Array.from(new Set([...prev, key])) : prev.filter((k) => k !== key);
      writeHiddenApps(next);
      return next;
    });
  };

  const setOverride = (key: string, src?: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (src) next[key] = src;
      else delete next[key];
      writeIconOverrides(next);
      return next;
    });
  };

  const status = menuOpen
    ? "Menu"
    : settingsOpen
      ? "Working"
      : "System ready";

  return (
    <div className="os-world min-h-dvh w-full">
      <WorldLayer />
      {!ready ? <OsIntro onEnter={enter} /> : null}

      <SystemHeader
        resolved={resolved}
        status={status}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen((v) => !v)}
        onTheme={setTheme}
        onSettings={() => setSettingsOpen(true)}
      />

      <main className="os-stage">
        <NowPanel />

        <div className="os-band-flow">
          <hr className="os-rule os-rule-draw" />
          <div className="py-5 sm:py-6">
            <WorkflowBar />
          </div>
          <hr className="os-rule os-rule-draw" />
        </div>

        <div className="os-band-projects">
          <ProjectsPanel />
        </div>

        <div className="os-band-tools">
          <ToolsPanel
            apps={visibleApps}
            overrides={overrides}
            open={toolsOpen}
            onToggle={() => setToolsOpen((v) => !v)}
          />
        </div>

        <div className="os-band-log">
          <LogPanel />
        </div>
      </main>

      <SocialQuad />

      <MenuLayer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {settingsOpen ? (
        <SettingsPanel
          overrides={overrides}
          hidden={hidden}
          onClose={() => setSettingsOpen(false)}
          onSet={setOverride}
          onToggleHidden={toggleHidden}
          onImport={(next) => {
            writeIconOverrides(next.overrides);
            writeHiddenApps(next.hidden);
            setOverrides(next.overrides);
            setHidden(next.hidden);
          }}
        />
      ) : null}
    </div>
  );
}
