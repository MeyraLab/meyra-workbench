import { useId } from "react";

export function PaiMark({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const body = `${uid}-body`;
  const arm = `${uid}-arm`;
  const foot = `${uid}-foot`;
  const cheek = `${uid}-cheek`;
  const soft = `${uid}-soft`;

  return (
    <svg className={className} viewBox="0 0 160 148" aria-hidden="true">
      <defs>
        <radialGradient id={body} cx="42%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ffe4ee" />
          <stop offset="38%" stopColor="#ffb6cb" />
          <stop offset="78%" stopColor="#ff8fb0" />
          <stop offset="100%" stopColor="#ef6d93" />
        </radialGradient>
        <radialGradient id={arm} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffc2d4" />
          <stop offset="100%" stopColor="#f07a9c" />
        </radialGradient>
        <radialGradient id={foot} cx="32%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#ff7fa3" />
          <stop offset="55%" stopColor="#e4537b" />
          <stop offset="100%" stopColor="#c53b66" />
        </radialGradient>
        <radialGradient id={cheek} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff8aa8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ff8aa8" stopOpacity="0" />
        </radialGradient>
        <filter id={soft} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="7" stdDeviation="4.5" floodColor="#d45" floodOpacity="0.2" />
        </filter>
      </defs>
      <ellipse cx="80" cy="138" rx="36" ry="6" fill="#000" opacity=".07" />
      <g filter={`url(#${soft})`}>
        <ellipse cx="28" cy="92" rx="18" ry="14" fill={`url(#${arm})`} stroke="#c75d76" strokeWidth="2.4" />
        <ellipse cx="132" cy="92" rx="18" ry="14" fill={`url(#${arm})`} stroke="#c75d76" strokeWidth="2.4" />
        <ellipse cx="80" cy="68" rx="54" ry="48" fill={`url(#${body})`} stroke="#c75d76" strokeWidth="2.6" />
        <ellipse cx="48" cy="118" rx="22" ry="16" fill={`url(#${foot})`} stroke="#b24763" strokeWidth="2.4" />
        <ellipse cx="112" cy="118" rx="22" ry="16" fill={`url(#${foot})`} stroke="#b24763" strokeWidth="2.4" />
        <ellipse cx="46" cy="62" rx="16" ry="11" fill={`url(#${cheek})`} />
        <ellipse cx="114" cy="62" rx="16" ry="11" fill={`url(#${cheek})`} />
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
