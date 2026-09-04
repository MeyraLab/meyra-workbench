import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Moon, Sun, Monitor, X } from 'lucide-react';
import { APPS, CATEGORIES, type AppCategory, type AppEntry } from './apps';
import { applyTheme, readThemePref, type ThemePref } from './theme';
import { BrandIcon } from './BrandIcon';
import { appKey, readHiddenApps, readIconOverrides, writeHiddenApps, writeIconOverrides, type IconOverrides } from './iconOverrides';
import { MEYRA_AVATAR } from './avatar';

const THEME_OPTIONS: Array<{ id: ThemePref; label: string; icon: typeof Sun }> = [
  { id: 'light', label: '浅色模式', icon: Sun },
  { id: 'dark', label: '深色模式', icon: Moon },
  { id: 'system', label: '系统模式', icon: Monitor },
];

export default function App() {
  const [pref, setPref] = useState<ThemePref>('system');
  const [folder, setFolder] = useState<'全部' | AppCategory>('全部');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [overrides, setOverrides] = useState<IconOverrides>({});
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    const initial = readThemePref();
    setPref(initial);
    applyTheme(initial);
    setOverrides(readIconOverrides());
    setHidden(readHiddenApps());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (readThemePref() === 'system') applyTheme('system');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const sections = useMemo(
    () => (folder === '全部' ? CATEGORIES : CATEGORIES.filter((c) => c === folder)),
    [folder],
  );

  const visibleApps = useMemo(
    () => APPS.filter((app) => !hidden.includes(appKey(app.name, app.category))),
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

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header className="sticky top-0 z-20 backdrop-blur-xl" style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)', borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <h1 className="text-[24px] font-medium tracking-tight md:text-[28px]">Meyra's 工作台</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full p-1" style={{ background: 'var(--chip)', border: '1px solid var(--line)' }} role="radiogroup" aria-label="主题">
              {THEME_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const on = pref === opt.id;
                return (
                  <button key={opt.id} type="button" role="radio" aria-checked={on} aria-label={opt.label} title={opt.label} onClick={() => { setPref(opt.id); applyTheme(opt.id); }} className="flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors duration-200" style={{ background: on ? 'var(--chip-on)' : 'transparent', color: on ? 'var(--chip-on-text)' : 'var(--mute)' }}>
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
            <button type="button" aria-label="Meyra 设置" title="设置" onClick={() => setSettingsOpen(true)} className="h-11 w-11 overflow-hidden rounded-full" style={{ border: '1px solid var(--line)' }}>
              <img src={MEYRA_AVATAR} alt="Meyra" className="h-full w-full object-cover" />
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-3 md:px-8" aria-label="分类">
          {(['全部', ...CATEGORIES] as const).map((cat) => {
            const on = folder === cat;
            return (
              <button key={cat} type="button" onClick={() => setFolder(cat)} className="shrink-0 rounded-full px-4 py-2 text-sm min-h-11 transition-colors duration-200" style={{ background: on ? 'var(--chip-on)' : 'var(--chip)', color: on ? 'var(--chip-on-text)' : 'var(--mute)', border: '1px solid var(--line)' }}>
                {cat}
              </button>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl space-y-10 px-5 py-8 md:px-8">
        {sections.map((cat) => {
          const cards = visibleApps.filter((app) => app.category === cat);
          if (cards.length === 0) return null;
          return (
            <section key={cat} id={cat}>
              <h2 className="mb-4 text-[15px] tracking-wide" style={{ color: 'var(--mute)' }}>{cat}</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cards.map((app) => (
                  <AppCard key={`${app.category}-${app.name}`} app={app} customSrc={overrides[appKey(app.name, app.category)]} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
      {settingsOpen ? <SettingsPanel overrides={overrides} hidden={hidden} onClose={() => setSettingsOpen(false)} onSet={setOverride} onToggleHidden={toggleHidden} /> : null}
    </div>
  );
}

function AppMark({ app, customSrc }: { app: AppEntry; customSrc?: string }) {
  if (customSrc) return <img src={customSrc} alt="" className="h-5 w-5 object-contain" />;
  return <BrandIcon id={app.icon} className="h-5 w-5" />;
}

function AppCard({ app, customSrc }: { app: AppEntry; customSrc?: string }) {
  return (
    <a href={app.url} target={app.url.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="group flex min-h-14 items-center gap-3 rounded-2xl px-3 py-3 transition-colors duration-200" style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--line-strong)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.borderColor = 'var(--line)'; }}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: 'var(--chip)', color: 'var(--text)' }}>
        <AppMark app={app} customSrc={customSrc} />
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-medium">{app.name}</p>
      <ExternalLink className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-50" style={{ color: 'var(--mute)' }} />
    </a>
  );
}

function SettingsPanel({ overrides, hidden, onClose, onSet, onToggleHidden }: { overrides: IconOverrides; hidden: string[]; onClose: () => void; onSet: (key: string, src?: string) => void; onToggleHidden: (key: string, hide: boolean) => void }) {
  return (
    <div className="fixed inset-0 z-40 flex" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <button type="button" className="absolute inset-0" aria-label="关闭设置" onClick={onClose} style={{ background: 'rgba(0,0,0,.36)' }} />
      <aside className="relative z-10 ml-auto flex h-full w-full max-w-md flex-col" style={{ background: 'var(--bg-elev)', borderLeft: '1px solid var(--line)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center gap-3">
            <img src={MEYRA_AVATAR} alt="" className="h-9 w-9 rounded-full object-cover" />
            <h2 id="settings-title" className="text-lg font-medium">设置</h2>
          </div>
          <button type="button" aria-label="关闭" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: 'var(--chip)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {CATEGORIES.map((cat) => (
            <section key={cat} className="mb-6">
              <h3 className="mb-2 text-sm" style={{ color: 'var(--mute)' }}>{cat}</h3>
              <div className="space-y-2">
                {APPS.filter((app) => app.category === cat).map((app) => {
                  const key = appKey(app.name, app.category);
                  const customSrc = overrides[key];
                  const isHidden = hidden.includes(key);
                  return (
                    <div key={key} className="flex items-center gap-3 rounded-2xl px-3 py-2" style={{ background: 'var(--chip)', opacity: isHidden ? 0.45 : 1 }}>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'var(--bg-elev)' }}>
                        <AppMark app={app} customSrc={customSrc} />
                      </span>
                      <p className="min-w-0 flex-1 truncate text-sm">{app.name}</p>
                      {!isHidden ? (
                        <label className="cursor-pointer rounded-full px-3 py-1.5 text-xs" style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)' }}>
                          上传
                          <input type="file" accept="image/*,.svg" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => { if (typeof reader.result === 'string') onSet(key, reader.result); };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                          }} />
                        </label>
                      ) : null}
                      {customSrc && !isHidden ? (
                        <button type="button" className="rounded-full px-3 py-1.5 text-xs" style={{ color: 'var(--mute)' }} onClick={() => onSet(key)}>还原</button>
                      ) : null}
                      <button type="button" className="rounded-full px-3 py-1.5 text-xs" style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)' }} onClick={() => onToggleHidden(key, !isHidden)}>
                        {isHidden ? '恢复' : '删除'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </div>
  );
}
