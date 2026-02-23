"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type GalleryImage = { src: string; alt?: string };

export default function GalleryStripClient({
  images,
  className = "",
}: {
  images: GalleryImage[];
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  const n = images.length;
  const total = n * 3;

  const tripled = useMemo(() => {
    if (!n) return [];
    return [...images, ...images, ...images];
  }, [images, n]);

  const sidePad = useMemo(() => "clamp(2.5rem, 8vw, 5rem)", []);

  const [virtualIndex, setVirtualIndex] = useState(() => (n ? n : 0));
  const [isReady, setIsReady] = useState(false);

  const mod = useCallback((x: number, m: number) => ((x % m) + m) % m, []);

  const centerToVirtualIndex = useCallback(
    (targetVI: number, smooth: boolean) => {
      const el = scrollerRef.current;
      if (!el || !n) return;

      const vi = mod(targetVI, total);
      const tile = tileRefs.current[vi];
      if (!tile) return;

      // Use offsetLeft math (stable)
      const tileCenter = tile.offsetLeft + tile.offsetWidth / 2;
      const targetScrollLeft = tileCenter - el.clientWidth / 2;

      el.scrollTo({
        left: targetScrollLeft,
        behavior: smooth ? "smooth" : "auto",
      });

      setVirtualIndex(vi);
    },
    [mod, n, total]
  );

  // Initialize when DOM is actually measurable (no ref wiping)
  const ensureReady = useCallback(() => {
    if (!n) return;

    let tries = 0;

    const tick = () => {
      const el = scrollerRef.current;
      const midTile = tileRefs.current[n]; // first tile in middle band

      const ok =
        !!el &&
        el.clientWidth > 0 &&
        !!midTile &&
        midTile.offsetWidth > 0;

      if (ok) {
        centerToVirtualIndex(n, false); // start in middle band
        setIsReady(true);
        return;
      }

      tries += 1;
      if (tries < 90) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [centerToVirtualIndex, n]);

  // On images change / first mount: reset state (but DO NOT clear refs array)
  useEffect(() => {
    if (!n) return;

    setIsReady(false);
    setVirtualIndex(n);

    // Ensure refs array is at least the right length (do not overwrite values)
    if (tileRefs.current.length < total) tileRefs.current.length = total;

    ensureReady();
  }, [ensureReady, n, total]);

  // Re-run readiness on layout changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !n) return;

    const ro = new ResizeObserver(() => {
      if (!isReady) ensureReady();
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [ensureReady, isReady, n]);

  const goPrev = useCallback(() => {
    if (!n) return;
    if (!isReady) {
      ensureReady();
      return;
    }
    centerToVirtualIndex(virtualIndex - 1, true);
  }, [centerToVirtualIndex, ensureReady, isReady, n, virtualIndex]);

  const goNext = useCallback(() => {
    if (!n) return;
    if (!isReady) {
      ensureReady();
      return;
    }
    centerToVirtualIndex(virtualIndex + 1, true);
  }, [centerToVirtualIndex, ensureReady, isReady, n, virtualIndex]);

  // Scroll sync + normalize back to middle band after scroll settles
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !n || !isReady) return;

    let raf = 0;
    let idleTimer: number | null = null;

    const computeClosest = () => {
      const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!tiles.length) return;

      const centerX = el.scrollLeft + el.clientWidth / 2;

      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        const tileCenter = t.offsetLeft + t.offsetWidth / 2;
        const d = Math.abs(tileCenter - centerX);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }

      setVirtualIndex(bestIdx);
    };

    const normalizeToMiddleBand = () => {
      setVirtualIndex((currentVI) => {
        let nextVI = currentVI;

        if (currentVI < n) nextVI = currentVI + n;
        else if (currentVI >= 2 * n) nextVI = currentVI - n;

        if (nextVI !== currentVI) {
          requestAnimationFrame(() => centerToVirtualIndex(nextVI, false));
        }

        return nextVI;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(computeClosest);

      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(normalizeToMiddleBand, 140);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      if (idleTimer) window.clearTimeout(idleTimer);
      el.removeEventListener("scroll", onScroll);
    };
  }, [centerToVirtualIndex, isReady, n]);

  // Keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  if (!n) return null;

  return (
    <div
      className={`relative z-0 ${className}
        before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-16
        before:bg-gradient-to-r before:from-black/80 before:to-transparent
        after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-16
        after:bg-gradient-to-l after:from-black/80 after:to-transparent
      `}
    >
      <button
        type="button"
        aria-label="Previous images"
        onClick={goPrev}
        className="absolute left-3 top-1/2 z-50 -translate-y-1/2 rounded-md border border-white/10 bg-black/45 px-3 py-2 text-white/80 backdrop-blur-md transition hover:border-[color:var(--gold)]/40 hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
      >
        ←
      </button>

      <button
        type="button"
        aria-label="Next images"
        onClick={goNext}
        className="absolute right-3 top-1/2 z-50 -translate-y-1/2 rounded-md border border-white/10 bg-black/45 px-3 py-2 text-white/80 backdrop-blur-md transition hover:border-[color:var(--gold)]/40 hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
      >
        →
      </button>

      <div
        ref={scrollerRef}
        className="no-scrollbar relative flex snap-x snap-mandatory gap-3 overflow-x-auto py-6"
        style={{
          paddingLeft: sidePad,
          paddingRight: sidePad,
          scrollPaddingLeft: sidePad,
          scrollPaddingRight: sidePad,
        }}
      >
        {tripled.map((img, i) => {
          const active = i === virtualIndex;

          return (
            <div
              key={`${img.src}-${i}`}
              ref={(node) => {
                tileRefs.current[i] = node;
              }}
              className={[
                "relative snap-center shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5",
                "h-[260px] w-[190px] sm:h-[300px] sm:w-[220px] md:h-[360px] md:w-[260px] lg:h-[500px] lg:w-[380px]",
                "transition-transform duration-300 ease-out",
                active ? "scale-[1.02]" : "scale-100",
              ].join(" ")}
            >
              <Image
                src={img.src}
                alt={img.alt ?? "Gallery image"}
                fill
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 380px"
                className={[
                  "object-cover transition-all duration-300 ease-out",
                  active ? "opacity-100" : "opacity-85",
                ].join(" ")}
                priority={i >= n && i < n + 2}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />

              <div
                className={[
                  "pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300",
                  active ? "opacity-100" : "opacity-0",
                ].join(" ")}
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.16), 0 18px 70px rgba(0,0,0,0.55)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
