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
