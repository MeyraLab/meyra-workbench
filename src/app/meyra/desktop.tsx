import { Fragment, useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { DockGlyph, DocIcon, FolderIcon, PatternDefs } from "./icons";
import {
  AssetsPanel,
  Launchpad,
  LogPanel,
  NowPanel,
  ProjectsPanel,
  SocialPanel,
  Spotlight,
  ToolsPanel,
  openOut,
  type SectionId,
} from "./panels";
import { PROJECTS } from "../projects";
import { NOW, WORKFLOW, WORKFLOW_ACTIVE } from "../now";
import type { FolderStyle } from "./data";

type Kind = SectionId;
type Phase = "in" | "open" | "out" | "min" | "hidden";

type Win = {
  id: string;
  kind: Kind;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  max: boolean;
  phase: Phase;
  ox: number;
  oy: number;
};

const SIZES: Record<Kind, { w: number; h: number; title: string }> = {
  now: { w: 440, h: 300, title: "Now" },
  projects: { w: 680, h: 480, title: "Projects" },
  tools: { w: 680, h: 480, title: "Tools" },
  assets: { w: 1000, h: 640, title: "资产板" },
  log: { w: 520, h: 340, title: "Log" },
  social: { w: 420, h: 360, title: "Social" },
};

const DOCK: { key: string; label: string; kind: Kind | "launchpad"; glyph: string }[] = [
  { key: "now", label: "Now", kind: "now", glyph: "notes" },
  { key: "projects", label: "Projects", kind: "projects", glyph: "gallery" },
  { key: "tools", label: "Tools", kind: "tools", glyph: "finder" },
  { key: "assets", label: "资产板", kind: "assets", glyph: "skills" },
  { key: "log", label: "Log", kind: "log", glyph: "calendar" },
  { key: "launchpad", label: "Launchpad", kind: "launchpad", glyph: "launchpad" },
  { key: "social", label: "Social", kind: "social", glyph: "messages" },
];

const WALLS = ["plain", "blush", "gingham", "dots"] as const;
type Wall = (typeof WALLS)[number];

const DOCK_GAP = 84;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function dockScale(mouse: number | null, icon: number) {
  if (mouse === null) return 1;
  const d = Math.abs(mouse - icon);
  if (d >= 110) return 1;
  return 1 + 0.5 * Math.cos((d / 110) * (Math.PI / 2)) ** 2;
}

function place(box: { w: number; h: number }, size: { w: number; h: number }, n: number, compact: boolean) {
  const limit = Math.max(160, box.h - DOCK_GAP);
  if (compact) {
    const w = Math.max(200, box.w - 16);
    const h = Math.max(160, Math.min(size.h + 60, limit - 16));
    return { x: 8, y: clamp(8 + (n % 3) * 10, 0, Math.max(0, limit - h)), w, h };
  }
  const w = Math.min(size.w, box.w - 32);
  const h = Math.min(size.h, limit - 24);
  const shift = (n % 6) * 26;
  return {
    x: clamp(Math.round((box.w - w) / 2 - 60 + shift), 12, Math.max(12, box.w - w - 12)),
    y: clamp(Math.round((limit - h) / 2 - 30 + shift), 36, Math.max(36, limit - h - 12)),
    w,
    h,
  };
}

function wallPaint(wall: Wall) {
  if (wall === "blush") return "radial-gradient(120% 90% at 50% 45%, var(--cdp-desk) 40%, color-mix(in oklab, var(--cdp-accent) 38%, var(--cdp-desk)))";
  if (wall === "gingham") return "repeating-linear-gradient(0deg, color-mix(in oklab, var(--cdp-accent) 18%, transparent) 0 22px, transparent 22px 44px), repeating-linear-gradient(90deg, color-mix(in oklab, var(--cdp-accent) 18%, transparent) 0 22px, transparent 22px 44px), var(--cdp-desk)";
  if (wall === "dots") return "radial-gradient(color-mix(in oklab, var(--cdp-accent) 55%, transparent) 1.4px, transparent 1.6px) 0 0 / 22px 22px, var(--cdp-desk)";
  return "var(--cdp-desk)";
}

type IconModel = {
  id: string;
  label: string;
  kind: "doc" | "folder";
  tone?: "ink" | "accent";
  style?: FolderStyle;
  open: Kind;
  href?: string;
  x: number;
  y: number;
};

const ICONS: IconModel[] = [
  { id: "now", label: "now", kind: "doc", tone: "ink", open: "now", x: 12, y: 22 },
  { id: "assets", label: "资产板", kind: "doc", tone: "accent", open: "assets", x: 14, y: 48 },
  { id: "log", label: "log", kind: "doc", tone: "ink", open: "log", x: 12, y: 72 },
  { id: "tools", label: "tools", kind: "folder", style: "blush", open: "tools", x: 84, y: 18 },
  { id: "inkpai", label: "INKPAI", kind: "folder", style: "noir", open: "projects", href: PROJECTS.find((item) => item.id === "inkpai")?.href, x: 68, y: 30 },
  { id: "excerpt", label: "IMAGE EXCERPT", kind: "folder", style: "ribbon", open: "projects", href: PROJECTS.find((item) => item.id === "excerpt")?.href, x: 84, y: 46 },
  { id: "vibe", label: "VIBE STORE", kind: "folder", style: "bows", open: "projects", href: PROJECTS.find((item) => item.id === "vibe")?.href, x: 70, y: 68 },
  { id: "kit", label: "DESIGN-KIT", kind: "folder", style: "plain", open: "projects", href: PROJECTS.find((item) => item.id === "design-kit")?.href, x: 28, y: 82 },
];

const MOBILE_POSITIONS: Record<string, { x: number; y: number }> = {
  now: { x: 20, y: 14 }, tools: { x: 80, y: 14 },
  assets: { x: 20, y: 28 }, inkpai: { x: 80, y: 28 },
  log: { x: 20, y: 70 }, excerpt: { x: 80, y: 70 },
  kit: { x: 20, y: 82 }, vibe: { x: 80, y: 82 },
};

export function Desktop({ onSettings, onTheme, dark }: { onSettings: () => void; onTheme: () => void; dark: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const root = useRef<HTMLDivElement>(null);
  const dockRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const centers = useRef<Record<string, number>>({});
  const dockHot = useRef(false);
  const timers = useRef<number[]>([]);
  const seq = useRef(0);
  const zTop = useRef(20);
  const [box, setBox] = useState({ w: 1200, h: 800 });
  const compact = box.w < 640;
  useEffect(() => {
    setWins(prev => prev.map(win => ({ ...win, ...place(box, SIZES[win.kind], 0, compact), max: compact ? true : win.max })));
  }, [box.w, box.h, compact]);
  const [reduced, setReduced] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [moved, setMoved] = useState<Record<string, { x: number; y: number }>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [band, setBand] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const [wins, setWins] = useState<Win[]>([]);
  const [launch, setLaunch] = useState(false);
  const [spot, setSpot] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [wall, setWall] = useState<Wall>("plain");
  const [bounce, setBounce] = useState<string | null>(null);
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const measure = () => setBox({ w: node.clientWidth, h: node.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    const clock = window.setInterval(() => setNow(new Date()), 60000);
    const introDone = window.setTimeout(() => setIntro(false), 1700);
    return () => {
      media.removeEventListener("change", apply);
      window.clearInterval(clock);
      window.clearTimeout(introDone);
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSpot((open) => !open);
        setLaunch(false);
        return;
      }
      if (event.key === "Escape") {
        setSpot(false);
        setLaunch(false);
        setMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function later(fn: () => void, ms: number) {
    const id = window.setTimeout(fn, reduced ? 0 : ms);
    timers.current.push(id);
  }

  function localPoint(clientX: number, clientY: number) {
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return { x: clientX, y: clientY };
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function dockPoint(key: string) {
    const node = dockRefs.current[key];
    if (!node) return { x: box.w / 2, y: box.h - 30 };
    const rect = node.getBoundingClientRect();
    return localPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  function iconPoint(id: string, index: number) {
    const pos = moved[id] ?? (compact ? MOBILE_POSITIONS[id] : { x: ICONS[index].x, y: ICONS[index].y });
    return { x: (pos.x / 100) * box.w, y: (pos.y / 100) * box.h };
  }

  function raise(id: string) {
    setWins((prev) => {
      const top = prev.reduce((max, win) => Math.max(max, win.z), 0);
      const win = prev.find((item) => item.id === id);
      if (!win || win.z === top) return prev;
      zTop.current = top + 1;
      return prev.map((item) => (item.id === id ? { ...item, z: top + 1 } : item));
    });
  }

  function settle(id: string, from: Phase, to: Phase | "gone", ms: number) {
    later(() => {
      setWins((prev) => {
        if (to === "gone") return prev.filter((win) => !(win.id === id && win.phase === from));
        return prev.map((win) => (win.id === id && win.phase === from ? { ...win, phase: to } : win));
      });
    }, ms);
  }

  function bounceKey(key: string) {
    if (reduced) return;
    setBounce(key);
    later(() => setBounce((current) => (current === key ? null : current)), 700);
  }

  function openKind(kind: Kind, origin?: { x: number; y: number }) {
    setMenu(null);
    setLaunch(false);
    setSpot(false);
    const from = origin ?? dockPoint(kind);
    if (!origin) bounceKey(kind);
    const same = wins.find((win) => win.kind === kind);
    if (same) {
      const waking = same.phase === "hidden" || same.phase === "min";
      setWins((prev) =>
        prev.map((win) => {
          if (win.id !== same.id) return win;
          return {
            ...win,
            z: ++zTop.current,
            phase: waking ? "in" : win.phase,
            ox: waking ? from.x - win.x : win.ox,
            oy: waking ? from.y - win.y : win.oy,
          };
        }),
      );
      if (waking) settle(same.id, "in", "open", 280);
      return;
    }
    const id = `${kind}-${seq.current++}`;
    const frame = place(box, SIZES[kind], seq.current, compact);
    setWins((prev) => [
      ...prev,
      {
        id,
        kind,
        ...frame,
        z: ++zTop.current,
        max: compact,
        phase: "in",
        ox: from.x - frame.x,
        oy: from.y - frame.y,
      },
    ]);
    settle(id, "in", "open", 280);
  }

  function closeWin(id: string) {
    setWins((prev) => prev.map((win) => (win.id === id ? { ...win, phase: "out" } : win)));
    settle(id, "out", "gone", 200);
  }

  function minimize(win: Win) {
    const dock = dockPoint(win.kind);
    const x = win.max ? 0 : win.x;
    const y = win.max ? 0 : win.y;
    setWins((prev) => prev.map((item) => (item.id === win.id ? { ...item, phase: "min", ox: dock.x - x, oy: dock.y - y } : item)));
    settle(win.id, "min", "hidden", 320);
  }

  function restore(id: string) {
    const win = wins.find((item) => item.id === id);
    if (!win) return;
    const dock = dockPoint(win.kind);
    setWins((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, phase: "in", z: ++zTop.current, ox: dock.x - item.x, oy: dock.y - item.y } : item,
      ),
    );
    settle(id, "in", "open", 280);
  }

  function onDock(item: (typeof DOCK)[number]) {
    if (item.kind === "launchpad") {
      bounceKey(item.key);
      setSpot(false);
      setLaunch((open) => !open);
      return;
    }
    bounceKey(item.key);
    const kind = item.kind;
    const hidden = wins.find((win) => win.kind === kind && (win.phase === "hidden" || win.phase === "min"));
    if (hidden) {
      restore(hidden.id);
      return;
    }
    const visible = wins.filter((win) => win.kind === kind && (win.phase === "open" || win.phase === "in"));
    if (visible.length) {
      raise(visible.reduce((a, b) => (a.z > b.z ? a : b)).id);
      return;
    }
    openKind(kind);
  }

  function openIcon(icon: IconModel) {
    if (icon.href) {
      openOut(icon.href);
      return;
    }
    openKind(icon.open);
  }

  function titleOf(win: Win) {
    return SIZES[win.kind].title;
  }

  function magnifyDock(event: ReactPointerEvent<HTMLElement>) {
    if (reduced || compact || event.pointerType !== "mouse") return;
    if (!dockHot.current) {
      dockHot.current = true;
      for (const item of DOCK) {
        const node = dockRefs.current[item.key];
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        centers.current[item.key] = rect.left + rect.width / 2;
      }
    }
    for (const item of DOCK) {
      const node = dockRefs.current[item.key];
      if (!node) continue;
      node.style.setProperty("--s", String(dockScale(event.clientX, centers.current[item.key] ?? 0)));
    }
  }

  function resetDock() {
    dockHot.current = false;
    for (const item of DOCK) dockRefs.current[item.key]?.style.setProperty("--s", "1");
  }

  function pressDock(event: ReactPointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    const direct = (event.target as HTMLElement).closest(".cdp-dock-btn");
    let key = direct?.getAttribute("data-key") ?? "";
    if (!key) {
      let best = 48;
      for (const item of DOCK) {
        const node = dockRefs.current[item.key];
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        const dist = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
        if (dist < best) {
          best = dist;
          key = item.key;
        }
      }
    }
    const item = DOCK.find((entry) => entry.key === key);
    if (!item) return;
    event.preventDefault();
    event.stopPropagation();
    onDock(item);
  }

  const topZ = wins.reduce((max, win) => (win.phase === "hidden" ? max : Math.max(max, win.z)), 0);
  const running = new Set(wins.map((win) => win.kind));

  return (
    <div
      ref={root}
      className="desk"
      data-intro={intro && !reduced ? "on" : "off"}
      data-compact={compact ? "on" : "off"}
      style={
        {
          height: "100dvh",
          "--cdp-accent": "#f4b6cb",
          "--cdp-deep": "#7d1d45",
          background: wallPaint(wall),
        } as CSSProperties
      }
      onContextMenu={(event) => {
        if ((event.target as HTMLElement).closest(".cdp-win,.cdp-dock,.cdp-over")) return;
        event.preventDefault();
        const point = localPoint(event.clientX, event.clientY);
        setMenu({ x: clamp(point.x, 4, box.w - 200), y: clamp(point.y, 4, box.h - 190) });
      }}
    >
      <PatternDefs uid={uid} />
      <header className="wb-bar">
        <b>MEYRA</b>
        {DOCK.filter((item) => item.kind !== "launchpad").map((item) => (
          <button key={item.key} type="button" onClick={() => openKind(item.kind as Kind)}>
            {item.label}
          </button>
        ))}
        <button type="button" onClick={() => setSpot(true)}>
          Spotlight
        </button>
        <button type="button" onClick={onTheme} aria-label={dark ? "切换日间主题" : "切换夜间主题"}>{dark ? "☀" : "☾"}</button>
        <button type="button" onClick={onSettings}>设置</button>
        <span className="wb-clock" suppressHydrationWarning>
          {now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </header>
      <div className="cdp-surface" onPointerDown={startBand} />
      <h1 className="cdp-hello">
        <span className="cdp-eyebrow">{NOW.status}</span>
        <span className="cdp-headline">
          {NOW.project}
          <svg viewBox="0 0 40 28" className="cdp-svg cdp-hello-bow" aria-hidden="true">
            <g transform="translate(20 14) rotate(-14) translate(-20 -14)">
              <BowPath />
            </g>
          </svg>
        </span>
        <span className="wb-sub">{NOW.next}</span>
        <span className="wb-steps">
          {WORKFLOW.map((step, index) => (
            <span key={step}>
              {index > 0 ? " — " : ""}
              <span className={index === WORKFLOW_ACTIVE ? "is-on" : ""}>{step}</span>
            </span>
          ))}
        </span>
      </h1>
      {ICONS.map((icon, index) => {
        const pos = moved[icon.id] ?? (compact ? MOBILE_POSITIONS[icon.id] : { x: icon.x, y: icon.y });
        return (
          <button
            key={icon.id}
            type="button"
            className={`cdp-icon${selected.has(icon.id) ? " is-sel" : ""}`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, ["--i" as string]: index } as CSSProperties}
            aria-label={`Open ${icon.label}`}
            onPointerDown={(event) => dragIcon(event, icon, index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openIcon(icon);
              }
            }}
          >
            <span className="cdp-icon-art">
              {icon.kind === "doc" ? (
                <DocIcon tone={icon.tone ?? "ink"} size={compact ? 34 : 40} />
              ) : (
                <FolderIcon style={icon.style ?? "plain"} uid={uid} size={compact ? 56 : 72} />
              )}
            </span>
            <span className="cdp-icon-label">{icon.label}</span>
          </button>
        );
      })}
      {band ? (
        <div
          className="cdp-band"
          style={{
            left: Math.min(band.x0, band.x1),
            top: Math.min(band.y0, band.y1),
            width: Math.abs(band.x1 - band.x0),
            height: Math.abs(band.y1 - band.y0),
          }}
        />
      ) : null}
      {wins.map((win) => {
        const frame = win.max
          ? { left: 0, top: 36, width: box.w, height: box.h - DOCK_GAP - 36, zIndex: win.z }
          : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };
        const style = {
          ...frame,
          "--ox": `${win.max ? win.ox + win.x : win.ox}px`,
          "--oy": `${win.max ? win.oy + win.y : win.oy}px`,
        } as CSSProperties;
        return (
          <section
            key={win.id}
            role="dialog"
            aria-label={titleOf(win)}
            className={`cdp-win is-${win.phase}${win.z === topZ ? " is-top" : ""}`}
            style={style}
            onPointerDownCapture={(event) => {
              if ((event.target as HTMLElement).closest("a")) return;
              raise(win.id);
            }}
          >
            <header
              className="cdp-bar"
              onPointerDown={(event) => dragWin(event, win, "move")}
              onDoubleClick={(event) => {
                if ((event.target as HTMLElement).closest("button")) return;
                setWins((prev) => prev.map((item) => (item.id === win.id ? { ...item, max: !item.max } : item)));
              }}
            >
              <span className="cdp-lights">
                <button type="button" className="cdp-l is-r" aria-label="Close" onClick={() => closeWin(win.id)}>
                  <svg viewBox="0 0 8 8" className="cdp-svg" aria-hidden="true">
                    <path d="M2 2l4 4M6 2 2 6" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>
                <button type="button" className="cdp-l is-y" aria-label="Minimize" onClick={() => minimize(win)}>
                  <svg viewBox="0 0 8 8" className="cdp-svg" aria-hidden="true">
                    <path d="M1.5 4h5" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="cdp-l is-g"
                  aria-label="Zoom"
                  onClick={() => setWins((prev) => prev.map((item) => (item.id === win.id ? { ...item, max: !item.max } : item)))}
                >
                  <svg viewBox="0 0 8 8" className="cdp-svg" aria-hidden="true">
                    <path d="M2 5.8V2h3.8zM6 2.2V6H2.2z" fill="currentColor" />
                  </svg>
                </button>
              </span>
              <span className="cdp-title">{titleOf(win)}</span>
            </header>
            <div className="cdp-content">
              {win.kind === "now" ? <NowPanel /> : null}
              {win.kind === "projects" ? <ProjectsPanel /> : null}
              {win.kind === "tools" ? <ToolsPanel /> : null}
              {win.kind === "assets" ? <AssetsPanel /> : null}
              {win.kind === "log" ? <LogPanel /> : null}
              {win.kind === "social" ? <SocialPanel /> : null}
            </div>
            {!win.max && !compact ? (
              <span className="cdp-grip" aria-hidden="true" onPointerDown={(event) => dragWin(event, win, "size")} />
            ) : null}
          </section>
        );
      })}
      <nav
        className="cdp-dock"
        aria-label="Dock"
        onPointerDown={pressDock}
        onPointerMove={magnifyDock}
        onPointerLeave={resetDock}
      >
        {DOCK.map((item) => (
          <Fragment key={item.key}>
            {item.key === "social" ? <span className="cdp-dock-sep" aria-hidden="true" /> : null}
            <button
              type="button"
              data-key={item.key}
              ref={(node) => {
                dockRefs.current[item.key] = node;
              }}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onDock(item); } }}
              className={`cdp-dock-btn${bounce === item.key ? " is-bounce" : ""}`}
              aria-label={item.label}
            >
              <span className="cdp-tip">{item.label}</span>
              <span className="cdp-dock-art">
                <DockGlyph app={item.glyph} uid={uid} now={now} />
              </span>
              {(item.kind !== "launchpad" && running.has(item.kind)) || (item.kind === "launchpad" && launch) ? (
                <i className="cdp-run" />
              ) : null}
            </button>
          </Fragment>
        ))}
      </nav>
      {menu ? (
        <div className="cdp-menu" role="menu" style={{ left: menu.x, top: menu.y }}>
          {DOCK.filter((item) => item.kind !== "launchpad").map((item) => (
            <button key={item.key} type="button" role="menuitem" onClick={() => openKind(item.kind as Kind, menu)}>
              {item.label}
            </button>
          ))}
          <hr />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMoved({});
              setMenu(null);
            }}
          >
            Clean Up
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setWall((current) => WALLS[(WALLS.indexOf(current) + 1) % WALLS.length]);
              setMenu(null);
            }}
          >
            Change Wallpaper
          </button>
        </div>
      ) : null}
      {launch ? <Launchpad onClose={() => setLaunch(false)} /> : null}
      {spot ? <Spotlight onClose={() => setSpot(false)} onOpen={(id) => openKind(id)} /> : null}
    </div>
  );

  function startBand(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || event.target !== event.currentTarget) return;
    setMenu(null);
    setSelected(new Set());
    const start = localPoint(event.clientX, event.clientY);
    const node = event.currentTarget;
    node.setPointerCapture(event.pointerId);
    setBand({ x0: start.x, y0: start.y, x1: start.x, y1: start.y });
    const move = (ev: PointerEvent) => {
      const point = localPoint(ev.clientX, ev.clientY);
      setBand({ x0: start.x, y0: start.y, x1: point.x, y1: point.y });
      const left = Math.min(start.x, point.x);
      const right = Math.max(start.x, point.x);
      const top = Math.min(start.y, point.y);
      const bottom = Math.max(start.y, point.y);
      const hits = ICONS.filter((icon, index) => {
        const at = iconPoint(icon.id, index);
        return at.x + 40 > left && at.x - 40 < right && at.y + 40 > top && at.y - 40 < bottom;
      }).map((icon) => icon.id);
      setSelected(new Set(hits));
    };
    const up = () => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", up);
      setBand(null);
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerup", up);
  }

  function dragIcon(event: ReactPointerEvent<HTMLButtonElement>, icon: IconModel, index: number) {
    if (event.button !== 0) return;
    event.stopPropagation();
    setMenu(null);
    const origin = moved[icon.id] ?? (compact ? MOBILE_POSITIONS[icon.id] : { x: icon.x, y: icon.y });
    const startX = event.clientX;
    const startY = event.clientY;
    let dragged = false;
    const node = event.currentTarget;
    node.setPointerCapture(event.pointerId);
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!dragged && Math.hypot(dx, dy) < 4) return;
      dragged = true;
      node.dataset.drag = "on";
      setMoved((prev) => ({
        ...prev,
        [icon.id]: {
          x: clamp(origin.x + (dx / box.w) * 100, 4, 96),
          y: clamp(origin.y + (dy / box.h) * 100, 5, 88),
        },
      }));
    };
    const up = (ev: PointerEvent) => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", up);
      delete node.dataset.drag;
      if (dragged || ev.shiftKey || ev.metaKey) return;
      setSelected(new Set([icon.id]));
      openIcon(icon);
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerup", up);
  }

  function dragWin(event: ReactPointerEvent<HTMLElement>, win: Win, mode: "move" | "size") {
    if (event.button !== 0) return;
    if (mode === "move" && (event.target as HTMLElement).closest("button,input,a")) return;
    event.preventDefault();
    raise(win.id);
    const start = { cx: event.clientX, cy: event.clientY, x: win.x, y: win.y, w: win.w, h: win.h };
    const node = event.currentTarget;
    node.setPointerCapture(event.pointerId);
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.cx;
      const dy = ev.clientY - start.cy;
      setWins((prev) =>
        prev.map((item) => {
          if (item.id !== win.id) return item;
          if (mode === "size") {
            return { ...item, max: false, w: clamp(start.w + dx, 260, box.w - item.x), h: clamp(start.h + dy, 160, box.h - item.y) };
          }
          if (item.max) return item;
          return {
            ...item,
            x: clamp(start.x + dx, 80 - item.w, box.w - 80),
            y: clamp(start.y + dy, 28, Math.max(28, box.h - DOCK_GAP - 28)),
          };
        }),
      );
    };
    const up = () => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", up);
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerup", up);
  }
}

function BowPath() {
  return (
    <>
      <path d="M19 15c-2 5-5 9-8 13l4.5-.6L20 16Z" fill="var(--cdp-accent)" stroke="var(--cdp-deep)" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M21 15c2 5 5 9 8 13l-4.5-.6L20 16Z" fill="var(--cdp-accent)" stroke="var(--cdp-deep)" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M20 14C14 4 2 2 3 12c1 8 11 6 17 2Z" fill="var(--cdp-accent)" stroke="var(--cdp-deep)" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M20 14c6-10 18-12 17-2-1 8-11 6-17 2Z" fill="var(--cdp-accent)" stroke="var(--cdp-deep)" strokeWidth="1.3" strokeLinejoin="round" />
      <ellipse cx="20" cy="14" rx="3.6" ry="4.1" fill="var(--cdp-accent)" stroke="var(--cdp-deep)" strokeWidth="1.3" />
    </>
  );
}
