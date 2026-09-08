import { useEffect, useRef, useState } from 'react';
import { BrandIcon, type BrandId } from '../BrandIcon';

const POS_KEY = 'meyra-quad-pos';

const ITEMS: Array<{
  name: string;
  href: string;
  icon: BrandId;
  card: 'card1' | 'card2' | 'card3' | 'card4';
  mark: string;
}> = [
  { name: 'X', href: 'https://x.com', icon: 'x', card: 'card1', mark: 'instagram' },
  { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube', card: 'card2', mark: 'twitter' },
  { name: '微信读书', href: 'https://weread.qq.com', icon: 'weread', card: 'card3', mark: 'github' },
  { name: 'Grok', href: 'https://grok.com', icon: 'grok', card: 'card4', mark: 'discord' },
];

type Pos = { x: number; y: number };

function readPos(): Pos {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return { x: -1, y: -1 };
    const parsed = JSON.parse(raw) as Pos;
    if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') return parsed;
  } catch {}
  return { x: -1, y: -1 };
}

export function SocialQuad() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos>({ x: -1, y: -1 });
  const drag = useRef<{ sx: number; sy: number; px: number; py: number; moved: boolean } | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = readPos();
    if (saved.x >= 0) {
      setPos(saved);
      return;
    }
    setPos({ x: window.innerWidth - 56, y: window.innerHeight - 56 });
  }, []);

  useEffect(() => {
    if (pos.x < 0) return;
    localStorage.setItem(POS_KEY, JSON.stringify(pos));
  }, [pos]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const el = root.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    const el = root.current;
    const box = el?.getBoundingClientRect();
    const bw = box?.width ?? 36;
    const bh = box?.height ?? 36;
    setPos({
      x: Math.min(window.innerWidth - bw - 8, Math.max(8, d.px + dx)),
      y: Math.min(window.innerHeight - bh - 8, Math.max(8, d.py + dy)),
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    root.current?.releasePointerCapture(e.pointerId);
    if (d && !d.moved) setOpen((v) => !v);
  };

  if (pos.x < 0) return null;

  return (
    <div
      ref={root}
      className={`meyra-quad${open ? ' is-open' : ''}`}
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
        <button type="button" className="orb" aria-label="打开快捷入口" tabIndex={-1}>
          <span className="petal p1" />
          <span className="petal p2" />
          <span className="petal p3" />
          <span className="petal p4" />
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
