import { useEffect, useRef } from "react";

export function BirdMark({ className }: { className?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const face = useRef<HTMLSpanElement>(null);
  const shadow = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = root.current;
    const body = face.current;
    const ground = shadow.current;
    if (!wrap || !body || !ground) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lookX = 0;
    let lookY = 0;
    let tx = 0;
    let ty = 0;
    let lastPointer = 0;
    let nextGlance = 5000;
    let hop = 0;
    let hopping = false;
    let hopStart = 0;
    let nextHop = 9000;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      lastPointer = e.timeStamp || performance.now();
      const r = wrap.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width * 0.5);
      const dy = e.clientY - (r.top + r.height * 0.42);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / 240);
      tx = (dx / dist) * reach;
      ty = (dy / dist) * reach;
    };

    const tick = (now: number) => {
      if (now - lastPointer > 1600 && now > nextGlance) {
        tx = (Math.random() - 0.5) * 0.45;
        ty = (Math.random() - 0.5) * 0.2;
        nextGlance = now + 4000 + Math.random() * 5000;
      }

      if (!hopping && now > nextHop) {
        hopping = true;
        hopStart = now;
        nextHop = now + 8000 + Math.random() * 7000;
      }
      if (hopping) {
        const u = (now - hopStart) / 520;
        if (u >= 1) {
          hopping = false;
          hop = 0;
        } else {
          hop = Math.sin(u * Math.PI) * 10;
        }
      }

      lookX += (tx - lookX) * 0.06;
      lookY += (ty - lookY) * 0.06;

      const t = now / 1000;
      const bob = Math.sin(t * 1.5) * 1.8;
      const rot = lookX * 5.5 + Math.sin(t * 1.15) * 1.1;

      body.style.transform =
        `translate(${(lookX * 2).toFixed(2)}px, ${(bob - hop).toFixed(2)}px) rotate(${rot.toFixed(2)}deg)`;
      ground.style.transform = `scale(${(1 - hop / 80).toFixed(3)}, 1)`;

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
      <span className="bird-shadow" ref={shadow} />
      <span className="bird-face" ref={face}>
        <img src="/world/bird-pet.png" alt="" draggable={false} />
      </span>
    </span>
  );
}
