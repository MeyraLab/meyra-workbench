import { useEffect } from "react";

export function WorldLayer() {
  useEffect(() => {
    const sky = document.querySelector<HTMLElement>(".os-sky");
    if (!sky) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const onScroll = () => {
      sky.style.transform = `translate3d(0, ${window.scrollY * 0.06}px, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="os-sky" aria-hidden="true">
      <img className="os-sky-img is-night" src="/world/sky-night-2.jpg" alt="" />
      <img className="os-sky-img is-day" src="/world/sky-day-2.jpg" alt="" />
      <div className="os-stars" />
      <img className="os-cloud c1" src="/world/cloud-a.png" alt="" />
      <img className="os-cloud c2" src="/world/cloud-b.png" alt="" />
      <img className="os-cloud c3" src="/world/cloud-a.png" alt="" />
    </div>
  );
}
