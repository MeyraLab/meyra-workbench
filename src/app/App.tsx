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
import { ArchivePanel } from "./os/ArchivePanel";
import { LogPanel } from "./os/LogPanel";
import { MenuLayer } from "./os/MenuLayer";
import { NowPanel } from "./os/NowPanel";
import { OsIntro } from "./os/OsIntro";
import { ProjectsPanel } from "./os/ProjectsPanel";
import { SettingsPanel } from "./os/SettingsPanel";
import { SystemHeader } from "./os/SystemHeader";
import { ToolsPanel } from "./os/ToolsPanel";
import { WorkflowBar } from "./os/WorkflowBar";

export default function App() {
  const [resolved, setResolved] = useState<"light" | "dark">("light");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
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

  const locked = !ready || menuOpen || settingsOpen || archiveOpen;

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

  const status = archiveOpen
    ? "Archive"
    : menuOpen
      ? "Menu"
      : settingsOpen
        ? "Working"
        : "System ready";

  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-canvas text-ink">
      {!ready ? <OsIntro onEnter={enter} /> : null}

      <SystemHeader
        resolved={resolved}
        status={status}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen((v) => !v)}
        onTheme={setTheme}
        onSettings={() => setSettingsOpen(true)}
      />

      <main className="mx-auto w-full max-w-6xl px-5 pb-40 pt-4 sm:px-10 sm:pt-8 lg:px-12">
        <NowPanel />

        <div className="mt-10 sm:mt-16">
          <hr className="os-rule os-rule-draw" />
          <div className="py-5 sm:py-6">
            <WorkflowBar />
          </div>
          <hr className="os-rule os-rule-draw" />
        </div>

        <div className="mt-14 sm:mt-20">
          <ProjectsPanel />
        </div>

        <div className="mt-20 sm:mt-32">
          <ToolsPanel
            apps={visibleApps}
            overrides={overrides}
            open={toolsOpen}
            onToggle={() => setToolsOpen((v) => !v)}
          />
        </div>

        <div className="mt-20 sm:mt-32">
          <LogPanel />
        </div>

        <section id="archive" className="mt-24 border-t border-line pt-12 sm:mt-36">
          <p className="os-label">05 — Archive</p>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="os-display text-3xl sm:text-4xl">Inbox / Core / Output</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">
                Compost lives behind the workspace.
              </p>
            </div>
            <button type="button" className="os-btn os-btn-ghost w-full sm:w-auto" onClick={() => setArchiveOpen(true)}>
              Open archive
            </button>
          </div>
        </section>
      </main>

      <SocialQuad />

      <MenuLayer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onArchive={() => setArchiveOpen(true)}
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

      {archiveOpen ? <ArchivePanel onClose={() => setArchiveOpen(false)} /> : null}
    </div>
  );
}
