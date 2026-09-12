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
    let tx = 0.2;
    let ty = -0.1;
    let lastPointer = 0;
    let nextLook = 800;
    let hop = 0;
    let hopping = false;
    let hopStart = 0;
    let nextHop = 2800;
    let facing = 1;
    let lastLeft = wrap.getBoundingClientRect().left;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      lastPointer = e.timeStamp || performance.now();
      const r = wrap.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width * 0.5);
      const dy = e.clientY - (r.top + r.height * 0.4);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / 160);
      tx = (dx / dist) * reach;
      ty = (dy / dist) * reach;
    };

    const tick = (now: number) => {
      if (now - lastPointer > 900 && now > nextLook) {
        tx = Math.random() * 1.8 - 0.9;
        ty = Math.random() * 1.1 - 0.55;
        nextLook = now + 900 + Math.random() * 1600;
      }

      if (!hopping && now > nextHop) {
        hopping = true;
        hopStart = now;
        nextHop = now + 2400 + Math.random() * 2800;
      }
      if (hopping) {
        const u = (now - hopStart) / 420;
        if (u >= 1) {
          hopping = false;
          hop = 0;
        } else {
          hop = Math.sin(u * Math.PI) * 26;
        }
      }

      lookX += (tx - lookX) * 0.1;
      lookY += (ty - lookY) * 0.1;

      const left = wrap.getBoundingClientRect().left;
      if (Math.abs(left - lastLeft) > 0.35) {
        facing = left > lastLeft ? 1 : -1;
        lastLeft = left;
      }

      const t = now / 1000;
      const breathe = Math.sin(t * 2.6) * 0.045;
      const sway = Math.sin(t * 1.7) * 3.2;
      const bob = Math.sin(t * 2.6) * 3.4;
      const squash = hopping ? 1 + Math.sin(((now - hopStart) / 420) * Math.PI) * 0.08 : 1;
      const rot = lookX * 10 * facing + sway * 0.35;

      body.style.transform =
        `translateY(${(bob - hop).toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scale(${facing * (1 + breathe * 0.15)}, ${squash + breathe})`;
      ground.style.transform = `scale(${(1.05 - hop / 70).toFixed(3)}, 1)`;
      ground.style.opacity = String(0.18 + hop / 140);

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
