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
    setPos({ x: window.innerWidth - 80, y: window.innerHeight - 88 });
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
    const bw = box?.width ?? 64;
    const bh = box?.height ?? 64;
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
        <button type="button" className="pai" aria-label="打开快捷入口" tabIndex={-1}>
          <PaiPet />
        </button>
      )}
    </div>
  );
}

function PaiPet() {
  return (
    <svg className="pai-svg" viewBox="0 0 160 148" aria-hidden="true">
      <defs>
        <radialGradient id="body" cx="42%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ffe4ee" />
          <stop offset="38%" stopColor="#ffb6cb" />
          <stop offset="78%" stopColor="#ff8fb0" />
          <stop offset="100%" stopColor="#ef6d93" />
        </radialGradient>
        <radialGradient id="arm" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffc2d4" />
          <stop offset="100%" stopColor="#f07a9c" />
        </radialGradient>
        <radialGradient id="foot" cx="32%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#ff7fa3" />
          <stop offset="55%" stopColor="#e4537b" />
          <stop offset="100%" stopColor="#c53b66" />
        </radialGradient>
        <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff8aa8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ff8aa8" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="7" stdDeviation="4.5" floodColor="#d45" floodOpacity="0.2" />
        </filter>
      </defs>
      <ellipse cx="80" cy="138" rx="36" ry="6" fill="#000" opacity=".07" />
      <g filter="url(#soft)">
        <g className="pai-arm-l">
          <ellipse cx="28" cy="92" rx="18" ry="14" fill="url(#arm)" stroke="#c75d76" strokeWidth="2.4" />
        </g>
        <g className="pai-arm-r">
          <ellipse cx="132" cy="92" rx="18" ry="14" fill="url(#arm)" stroke="#c75d76" strokeWidth="2.4" />
        </g>
        <ellipse cx="80" cy="68" rx="54" ry="48" fill="url(#body)" stroke="#c75d76" strokeWidth="2.6" />
        <g className="pai-foot-l">
          <ellipse cx="48" cy="118" rx="22" ry="16" fill="url(#foot)" stroke="#b24763" strokeWidth="2.4" />
        </g>
        <g className="pai-foot-r">
          <ellipse cx="112" cy="118" rx="22" ry="16" fill="url(#foot)" stroke="#b24763" strokeWidth="2.4" />
        </g>
        <ellipse cx="46" cy="62" rx="16" ry="11" fill="url(#cheek)" />
        <ellipse cx="114" cy="62" rx="16" ry="11" fill="url(#cheek)" />
        <g className="pai-eyes">
          <ellipse cx="66" cy="58" rx="7.2" ry="10.4" fill="#3a241c" />
          <ellipse cx="94" cy="58" rx="7.2" ry="10.4" fill="#3a241c" />
          <ellipse cx="64.2" cy="53.2" rx="3.1" ry="3.8" fill="#fff" />
          <ellipse cx="92.2" cy="53.2" rx="3.1" ry="3.8" fill="#fff" />
          <ellipse cx="68.6" cy="63.2" rx="2" ry="2.2" fill="#8fc4e0" />
          <ellipse cx="96.6" cy="63.2" rx="2" ry="2.2" fill="#8fc4e0" />
        </g>
        <path d="M74 72c3.2 3.6 8.8 3.6 12 0" fill="none" stroke="#3a241c" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="58" cy="44" rx="10" ry="6" fill="#fff" opacity=".28" />
      </g>
    </svg>
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
