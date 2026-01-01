"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function BackToTop({
  heroId = "hero",
  offset = 24,
}: {
  heroId?: string;
  offset?: number;
}) {
  const [visible, setVisible] = useState(false);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return prefersReducedMotion();
  }, []);

  useEffect(() => {
    let raf = 0;

    const getThreshold = () => {
      const hero = document.getElementById(heroId);
      if (!hero) return 520; // fallback if heroId not found
      const rect = hero.getBoundingClientRect();
      // hero height in document flow:
      const heroHeight = rect.height;
      // Show once you've effectively passed the hero.
      return Math.max(320, heroHeight - 40);
    };

    let threshold = getThreshold();

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        setVisible(y > threshold);
      });
    };

    const onResize = () => {
      threshold = getThreshold();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // initial
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [heroId]);

  function goTop() {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.18 }}
          className="fixed z-[60]"
          style={{ left: "50%", top: offset=82, transform: "translateX(-50%)" }}
        >
          <button
            type="button"
            onClick={goTop}
            aria-label="Back to top"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0b0b0c]/80 backdrop-blur px-4 py-3 text-sm text-white/80 shadow-[0_18px_55px_rgba(0,0,0,0.55)] transition hover:bg-[#0b0b0c]/95 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition group-hover:border-[color:var(--gold)]/35">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
                className="text-white/80"
                fill="none"
              >
                <path
                  d="M12 5l-6 6m6-6l6 6M12 5v14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="hidden sm:inline tracking-[0.02em]">Top</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
