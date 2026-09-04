import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Moon, Sun, Monitor, X, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { APPS, ROLE_LABELS, type AppEntry, type AppRole } from './apps';
import { applyTheme, readThemePref, type ThemePref } from './theme';
import { BrandIcon } from './BrandIcon';
import { appKey, makeBackup, parseBackup, readHiddenApps, readIconOverrides, writeHiddenApps, writeIconOverrides, type IconOverrides } from './iconOverrides';
import { MEYRA_AVATAR } from './avatar';
import { APP_IMAGES } from './brandImages';

const THEME_OPTIONS: Array<{ id: ThemePref; label: string; icon: typeof Sun }> = [
  { id: 'light', label: '浅', icon: Sun },
  { id: 'dark', label: '深', icon: Moon },
  { id: 'system', label: '系', icon: Monitor },
];

const FLOW = ['Think', 'Build', 'Deploy', 'Test', 'Validate'];

export default function App() {
  const [pref, setPref] = useState<ThemePref>('system');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [overrides, setOverrides] = useState<IconOverrides>({});
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    const initial = readThemePref();
    setPref(initial);
    applyTheme(initial);
    setOverrides(readIconOverrides());
    setHidden(readHiddenApps());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (readThemePref() === 'system') applyTheme('system'); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const visibleApps = useMemo(() => APPS.filter((app) => !hidden.includes(appKey(app.name, app.role))), [hidden]);
  const byRole = (role: AppRole) => visibleApps.filter((app) => app.role === role);

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
      if (src) next[key] = src; else delete next[key];
      writeIconOverrides(next);
      return next;
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{ background: 'color-mix(in srgb, var(--bg) 90%, transparent)', borderColor: 'var(--line)' }}>
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-2.5">
            <img src={MEYRA_AVATAR} alt="" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-[13px] font-semibold tracking-[0.08em]">MEYRA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex rounded-full p-0.5" style={{ background: 'var(--chip)', border: '1px solid var(--line)' }} role="radiogroup" aria-label="主题">
              {THEME_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const on = pref === opt.id;
                return <button key={opt.id} type="button" role="radio" aria-checked={on} aria-label={opt.label} title={opt.label} onClick={() => { setPref(opt.id); applyTheme(opt.id); }} className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: on ? 'var(--chip-on)' : 'transparent', color: on ? 'var(--chip-on-text)' : 'var(--mute)' }}><Icon className="h-3 w-3" /></button>;
              })}
            </div>
            <button type="button" aria-label="设置" title="设置" onClick={() => setSettingsOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--chip)', border: '1px solid var(--line)', color: 'var(--mute)' }}><Settings2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-12 md:px-8 md:pt-20">
        <section>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--dim)' }}>NOW</p>
              <div className="flex items-baseline gap-3">
                <h1 className="text-[42px] font-medium tracking-[-0.055em] md:text-[64px]">InkPai</h1>
                <span className="text-sm" style={{ color: 'var(--dim)' }}>× 1 user</span>
              </div>
            </div>
            <a href="https://inkpai.lovable.app" target="_blank" rel="noopener noreferrer" className="group inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium" style={{ background: 'var(--chip-on)', color: 'var(--chip-on-text)' }}>
              Open <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="mt-9 border-y py-4" style={{ borderColor: 'var(--line)' }}>
            <div className="flex min-w-[560px] items-center">
              {FLOW.map((step, index) => (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px]" style={{ color: index === 0 ? 'var(--text)' : 'var(--dim)' }}>{index + 1}</span>
                    <span className="text-[11px] font-medium" style={{ color: index === 0 ? 'var(--text)' : 'var(--mute)' }}>{step}</span>
                  </div>
                  {index < FLOW.length - 1 ? <span className="mx-3 h-px flex-1" style={{ background: 'var(--line)' }} /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <RoleSection apps={byRole('now')} overrides={overrides} large />
        </section>

        <section className="mt-16">
          <button type="button" onClick={() => setMoreOpen((v) => !v)} className="group flex w-full items-center justify-between border-b pb-3 text-left" style={{ borderColor: 'var(--line)' }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--dim)' }}>Everything</span>
            <span className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--dim)' }}>
              {visibleApps.length - byRole('now').length}
              {moreOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </span>
          </button>
          {moreOpen ? (
            <div className="mt-8 space-y-12">
              {(['backup', 'explore', 'rest'] as AppRole[]).map((role) => <RoleSection key={role} title={ROLE_LABELS[role]} apps={byRole(role)} overrides={overrides} />)}
            </div>
          ) : null}
        </section>
      </main>

      {settingsOpen ? <SettingsPanel overrides={overrides} hidden={hidden} onClose={() => setSettingsOpen(false)} onSet={setOverride} onToggleHidden={toggleHidden} onImport={(next) => { writeIconOverrides(next.overrides); writeHiddenApps(next.hidden); setOverrides(next.overrides); setHidden(next.hidden); }} /> : null}
    </div>
  );
}

function AppMark({ app, customSrc }: { app: AppEntry; customSrc?: string }) {
  const src = customSrc || APP_IMAGES[app.name];
  if (src) return <img src={src} alt="" className="h-5 w-5 object-contain" />;
  return <BrandIcon id={app.icon} className="h-5 w-5" />;
}

function RoleSection({ title, apps, overrides, large = false }: { title?: string; apps: AppEntry[]; overrides: IconOverrides; large?: boolean }) {
  if (!apps.length) return null;
  return (
    <div>
      {title ? <div className="mb-4 flex items-center gap-2"><h2 className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--mute)' }}>{title}</h2><span className="text-[10px]" style={{ color: 'var(--dim)' }}>{apps.length}</span></div> : null}
      <div className={large ? 'grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'}>
        {apps.map((app) => <AppCard key={`${app.role}-${app.name}`} app={app} customSrc={overrides[appKey(app.name, app.role)]} large={large} />)}
      </div>
    </div>
  );
}

function AppCard({ app, customSrc, large }: { app: AppEntry; customSrc?: string; large?: boolean }) {
  return (
    <a href={app.url} target={app.url.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="group flex items-center gap-2.5 rounded-xl px-3 transition-colors" style={{ minHeight: large ? 64 : 50, background: 'var(--bg-elev)', border: '1px solid var(--line)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--line-strong)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.borderColor = 'var(--line)'; }}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: 'var(--chip)' }}><AppMark app={app} customSrc={customSrc} /></span>
      <span className="min-w-0 flex-1 truncate text-[12px] font-medium">{app.name}</span>
      <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-45" style={{ color: 'var(--mute)' }} />
    </a>
  );
}

function SettingsPanel({ overrides, hidden, onClose, onSet, onToggleHidden, onImport }: { overrides: IconOverrides; hidden: string[]; onClose: () => void; onSet: (key: string, src?: string) => void; onToggleHidden: (key: string, hide: boolean) => void; onImport: (next: { overrides: IconOverrides; hidden: string[] }) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <button type="button" className="absolute inset-0" aria-label="关闭设置" onClick={onClose} style={{ background: 'rgba(0,0,0,.36)' }} />
      <aside className="relative z-10 ml-auto flex h-full w-full max-w-md flex-col" style={{ background: 'var(--bg-elev)', borderLeft: '1px solid var(--line)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--line)' }}><h2 id="settings-title" className="text-sm font-medium">Settings</h2><button type="button" aria-label="关闭" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'var(--chip)' }}><X className="h-4 w-4" /></button></div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-6 flex gap-2"><button type="button" className="rounded-full px-3 py-2 text-xs" style={{ background: 'var(--chip)', border: '1px solid var(--line)' }} onClick={() => { const blob = new Blob([JSON.stringify(makeBackup(overrides, hidden))], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'meyra-workbench.json'; a.click(); URL.revokeObjectURL(url); }}>Export</button><label className="cursor-pointer rounded-full px-3 py-2 text-xs" style={{ background: 'var(--chip)', border: '1px solid var(--line)' }}>Import<input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === 'string') { const parsed = parseBackup(reader.result); if (parsed) onImport(parsed); } }; reader.readAsText(file); e.target.value = ''; }} /></label></div>
          {(['now', 'backup', 'explore', 'rest'] as AppRole[]).map((role) => <section key={role} className="mb-7"><h3 className="mb-2 text-xs font-medium uppercase tracking-[0.14em]" style={{ color: 'var(--mute)' }}>{ROLE_LABELS[role]}</h3><div className="space-y-2">{APPS.filter((app) => app.role === role).map((app) => { const key = appKey(app.name, app.role); const customSrc = overrides[key]; const isHidden = hidden.includes(key); return <div key={key} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: 'var(--chip)', opacity: isHidden ? .45 : 1 }}><span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--bg-elev)' }}><AppMark app={app} customSrc={customSrc} /></span><p className="min-w-0 flex-1 truncate text-sm">{app.name}</p>{customSrc && !isHidden ? <button type="button" className="text-xs" style={{ color: 'var(--mute)' }} onClick={() => onSet(key)}>Reset</button> : null}<button type="button" className="rounded-full px-2.5 py-1 text-xs" style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)' }} onClick={() => onToggleHidden(key, !isHidden)}>{isHidden ? 'Show' : 'Hide'}</button></div>; })}</div></section>)}
        </div>
      </aside>
    </div>
  );
}
