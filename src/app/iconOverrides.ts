const KEY = 'meyra-icon-overrides';

export type IconOverrides = Record<string, string>;

export function readIconOverrides(): IconOverrides {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as IconOverrides;
  } catch {
    return {};
  }
}

export function writeIconOverrides(next: IconOverrides) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function appKey(name: string, category: string) {
  return `${category}:${name}`;
}

const HIDDEN_KEY = 'meyra-hidden-apps';

export function readHiddenApps(): string[] {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function writeHiddenApps(next: string[]) {
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(next));
}
