import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Moon, Sun, Monitor, X, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { APPS, ROLE_LABELS, type AppEntry, type AppRole } from './apps';
import { applyTheme, readThemePref, type ThemePref } from './theme';
import { BrandIcon } from './BrandIcon';
import { appKey, makeBackup, parseBackup, readHiddenApps, readIconOverrides, writeHiddenApps, writeIconOverrides, type IconOverrides } from './iconOverrides';
import { MEYRA_AVATAR } from './avatar';
import { APP_IMAGES } from './brandImages';
import { SocialQuad } from './components/SocialQuad';

const THEME_OPTIONS: Array<{ id: ThemePref; label: string; icon: typeof Sun }> = [
  { id: 'light', label: '浅', icon: Sun }, { id: 'dark', label: '深', icon: Moon }, { id: 'system', label: '系', icon: Monitor },
];
const FLOW = ['Think', 'Build', 'Deploy', 'Test', 'Validate'];

export default function App() {
  const [pref, setPref] = useState<ThemePref>('system');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [overrides, setOverrides] = useState<IconOverrides>({});
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    const initial = readThemePref(); setPref(initial); applyTheme(initial); setOverrides(readIconOverrides()); setHidden(readHiddenApps());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (readThemePref() === 'system') applyTheme('system'); };
    mq.addEventListener('change', onChange); return () => mq.removeEventListener('change', onChange);
  }, []);

  const visibleApps = useMemo(() => APPS.filter((app) => !hidden.includes(appKey(app.name, app.role))), [hidden]);
  const byRole = (role: AppRole) => visibleApps.filter((app) => app.role === role);
  const toggleHidden = (key: string, hide: boolean) => { setHidden((prev) => { const next = hide ? Array.from(new Set([...prev, key])) : prev.filter((k) => k !== key); writeHiddenApps(next); return next; }); };
  const setOverride = (key: string, src?: string) => { setOverrides((prev) => { const next = { ...prev }; if (src) next[key] = src; else delete next[key]; writeIconOverrides(next); return next; }); };

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)', borderColor: 'var(--line)' }}>
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-5 md:px-8">
          <div className="flex items-center gap-2.5"><img src={MEYRA_AVATAR} alt="" className="h-7 w-7 rounded-full object-cover" /><div className="flex items-baseline gap-2"><span className="text-[13px] font-semibold tracking-[0.08em]">MEYRA</span><span className="os-label text-[8px]" style={{ color: 'var(--dim)' }}>OS / WORKBENCH</span></div></div>
          <div className="flex items-center gap-1.5">
            <div className="flex rounded-sm p-0.5" style={{ background: 'var(--chip)', border: '1px solid var(--line)' }} role="radiogroup" aria-label="主题">{THEME_OPTIONS.map((opt) => { const Icon = opt.icon; const on = pref === opt.id; return <button key={opt.id} type="button" role="radio" aria-checked={on} aria-label={opt.label} title={opt.label} onClick={() => { setPref(opt.id); applyTheme(opt.id); }} className="flex h-7 w-7 items-center justify-center rounded-sm" style={{ background: on ? 'var(--chip-on)' : 'transparent', color: on ? 'var(--chip-on-text)' : 'var(--mute)' }}><Icon className="h-3 w-3" /></button>; })}</div>
            <button type="button" aria-label="设置" title="设置" onClick={() => setSettingsOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-sm" style={{ background: 'var(--chip)', border: '1px solid var(--line)', color: 'var(--mute)' }}><Settings2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 sm:px-5 sm:pt-10 md:px-8 md:pt-14">
        <section className="meyra-os meyra-grid-bg p-5 sm:p-7 md:p-9">
          <div className="relative z-10 flex flex-col gap-7">
            <div className="flex items-start justify-between gap-6"><div><p className="os-label mb-3 text-[9px] font-semibold uppercase" style={{ color: 'var(--dim)' }}>MEYRA OS / PERSONAL WORKBENCH</p><div className="flex flex-wrap items-baseline gap-3"><h1 className="text-[42px] font-medium tracking-[-0.06em] sm:text-[52px] md:text-[68px]">MEYRA</h1><span className="os-status">SYSTEM READY</span></div><p className="mt-2 max-w-xl text-xs leading-6" style={{ color: 'var(--mute)' }}>A focused workspace for building, designing, testing, and collecting the tools that matter.</p></div><span className="os-status hidden shrink-0 sm:block">MEM 64K · USER 01</span></div>
            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-end sm:justify-between" style={{ borderColor: 'var(--line)' }}><div><p className="os-label text-[9px]" style={{ color: 'var(--dim)' }}>CURRENT PROJECT</p><div className="mt-1 flex items-baseline gap-3"><span className="text-xl font-medium">InkPai</span><span className="os-status">× 1 user</span></div></div><a href="https://inkpai.hongmeichen1219.workers.dev" target="_blank" rel="noopener noreferrer" className="group inline-flex w-fit items-center gap-1.5 rounded-sm px-3.5 py-2 text-[11px] font-medium" style={{ background: 'var(--chip-on)', color: 'var(--chip-on-text)' }}>OPEN PROJECT <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a></div>
            <div className="border-y py-3" style={{ borderColor: 'var(--line)' }}><div className="grid grid-cols-5 gap-1 sm:flex sm:items-center">{FLOW.map((step, index) => <div key={step} className="flex min-w-0 items-center sm:flex-1"><div className="flex min-w-0 items-center gap-1.5"><span className="os-label text-[8px]" style={{ color: index === 0 ? 'var(--text)' : 'var(--dim)' }}>{String(index + 1).padStart(2, '0')}</span><span className="truncate text-[9px] font-medium sm:text-[10px]" style={{ color: index === 0 ? 'var(--text)' : 'var(--mute)' }}>{step}</span></div>{index < FLOW.length - 1 ? <span className="mx-1 h-px flex-1 sm:mx-3" style={{ background: 'var(--line)' }} /> : null}</div>)}</div></div>
          </div>
        </section>

        <section className="mt-8 sm:mt-10"><RoleSection apps={byRole('now')} overrides={overrides} large /></section>
        <section className="mt-12 sm:mt-16">
          <button type="button" onClick={() => setMoreOpen((v) => !v)} className="group flex w-full items-center justify-between border-y py-3 text-left" style={{ borderColor: 'var(--line)' }}><span className="meyra-section-title text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--dim)' }}>SYSTEM / APPS</span><span className="os-label flex items-center gap-2 text-[9px]" style={{ color: 'var(--dim)' }}>{visibleApps.length - byRole('now').length} MODULES {moreOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}</span></button>
          {moreOpen ? <div className="mt-8 space-y-10 sm:space-y-12">{(['backup', 'explore', 'picPrompt', 'design', 'rest'] as AppRole[]).map((role) => <RoleSection key={role} title={ROLE_LABELS[role]} apps={byRole(role)} overrides={overrides} />)}</div> : null}
        </section>
      </main>
      <SocialQuad />
      {settingsOpen ? <SettingsPanel overrides={overrides} hidden={hidden} onClose={() => setSettingsOpen(false)} onSet={setOverride} onToggleHidden={toggleHidden} onImport={(next) => { writeIconOverrides(next.overrides); writeHiddenApps(next.hidden); setOverrides(next.overrides); setHidden(next.hidden); }} /> : null}
    </div>
  );
}

function AppMark({ app, customSrc }: { app: AppEntry; customSrc?: string }) { const src = app.name === '公众号' ? APP_IMAGES['公众号'] : (app.name === 'InkPai (Admin)' ? APP_IMAGES['InkPai'] : (customSrc || APP_IMAGES[app.name])); if (src) return <img src={src} alt="" className="h-5 w-5 object-contain" />; return <BrandIcon id={app.icon} className="h-5 w-5" />; }

function RoleSection({ title, apps, overrides, large = false }: { title?: string; apps: AppEntry[]; overrides: IconOverrides; large?: boolean }) { if (!apps.length) return null; return <div>{title ? <div className="mb-4 flex items-center gap-2"><h2 className="meyra-section-title text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--mute)' }}>{title}</h2><span className="os-label text-[9px]" style={{ color: 'var(--dim)' }}>{String(apps.length).padStart(2, '0')}</span></div> : null}<div className={large ? 'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-6' : 'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4'}>{apps.map((app) => <AppCard key={`${app.role}-${app.name}`} app={app} customSrc={overrides[appKey(app.name, app.role)]} large={large} />)}</div></div>; }

function AppCard({ app, customSrc, large }: { app: AppEntry; customSrc?: string; large?: boolean }) { return <a href={app.url} target={app.url.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="meyra-app-card group flex min-w-0 items-center gap-2.5 px-3 transition-colors" style={{ minHeight: large ? 64 : 50, background: 'var(--bg-elev)', border: '1px solid var(--line)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--line-strong)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.borderColor = 'var(--line)'; }}><span className="meyra-app-icon flex h-8 w-8 shrink-0 items-center justify-center" style={{ background: 'var(--chip)' }}><AppMark app={app} customSrc={customSrc} /></span><span className="min-w-0 flex-1 truncate text-[12px] font-medium">{app.name}</span><span className="os-label hidden text-[7px] sm:block" style={{ color: 'var(--dim)' }}>{app.role.toUpperCase()}</span><ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-45" style={{ color: 'var(--mute)' }} /></a>; }

function SettingsPanel({ overrides, hidden, onClose, onSet, onToggleHidden, onImport }: { overrides: IconOverrides; hidden: string[]; onClose: () => void; onSet: (key: string, src?: string) => void; onToggleHidden: (key: string, hide: boolean) => void; onImport: (next: { overrides: IconOverrides; hidden: string[] }) => void }) {
  return <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-labelledby="settings-title"><button type="button" className="absolute inset-0" aria-label="关闭设置" onClick={onClose} style={{ background: 'rgba(0,0,0,.36)' }} /><aside className="relative z-10 ml-auto flex h-full w-full max-w-md flex-col" style={{ background: 'var(--bg-elev)', borderLeft: '1px solid var(--line)' }}><div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--line)' }}><h2 id="settings-title" className="os-label text-sm font-medium">SYSTEM SETTINGS</h2><button type="button" aria-label="关闭" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-sm" style={{ background: 'var(--chip)' }}><X className="h-4 w-4" /></button></div><div className="flex-1 overflow-y-auto px-5 py-4"><div className="mb-6 flex gap-2"><button type="button" className="os-label rounded-sm px-3 py-2 text-[10px]" style={{ background: 'var(--chip)', border: '1px solid var(--line)' }} onClick={() => { const blob = new Blob([JSON.stringify(makeBackup(overrides, hidden))], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'meyra-workbench.json'; a.click(); URL.revokeObjectURL(url); }}>EXPORT</button><label className="os-label cursor-pointer rounded-sm px-3 py-2 text-[10px]" style={{ background: 'var(--chip)', border: '1px solid var(--line)' }}>IMPORT<input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === 'string') { const parsed = parseBackup(reader.result); if (parsed) onImport(parsed); } }; reader.readAsText(file); e.target.value = ''; }} /></label></div>{(['now', 'backup', 'explore', 'picPrompt', 'design', 'rest'] as AppRole[]).map((role) => <section key={role} className="mb-7"><h3 className="meyra-section-title mb-2 text-[9px] font-medium uppercase tracking-[0.14em]" style={{ color: 'var(--mute)' }}>{ROLE_LABELS[role]}</h3><div className="space-y-2">{APPS.filter((app) => app.role === role).map((app) => { const key = appKey(app.name, app.role); const customSrc = overrides[key]; const isHidden = hidden.includes(key); return <div key={key} className="flex items-center gap-3 rounded-sm px-3 py-2" style={{ background: 'var(--chip)', opacity: isHidden ? .45 : 1 }}><span className="meyra-app-icon flex h-8 w-8 items-center justify-center" style={{ background: 'var(--bg-elev)' }}><AppMark app={app} customSrc={customSrc} /></span><p className="min-w-0 flex-1 truncate text-sm">{app.name}</p>{customSrc && !isHidden ? <button type="button" className="text-xs" style={{ color: 'var(--mute)' }} onClick={() => onSet(key)}>Reset</button> : null}<button type="button" className="rounded-sm px-2.5 py-1 text-xs" style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)' }} onClick={() => onToggleHidden(key, !isHidden)}>{isHidden ? 'Show' : 'Hide'}</button></div>; })}</div></section>)}</div></aside></div>;
}
