export type ThemePref = 'light' | 'dark' | 'system';

export function resolveTheme(pref: ThemePref): 'light' | 'dark' {
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref;
}

export function applyTheme(pref: ThemePref) {
  const resolved = resolveTheme(pref);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePref = pref;
  localStorage.setItem('meyra-theme', pref);
}

export function readThemePref(): ThemePref {
  const saved = localStorage.getItem('meyra-theme');
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  return 'system';
}
