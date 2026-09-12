import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement = HTMLDivElement>(once = true) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    setArmed(true);
    const reveal = () => setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          if (once) io.disconnect();
        }
      },
      { threshold: 0.04, rootMargin: "180px 0px 40% 0px" },
    );
    io.observe(el);

    const fallback = window.setTimeout(reveal, 320);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [once]);

  return { ref, shown, armed };
}
