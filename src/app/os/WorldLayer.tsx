import { useEffect, useRef } from "react";

export function WorldLayer() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const clouds = Array.from(el.querySelectorAll<HTMLElement>(".os-cloud"));
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = (now: number) => {
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      const t = now / 1000;
      clouds.forEach((cloud, i) => {
        const speed = 11 + i * 7;
        const amp = 70 + i * 36;
        const x = Math.sin(t / speed + i) * amp + mx * (22 + i * 14);
        const y = Math.cos(t / (speed + 4) + i * 0.7) * (12 + i * 6) + my * (10 + i * 8);
        cloud.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
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
    <div className="os-sky" ref={root} aria-hidden="true">
      <div className="os-stars" />
      <div className="os-stars-near" />
      <img className="os-cloud c1" src="/world/cloud-white-a.webp" alt="" />
      <img className="os-cloud c2" src="/world/cloud-white-b.webp" alt="" />
      <img className="os-cloud c3" src="/world/cloud-white-c.webp" alt="" />
    </div>
  );
}
