import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement = HTMLDivElement>(once = true) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const reveal = () => setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          if (once) io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "120px 0px 25% 0px" },
    );
    io.observe(el);

    const fallback = window.setTimeout(reveal, 480);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [once]);

  return { ref, shown };
}
