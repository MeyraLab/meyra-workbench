import { useEffect, useRef } from "react";

export function BirdMark({ className }: { className?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const face = useRef<HTMLSpanElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = root.current;
    const faceEl = face.current;
    const a = left.current;
    const b = right.current;
    if (!wrap || !faceEl || !a || !b) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.38;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / 220);
      tx = (dx / dist) * reach;
      ty = (dy / dist) * reach;
    };

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      const px = (x * 6).toFixed(2);
      const py = (y * 5.2).toFixed(2);
      a.style.transform = `translate(${px}px, ${py}px)`;
      b.style.transform = `translate(${px}px, ${py}px)`;
      faceEl.style.transform = `rotate(${(x * 8).toFixed(2)}deg) translate(${(x * 2).toFixed(2)}px, ${(y * 1.6).toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span className={`bird-pet${className ? ` ${className}` : ""}`} ref={root}>
      <span className="bird-face" ref={face}>
        <img src="/world/bird-pet.png" alt="" draggable={false} />
        <span className="bird-eye is-left">
          <span className="bird-pupil" ref={left} />
        </span>
        <span className="bird-eye is-right">
          <span className="bird-pupil" ref={right} />
        </span>
      </span>
    </span>
  );
}
