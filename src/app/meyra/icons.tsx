import type { FolderStyle, Project } from "./data";

const FOLDER =
  "M3 9a4 4 0 0 1 4-4h15.5a3 3 0 0 1 2.2 1l3.6 4H57a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z";

export function Bow({
  x = 20,
  y = 14,
  s = 1,
  r = 0,
  fill = "var(--cdp-accent)",
  stroke = "var(--cdp-deep)",
}: {
  x?: number;
  y?: number;
  s?: number;
  r?: number;
  fill?: string;
  stroke?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s}) translate(-20 -14)`}>
      <path d="M19 15c-2 5-5 9-8 13l4.5-.6L20 16Z" fill={fill} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M21 15c2 5 5 9 8 13l-4.5-.6L20 16Z" fill={fill} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M20 14C14 4 2 2 3 12c1 8 11 6 17 2Z" fill={fill} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M20 14c6-10 18-12 17-2-1 8-11 6-17 2Z" fill={fill} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M18 13C13 8 7 8 7 11.5M22 13c5-5 11-5 11-1.5" fill="none" stroke={stroke} strokeWidth=".9" opacity=".6" />
      <ellipse cx="20" cy="14" rx="3.6" ry="4.1" fill={fill} stroke={stroke} strokeWidth="1.3" />
    </g>
  );
}

export function FolderIcon({ style, uid, size = 64 }: { style: FolderStyle; uid: string; size?: number }) {
  const dark = style === "noir" || style === "ribbon" || style === "bows";
  const body = dark ? "#232326" : "color-mix(in oklab, var(--cdp-accent) 88%, #b0305e)";
  const face = dark ? "#303034" : "var(--cdp-accent)";
  return (
    <svg viewBox="0 0 64 52" width={size} height={size * 0.8125} className="cdp-svg" aria-hidden="true">
      <path d={FOLDER} fill={body} />
      {style === "noir" ? <path d={FOLDER} fill={`url(#${uid}-ging)`} /> : null}
      {style === "ribbon" ? <rect x="28" y="5" width="8" height="12" fill="var(--cdp-accent)" /> : null}
      <rect x="3" y="15" width="58" height="34" rx="4" fill={face} />
      {style === "blush" ? <rect x="3" y="15" width="58" height="34" rx="4" fill={`url(#${uid}-lace)`} /> : null}
      {style === "noir" ? <rect x="3" y="15" width="58" height="34" rx="4" fill={`url(#${uid}-ging)`} /> : null}
      {style === "bows" ? <rect x="3" y="15" width="58" height="34" rx="4" fill={`url(#${uid}-lace)`} opacity=".35" /> : null}
      {style === "ribbon" ? <rect x="28" y="15" width="8" height="34" fill="var(--cdp-accent)" /> : null}
      <rect x="4" y="16" width="56" height="1.4" rx=".7" fill="#fff" opacity={dark ? 0.14 : 0.55} />
      {style === "blush" ? <Bow x={51} y={11} s={0.5} r={12} fill="#fff" stroke="#bfbfc4" /> : null}
      {style === "noir" ? <Bow x={13} y={9} s={0.5} r={-10} fill="#ededf0" stroke="#8a8a90" /> : null}
      {style === "ribbon" ? (
        <>
          <Bow x={32} y={16} s={0.44} fill="var(--cdp-accent)" stroke="#8d3a5a" />
          <Bow x={12} y={23} s={0.36} r={-14} fill="var(--cdp-accent)" stroke="#8d3a5a" />
          <Bow x={52} y={23} s={0.36} r={14} fill="var(--cdp-accent)" stroke="#8d3a5a" />
        </>
      ) : null}
      {style === "bows" ? (
        <>
          <Bow x={14} y={17} s={0.42} r={-8} />
          <Bow x={32} y={16} s={0.42} />
          <Bow x={50} y={17} s={0.42} r={8} />
        </>
      ) : null}
    </svg>
  );
}

export function DocIcon({ tone, size = 40 }: { tone: "ink" | "accent"; size?: number }) {
  const stroke = tone === "ink" ? "var(--cdp-fg, #111)" : "color-mix(in oklab, var(--cdp-accent) 80%, var(--cdp-deep))";
  const fill = tone === "ink" ? "var(--cdp-bg, #fff)" : "color-mix(in oklab, var(--cdp-accent) 16%, var(--cdp-bg, #fff))";
  return (
    <svg viewBox="0 0 40 48" width={size} height={size * 1.2} className="cdp-svg" aria-hidden="true">
      <path d="M9 3.5h15l10.5 10.5v28.5a2.5 2.5 0 0 1-2.5 2.5H9a2.5 2.5 0 0 1-2.5-2.5V6A2.5 2.5 0 0 1 9 3.5Z" fill={fill} stroke={stroke} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M23.5 3.5v8a2.5 2.5 0 0 0 2.5 2.5h8.5" fill="none" stroke={stroke} strokeWidth="2.6" strokeLinejoin="round" />
    </svg>
  );
}

export function DockGlyph({ app, uid, now }: { app: string; uid: string; now: Date }) {
  const deep = "var(--cdp-deep)";
  const accent = "var(--cdp-accent)";
  const month = now.toLocaleString("en", { month: "short" }).toUpperCase();
  const tile = (fill: string) => <rect x="1" y="1" width="46" height="46" rx="11" fill={fill} stroke="rgba(0,0,0,.08)" />;
  let body = tile("#fff");
  if (app === "finder") {
    body = (
      <>
        <rect x="1" y="1" width="46" height="46" rx="11" fill="#8e6f7c" />
        <path d="M24 1h12a11 11 0 0 1 11 11v24a11 11 0 0 1-11 11H24Z" fill="#c9a6b5" />
        <path d="M22 1c-3 9-4 17-1 25h3c-1 7 0 14 2 21" fill="none" stroke="#3a2630" strokeWidth="1.8" />
        <path d="M14 15v6M33 15v6" stroke="#3a2630" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M12 32c7 5 17 5 24 0" fill="none" stroke="#3a2630" strokeWidth="2" strokeLinecap="round" />
      </>
    );
  } else if (app === "launchpad") {
    body = (
      <>
        {tile("#2e2e32")}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => <circle key={`${row}${col}`} cx={14 + col * 10} cy={14 + row * 10} r="3.2" fill="#fff" />),
        )}
      </>
    );
  } else if (app === "about") {
    body = (
      <>
        {tile(`color-mix(in oklab, ${accent} 70%, #9b6b80)`)}
        <text x="24" y="33" textAnchor="middle" fontSize="25" fontWeight="700" fill="#fff" fontFamily="Georgia, 'Times New Roman', serif">
          A
        </text>
      </>
    );
  } else if (app === "spotlight") {
    body = (
      <>
        {tile("#fff")}
        <circle cx="24" cy="24" r="10.5" fill="none" stroke="#2b2b2e" strokeWidth="2.6" />
      </>
    );
  } else if (app === "contact") {
    body = (
      <>
        {tile("#fff")}
        <rect x="11" y="15" width="26" height="18" rx="2.5" fill="none" stroke={deep} strokeWidth="2.2" />
        <path d="M12 16.5 24 26l12-9.5" fill="none" stroke={deep} strokeWidth="2.2" strokeLinejoin="round" />
      </>
    );
  } else if (app === "calendar") {
    body = (
      <>
        {tile("#fff")}
        <text x="24" y="15" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#e0457b" fontFamily="system-ui, sans-serif">
          {month}
        </text>
        <text x="24" y="36" textAnchor="middle" fontSize="19" fontWeight="500" fill="#222" fontFamily="system-ui, sans-serif">
          {now.getDate()}
        </text>
      </>
    );
  } else if (app === "messages") {
    body = (
      <>
        {tile("#fff")}
        <path d="M24 12c-8 0-13.5 4.8-13.5 10.8 0 3.4 1.8 6.3 4.7 8.3L14 36.5l6.4-3.2c1.2.3 2.3.4 3.6.4 8 0 13.5-4.8 13.5-10.9S32 12 24 12Z" fill="none" stroke={deep} strokeWidth="2.2" strokeLinejoin="round" />
      </>
    );
  } else if (app === "gallery") {
    body = (
      <>
        <rect x="1" y="1" width="46" height="46" rx="11" fill={`url(#${uid}-grad)`} />
        <rect x="13" y="13" width="22" height="22" rx="4" fill="#fff" opacity=".35" />
      </>
    );
  } else if (app === "notes") {
    body = (
      <>
        {tile("#fff")}
        <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="600" fill="#e0457b" fontFamily="system-ui, sans-serif">
          {now.getFullYear()}
        </text>
      </>
    );
  } else if (app === "music") {
    body = (
      <>
        {tile(deep)}
        <circle cx="24" cy="24" r="13" fill="#fff" />
        <circle cx="24" cy="24" r="8.5" fill="none" stroke={deep} strokeWidth=".8" opacity=".5" />
        <circle cx="24" cy="24" r="3" fill={deep} />
      </>
    );
  } else if (app === "skills") {
    body = (
      <>
        {tile(`color-mix(in oklab, ${accent} 55%, #fff)`)}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => <circle key={`${row}${col}`} cx={15 + col * 9} cy={15 + row * 9} r="2.6" fill={deep} />),
        )}
      </>
    );
  } else if (app === "trash") {
    body = (
      <>
        {tile("#fff")}
        <rect x="15" y="15" width="18" height="18" rx="3" fill="#c81d56" />
      </>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="cdp-svg" aria-hidden="true">
      {body}
    </svg>
  );
}

const plates = [
  ["#fde4ec", "#f4b6cb", "#7d1d45"],
  ["#2b2b2e", "#f4b6cb", "#fafafa"],
  ["#fff6f9", "#e27fa3", "#3a3a3e"],
  ["#f6ede6", "#d98fa8", "#5b1a36"],
] as const;

function hash(name: string) {
  let n = 2166136261;
  for (let i = 0; i < name.length; i++) n = Math.imul(n ^ name.charCodeAt(i), 16777619);
  return n >>> 0;
}

export function ProjectShot({ project, square = false }: { project: Project; square?: boolean }) {
  const n = hash(project.name);
  const [paper, pink, ink] = plates[n % plates.length];
  const layout = (n >>> 3) % 3;
  const letter = project.name.trim().charAt(0).toUpperCase();
  if (square) {
    return (
      <svg viewBox="0 0 100 100" className="cdp-svg" aria-hidden="true">
        <rect width="100" height="100" fill={paper} />
        <circle cx={layout === 1 ? 78 : 22} cy={layout === 2 ? 80 : 22} r="30" fill={pink} opacity=".55" />
        <text x="50" y="70" textAnchor="middle" fontSize="58" fontStyle="italic" fontWeight="700" fill={ink} fontFamily="Times New Roman, Times, Georgia, serif">
          {letter}
        </text>
        <Bow x={76} y={24} s={0.62} r={14} fill={pink} stroke={ink} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 100" className="cdp-svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="160" height="100" fill={paper} />
      <rect width="160" height="9" fill={ink} opacity=".08" />
      <circle cx="6" cy="4.5" r="1.6" fill="#ff5f57" />
      <circle cx="11" cy="4.5" r="1.6" fill="#febc2e" />
      <circle cx="16" cy="4.5" r="1.6" fill="#28c840" />
      {layout === 0 ? (
        <>
          <text x="12" y="46" fontSize="26" fontStyle="italic" fontWeight="700" fill={ink} fontFamily="Georgia, Times New Roman, serif">
            {project.name.split(" ")[0].toLowerCase()}
          </text>
          <rect x="12" y="54" width="60" height="3" rx="1.5" fill={ink} opacity=".35" />
          <rect x="12" y="60" width="44" height="3" rx="1.5" fill={ink} opacity=".25" />
          <rect x="12" y="70" width="26" height="9" rx="4.5" fill={pink} />
          <circle cx="122" cy="52" r="26" fill={pink} />
          <Bow x={122} y={52} s={0.9} fill="#fff" stroke={ink} />
        </>
      ) : null}
      {layout === 1 ? (
        <>
          <text x="80" y="40" textAnchor="middle" fontSize="22" fontStyle="italic" fontWeight="700" fill={ink} fontFamily="Georgia, Times New Roman, serif">
            {project.name.toLowerCase()}
          </text>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={14 + i * 46} y="58" width="40" height="32" rx="3" fill={i === 1 ? pink : ink} opacity={i === 1 ? 1 : 0.1} />
          ))}
        </>
      ) : null}
      {layout === 2 ? (
        <>
          <rect x="0" y="9" width="72" height="91" fill={pink} />
          <text x="36" y="66" textAnchor="middle" fontSize="48" fontStyle="italic" fontWeight="700" fill={paper} fontFamily="Georgia, Times New Roman, serif">
            {letter}
          </text>
          <rect x="84" y="28" width="60" height="5" rx="2.5" fill={ink} opacity=".7" />
          <rect x="84" y="39" width="52" height="3" rx="1.5" fill={ink} opacity=".3" />
        </>
      ) : null}
    </svg>
  );
}

export function PatternDefs({ uid }: { uid: string }) {
  return (
    <svg width="0" height="0" className="cdp-defs" aria-hidden="true">
      <defs>
        <pattern id={`${uid}-ging`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="4" height="8" fill="#fff" opacity=".28" />
          <rect width="8" height="4" fill="#fff" opacity=".28" />
        </pattern>
        <pattern id={`${uid}-lace`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r=".95" fill="#fff" opacity=".85" />
        </pattern>
        <linearGradient id={`${uid}-grad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5c9a" />
          <stop offset="1" stopColor="#f9c6d8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
