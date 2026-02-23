"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [index, setIndex] = useState(0);

  const clampLoop = (n: number) => {
    if (images.length === 0) return 0;
    if (n < 0) return images.length - 1;
    if (n >= images.length) return 0;
    return n;
  };

  const scrollToIndex = (newIndex: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    const next = clampLoop(newIndex);
    setIndex(next);

    const tile = tileRefs.current[next];
    if (!tile) return;

    tile.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  // Keep `index` in sync when user drags/scrolls the strip.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!tiles.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the most visible tile (highest intersection ratio)
        let bestIdx = index;
        let bestRatio = 0;

        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.index);
          if (e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio;
            bestIdx = i;
          }
        }

        // Only update when we have a confident "center" tile
        if (bestRatio >= 0.6) setIndex(bestIdx);
      },
      {
        root,
        threshold: [0.4, 0.6, 0.75, 0.9],
      }
    );

    tiles.forEach((t) => io.observe(t));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  // Pad so first/last tiles can center nicely
  const sidePad = useMemo(() => "clamp(2.5rem, 8vw, 5rem)", []);

  return (
    <div
      className={`relative ${className}
        before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-16
        before:bg-gradient-to-r before:from-black/80 before:to-transparent
        after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-16
        after:bg-gradient-to-l after:from-black/80 after:to-transparent
      `}
    >
      {/* Left / Right controls */}
      <button
        type="button"
        aria-label="Previous images"
        onClick={() => scrollToIndex(index - 1)}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-md border border-white/10 bg-black/45 px-3 py-2 text-white/80 backdrop-blur-md transition hover:border-[color:var(--gold)]/40 hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
      >
        ←
      </button>

      <button
        type="button"
        aria-label="Next images"
        onClick={() => scrollToIndex(index + 1)}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-md border border-white/10 bg-black/45 px-3 py-2 text-white/80 backdrop-blur-md transition hover:border-[color:var(--gold)]/40 hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
      >
        →
      </button>

      {/* Strip */}
      <div
        ref={scrollerRef}
        className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-6"
        style={{
          paddingLeft: sidePad,
          paddingRight: sidePad,
          scrollPaddingLeft: sidePad,
          scrollPaddingRight: sidePad,
        }}
      >
        {images.map((img, i) => {
          const active = i === index;

          return (
            <div
              key={img.src + i}
              ref={(node) => {
                tileRefs.current[i] = node;
              }}
              data-tile
              data-index={i}
              className={[
                "relative snap-center shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5",
                // “panel” sizing similar to your screenshot: multiple visible, not huge single-tile
                "h-[260px] w-[190px] sm:h-[300px] sm:w-[220px] md:h-[360px] md:w-[260px] lg:h-[420px] lg:w-[300px]",
                // Focus styling
                "transition-transform duration-300 ease-out",
                active ? "scale-100" : "scale-[0.92]",
              ].join(" ")}
              style={{
                transformOrigin: "center",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt ?? "Gallery image"}
                fill
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 300px"
                className={[
                  "object-cover",
                  "transition-all duration-300 ease-out",
                  active ? "opacity-100 blur-0" : "opacity-70 blur-[1px]",
                ].join(" ")}
                priority={i < 2}
              />

              {/* Keep your existing bottom fade */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />

              {/* Subtle “active frame” without changing your palette */}
              <div
                className={[
                  "pointer-events-none absolute inset-0 rounded-2xl",
                  "transition-opacity duration-300",
                  active ? "opacity-100" : "opacity-0",
                ].join(" ")}
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.12), 0 18px 60px rgba(0,0,0,0.55)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
