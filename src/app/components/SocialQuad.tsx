import { useEffect, useRef, useState } from "react";
import { BrandIcon, type BrandId } from "../BrandIcon";
import { BirdMark } from "../os/BirdMark";

const POS_KEY = "meyra-bird-pos";

const ITEMS: Array<{
  name: string;
  href: string;
  icon: BrandId;
  card: "card1" | "card2" | "card3" | "card4";
  mark: string;
}> = [
  { name: "X", href: "https://x.com", icon: "x", card: "card1", mark: "instagram" },
  { name: "YouTube", href: "https://youtube.com", icon: "youtube", card: "card2", mark: "twitter" },
  { name: "微信读书", href: "https://weread.qq.com", icon: "weread", card: "card3", mark: "github" },
  { name: "Grok", href: "https://grok.com", icon: "grok", card: "card4", mark: "discord" },
];

type Pos = { x: number; y: number };

function readPos(): Pos {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return { x: -1, y: -1 };
    const parsed = JSON.parse(raw) as Pos;
    if (typeof parsed?.x === "number" && typeof parsed?.y === "number") return parsed;
  } catch {}
  return { x: -1, y: -1 };
}

function clampPos(x: number, y: number, w: number, h: number): Pos {
  return {
    x: Math.min(window.innerWidth - w - 8, Math.max(8, x)),
    y: Math.min(window.innerHeight - h - 8, Math.max(8, y)),
  };
}

export function SocialQuad() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos>({ x: -1, y: -1 });
  const drag = useRef<{ sx: number; sy: number; px: number; py: number; moved: boolean } | null>(null);
  const rest = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const posRef = useRef<Pos>(pos);

  useEffect(() => {
    const saved = readPos();
    const next =
      saved.x >= 0
        ? clampPos(saved.x, saved.y, 92, 92)
        : { x: Math.max(12, window.innerWidth - 118), y: Math.max(72, window.innerHeight - 140) };
    setPos(next);
    posRef.current = next;
  }, []);

  useEffect(() => {
    posRef.current = pos;
    const el = root.current;
    if (el && pos.x >= 0) {
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
    }
  }, [pos]);

  useEffect(() => {
    const el = root.current;
    if (!el || pos.x < 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let vx = 0.28;
    let vy = 0.16;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      const box = el.getBoundingClientRect();
      if (!open && !drag.current && now > rest.current) {
        vx += (Math.random() - 0.5) * 0.05;
        vy += (Math.random() - 0.5) * 0.04;
        vx = Math.max(-0.62, Math.min(0.62, vx));
        vy = Math.max(-0.42, Math.min(0.42, vy));
        const next = clampPos(posRef.current.x + vx * dt, posRef.current.y + vy * dt, box.width, box.height);
        if (next.x <= 8 || next.x >= window.innerWidth - box.width - 8) vx *= -1;
        if (next.y <= 8 || next.y >= window.innerHeight - box.height - 8) vy *= -1;
        posRef.current = next;
        el.style.left = `${next.x}px`;
        el.style.top = `${next.y}px`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, pos.x]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const el = root.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    drag.current = {
      sx: e.clientX,
      sy: e.clientY,
      px: posRef.current.x,
      py: posRef.current.y,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    const el = root.current;
    const box = el?.getBoundingClientRect();
    const next = clampPos(d.px + dx, d.py + dy, box?.width ?? 64, box?.height ?? 64);
    posRef.current = next;
    if (el) {
      el.style.left = `${next.x}px`;
      el.style.top = `${next.y}px`;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    root.current?.releasePointerCapture(e.pointerId);
    setPos(posRef.current);
    localStorage.setItem(POS_KEY, JSON.stringify(posRef.current));
    rest.current = performance.now() + 2400;
    if (d && !d.moved) setOpen((v) => !v);
  };

  if (pos.x < 0) return null;

  return (
    <div
      ref={root}
      className={`meyra-quad${open ? " is-open" : ""}`}
      style={{ left: pos.x, top: pos.y }}
      aria-label="快捷入口"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {open ? (
        <div className="main">
          <div className="up">
            <QuadCard item={ITEMS[0]} />
            <QuadCard item={ITEMS[1]} />
          </div>
          <div className="down">
            <QuadCard item={ITEMS[2]} />
            <QuadCard item={ITEMS[3]} />
          </div>
        </div>
      ) : (
        <button type="button" className="pai" aria-label="打开快捷入口" tabIndex={-1}>
          <BirdMark className="pai-svg" />
        </button>
      )}
    </div>
  );
}

function QuadCard({ item }: { item: (typeof ITEMS)[number] }) {
  return (
    <a
      className={item.card}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.name}
      title={item.name}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <span className={item.mark}>
        <BrandIcon id={item.icon} className="h-3 w-3" />
      </span>
    </a>
  );
}
