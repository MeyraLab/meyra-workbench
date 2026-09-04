import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Moon, Sun, Monitor } from 'lucide-react';
import { APPS, CATEGORIES, type AppCategory, type AppEntry } from './apps';
import { applyTheme, readThemePref, type ThemePref } from './theme';

const INK_ICONS = new Set(['x', 'chatgpt', 'grok', 'notebooklm']);

const THEME_OPTIONS: Array<{ id: ThemePref; label: string; icon: typeof Sun }> = [
  { id: 'light', label: '浅色模式', icon: Sun },
  { id: 'dark', label: '深色模式', icon: Moon },
  { id: 'system', label: '系统模式', icon: Monitor },
];

export default function App() {
  const [pref, setPref] = useState<ThemePref>('system');
  const [category, setCategory] = useState<'全部' | AppCategory>('全部');

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

  const visible = useMemo(
    () => (category === '全部' ? APPS : APPS.filter((app) => app.category === category)),
    [category],
  );

  const onTheme = (next: ThemePref) => {
    setPref(next);
    applyTheme(next);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header className="sticky top-0 z-20 backdrop-blur-xl" style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)', borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--dim)' }}>MeyraLab</p>
            <h1 className="text-[28px] font-medium leading-none tracking-tight md:text-[32px]">Meyra's 工作台</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--mute)' }}>我在哪里冲浪</p>
          </div>
          <div className="flex items-center gap-1 rounded-full p-1" style={{ background: 'var(--chip)', border: '1px solid var(--line)' }} role="radiogroup" aria-label="主题">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const on = pref === opt.id;
              return (
                <button key={opt.id} type="button" role="radio" aria-checked={on} aria-label={opt.label} title={opt.label} onClick={() => onTheme(opt.id)} className="flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors duration-200" style={{ background: on ? 'var(--chip-on)' : 'transparent', color: on ? 'var(--chip-on-text)' : 'var(--mute)' }}>
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const on = category === cat;
            return (
              <button key={cat} type="button" onClick={() => setCategory(cat)} className="shrink-0 rounded-full px-4 py-2 text-sm min-h-11 transition-colors duration-200" style={{ background: on ? 'var(--chip-on)' : 'var(--chip)', color: on ? 'var(--chip-on-text)' : 'var(--mute)', border: '1px solid var(--line)' }}>
                {cat}
              </button>
            );
          })}
        </div>
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((app) => (
            <AppCard key={app.name} app={app} />
          ))}
        </section>
      </main>
    </div>
  );
}

function AppCard({ app }: { app: AppEntry }) {
  return (
    <a href={app.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-[132px] flex-col rounded-2xl p-4 transition-colors duration-200" style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--line-strong)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.borderColor = 'var(--line)'; }}>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--chip)', color: 'var(--text)' }}>
          <img src={`/icons/${app.icon}.svg`} alt="" width={20} height={20} className={INK_ICONS.has(app.icon) ? 'icon-ink h-5 w-5' : 'h-5 w-5'} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{app.name}</p>
          <p className="text-xs" style={{ color: 'var(--dim)' }}>{app.category}</p>
        </div>
        <ExternalLink className="h-4 w-4 opacity-40 group-hover:opacity-80" style={{ color: 'var(--mute)' }} />
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--mute)' }}>{app.purpose}</p>
    </a>
  );
}
