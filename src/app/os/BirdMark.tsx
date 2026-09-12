export function BirdMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 168" aria-hidden="true">
      <defs>
        <radialGradient id="birdBody" cx="38%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#7ad0ff" />
          <stop offset="42%" stopColor="#3d8fff" />
          <stop offset="100%" stopColor="#2456d6" />
        </radialGradient>
        <radialGradient id="birdBeak" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#5ec8ff" />
          <stop offset="100%" stopColor="#2a6ad4" />
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="158" rx="28" ry="5" fill="#000" opacity=".12" />
      <ellipse cx="80" cy="86" rx="62" ry="66" fill="url(#birdBody)" />
      <ellipse cx="52" cy="148" rx="10" ry="5" fill="#2a4eb8" />
      <ellipse cx="76" cy="150" rx="10" ry="5" fill="#2a4eb8" />
      <path d="M68 104 L80 128 L92 104 Z" fill="url(#birdBeak)" />
      <circle cx="62" cy="72" r="22" fill="#fff" />
      <circle cx="104" cy="74" r="24" fill="#fff" />
      <circle cx="66" cy="76" r="11" fill="#141414" />
      <circle cx="107" cy="78" r="12" fill="#141414" />
      <circle cx="70" cy="72" r="3.2" fill="#fff" />
      <circle cx="111" cy="74" r="3.4" fill="#fff" />
      <ellipse cx="48" cy="48" rx="16" ry="10" fill="#fff" opacity=".22" />
    </svg>
  );
}
