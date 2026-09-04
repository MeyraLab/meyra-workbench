import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Moon, Sun, Monitor } from 'lucide-react';
import { APPS, CATEGORIES, type AppCategory, type AppEntry } from './apps';
import { applyTheme, readThemePref, type ThemePref } from './theme';
import { BrandIcon } from './BrandIcon';

const THEME_OPTIONS: Array<{ id: ThemePref; label: string; icon: typeof Sun }> = [
  { id: 'light', label: '浅色模式', icon: Sun },
  { id: 'dark', label: '深色模式', icon: Moon },
  { id: 'system', label: '系统模式', icon: Monitor },
];

export default function App() {
  const [pref, setPref] = useState<ThemePref>('system');
  const [folder, setFolder] = useState<'全部' | AppCategory>('全部');

  useEffect(() => {
    const initial = readThemePref();
    setPref(initial);
    applyTheme(initial);
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

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header className="sticky top-0 z-20 backdrop-blur-xl" style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)', borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <h1 className="text-[24px] font-medium tracking-tight md:text-[28px]">Meyra's 工作台</h1>
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
        {sections.map((cat) => (
          <section key={cat} id={cat}>
            <h2 className="mb-4 text-[15px] tracking-wide" style={{ color: 'var(--mute)' }}>{cat}</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {APPS.filter((app) => app.category === cat).map((app) => (
                <AppCard key={`${app.category}-${app.name}`} app={app} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

function AppCard({ app }: { app: AppEntry }) {
  return (
    <a href={app.url} target={app.url.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="group flex min-h-14 items-center gap-3 rounded-2xl px-3 py-3 transition-colors duration-200" style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--line-strong)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.borderColor = 'var(--line)'; }}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: 'var(--chip)', color: 'var(--text)' }}>
        <BrandIcon id={app.icon} className="h-5 w-5" />
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-medium">{app.name}</p>
      <ExternalLink className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-50" style={{ color: 'var(--mute)' }} />
    </a>
  );
}
