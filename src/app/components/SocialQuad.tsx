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
    setPos({ x: window.innerWidth - 72, y: window.innerHeight - 80 });
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
    const bw = box?.width ?? 56;
    const bh = box?.height ?? 56;
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
    <svg className="pai-svg" viewBox="0 0 120 110" aria-hidden="true">
      <defs>
        <radialGradient id="paiBody" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#ffd6e4" />
          <stop offset="55%" stopColor="#ff9db8" />
          <stop offset="100%" stopColor="#f07a9a" />
        </radialGradient>
        <radialGradient id="paiFoot" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ff8aa8" />
          <stop offset="100%" stopColor="#d94a73" />
        </radialGradient>
        <filter id="paiSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#e28" floodOpacity="0.22" />
        </filter>
      </defs>
      <ellipse cx="60" cy="102" rx="28" ry="5" fill="#000" opacity=".08" />
      <g filter="url(#paiSoft)">
        <ellipse cx="28" cy="70" rx="14" ry="11" fill="url(#paiBody)" stroke="#c45b6f" strokeWidth="2.2" />
        <ellipse cx="92" cy="70" rx="14" ry="11" fill="url(#paiBody)" stroke="#c45b6f" strokeWidth="2.2" />
        <ellipse cx="60" cy="52" rx="40" ry="36" fill="url(#paiBody)" stroke="#c45b6f" strokeWidth="2.4" />
        <ellipse cx="38" cy="88" rx="16" ry="12" fill="url(#paiFoot)" stroke="#b44562" strokeWidth="2.2" />
        <ellipse cx="82" cy="88" rx="16" ry="12" fill="url(#paiFoot)" stroke="#b44562" strokeWidth="2.2" />
        <ellipse cx="48" cy="50" rx="9" ry="7" fill="#ffb7c9" opacity=".7" />
        <ellipse cx="72" cy="50" rx="9" ry="7" fill="#ffb7c9" opacity=".7" />
        <ellipse cx="50" cy="44" rx="5.2" ry="7.2" fill="#4a2a22" />
        <ellipse cx="66" cy="44" rx="5.2" ry="7.2" fill="#4a2a22" />
        <ellipse cx="48.6" cy="41.6" rx="2.1" ry="2.6" fill="#fff" />
        <ellipse cx="64.6" cy="41.6" rx="2.1" ry="2.6" fill="#fff" />
        <ellipse cx="51.4" cy="46.6" rx="1.3" ry="1.4" fill="#7eb6d6" />
        <ellipse cx="67.4" cy="46.6" rx="1.3" ry="1.4" fill="#7eb6d6" />
        <path d="M56 54c2 2.4 6 2.4 8 0" fill="none" stroke="#4a2a22" strokeWidth="1.6" strokeLinecap="round" />
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
