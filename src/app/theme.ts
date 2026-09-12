export type ThemePref = "light" | "dark" | "system";

export function resolveTheme(pref: ThemePref): "light" | "dark" {
  if (pref === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return pref;
}

export function applyTheme(pref: ThemePref) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!root) return;
  const resolved = resolveTheme(pref);
  root.dataset.theme = resolved;
  root.dataset.themePref = pref;
  localStorage.setItem("meyra-theme", pref);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", resolved === "dark" ? "#0c0e14" : "#f4efe6");
}

export function readThemePref(): ThemePref {
  const saved = localStorage.getItem("meyra-theme");
  if (saved === "light" || saved === "dark" || saved === "system") return saved;
  return "system";
}
