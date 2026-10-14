import { useEffect, useMemo, useState } from "react";
import { APPS } from "./apps";
import { appKey, readHiddenApps, readIconOverrides, writeHiddenApps, writeIconOverrides, type IconOverrides } from "./iconOverrides";
import { applyTheme, readThemePref, resolveTheme, type ThemePref } from "./theme";
import { Desktop } from "./meyra/desktop";
import { WorkbenchContext } from "./meyra/panels";
import { SettingsPanel } from "./os/SettingsPanel";

export default function App() {
  const [resolved, setResolved] = useState<"light" | "dark">("light");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [overrides, setOverrides] = useState<IconOverrides>({});
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    const initial = readThemePref();
    applyTheme(initial);
    setResolved(resolveTheme(initial));
    setOverrides(readIconOverrides());
    setHidden(readHiddenApps());
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

  const visibleApps = useMemo(() => APPS.filter(app => !hidden.includes(appKey(app.name, app.role))), [hidden]);
  const context = useMemo(() => ({ apps: visibleApps, overrides }), [visibleApps, overrides]);
  const setTheme = (next: ThemePref) => {
    applyTheme(next);
    setResolved(resolveTheme(next));
  };

  return (
    <WorkbenchContext.Provider value={context}>
      <Desktop dark={resolved === "dark"} onTheme={() => setTheme(resolved === "dark" ? "light" : "dark")} onSettings={() => setSettingsOpen(true)} />
      {settingsOpen ? <SettingsPanel
        overrides={overrides}
        hidden={hidden}
        onClose={() => setSettingsOpen(false)}
        onSet={(key, src) => setOverrides(prev => {
          const next = { ...prev };
          if (src) next[key] = src; else delete next[key];
          writeIconOverrides(next);
          return next;
        })}
        onToggleHidden={(key, hide) => setHidden(prev => {
          const next = hide ? Array.from(new Set([...prev, key])) : prev.filter(item => item !== key);
          writeHiddenApps(next);
          return next;
        })}
        onImport={next => {
          writeIconOverrides(next.overrides);
          writeHiddenApps(next.hidden);
          setOverrides(next.overrides);
          setHidden(next.hidden);
        }}
      /> : null}
    </WorkbenchContext.Provider>
  );
}
