"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";

function ChevronLeft({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Item = { src: string; alt: string };

export function RolexGalleryClient({ items }: { items: Item[] }) {
  const curated = useMemo(() => items, [items]); // keep it Rolex-curated
  const featured = curated[0];
  const rest = curated.slice(1, 9);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isOpen = openIndex !== null;
  const current = openIndex !== null ? curated[openIndex] : null;

  function open(i: number) {
    setOpenIndex(i);
  }

  function close() {
    setOpenIndex(null);
  }

  function next() {
    if (openIndex === null) return;
    setOpenIndex((openIndex + 1) % curated.length);
  }

  function prev() {
    if (openIndex === null) return;
    setOpenIndex((openIndex - 1 + curated.length) % curated.length);
  }

  // Keyboard controls + prevent background scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, openIndex]);

  return (
    <>
      <SectionReveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
              LOOKBOOK
            </div>
            <h2 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl">
              Gallery
            </h2>
            <p className="mt-3 max-w-2xl text-white/70">
              Precision fades, clean line work, and a premium finish—captured with restraint.
            </p>
          </div>
          <div className="hidden md:block text-right text-white/50 text-sm">
            Click to view
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Featured */}
          <button
            type="button"
            onClick={() => open(0)}
            className="lg:col-span-7 text-left self-start w-full"
            aria-label="Open featured image"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="relative h-[460px] md:h-[560px]">
                <Image
                  src={featured.src}
                  alt={featured.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <div className="text-white/80 text-sm">{featured.alt}</div>
                <div className="text-white/50 text-xs tracking-[0.22em]">
                  NG3 · BARBERSHOP
                </div>
              </div>
            </div>
          </button>

          {/* Thumbnails */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-5">
              {rest.map((img, idx) => {
                const actualIndex = idx + 1; // because featured is index 0
                return (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => open(actualIndex)}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left"
                    aria-label={`Open image: ${img.alt}`}
                  >
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-70" />
                    </div>

                    <div className="absolute left-5 right-5 bottom-5 flex items-center justify-between">
                      <div className="text-white/85 text-xs">{img.alt}</div>
                      <div className="h-[1px] w-10 bg-[color:var(--gold)]/60" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
                STANDARD
              </div>
              <div className="mt-2 text-white/80">Fewer images. Higher confidence.</div>
              <div className="mt-2 text-white/60 text-sm">
                Use Arrow keys to navigate when open.
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // IMPORTANT: close on any click on the backdrop.
            onClick={() => close()}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery viewer"
          >
            <div className="absolute inset-x-0 top-0 p-5 flex items-center justify-between">
              <div className="text-white/60 text-xs tracking-[0.22em]">
                {openIndex! + 1} / {curated.length}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white/80 hover:text-white hover:border-white/30 transition"
              >
                Close
              </button>
            </div>

            <div className="h-full w-full flex items-center justify-center px-5 pb-14 pt-16">
              <div
                className="w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()} // clicking inside viewer should NOT close
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-black group">
                  {/* Image area */}
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={current.src}
                      alt={current.alt}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority
                    />

                    {/* Luxury edge fades */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/35 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/35 to-transparent" />

                    {/* LEFT CLICK ZONE: left quarter, full height */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prev();
                      }}
                      className="group/zone absolute left-0 top-0 h-full w-1/4 flex items-center justify-start px-4 md:px-6"
                      aria-label="Previous image"
                    >
                      {/* Hover spotlight */}
                      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/zone:opacity-100">
                        <span className="absolute inset-0 bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10" />
                      </span>

                      <ChevronLeft className="relative z-10 h-8 w-8 text-white/70 opacity-80 transition-opacity duration-200 group-hover/zone:opacity-100 drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)]" />
                    </button>

                    {/* RIGHT CLICK ZONE: right quarter, full height */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        next();
                      }}
                      className="group/zone absolute right-0 top-0 h-full w-1/4 flex items-center justify-end px-4 md:px-6"
                      aria-label="Next image"
                    >
                      {/* Hover spotlight */}
                      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/zone:opacity-100">
                        <span className="absolute inset-0 bg-gradient-to-l from-white/[0.06] via-white/[0.03] to-transparent" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10" />
                      </span>

                      <ChevronRight className="relative z-10 h-8 w-8 text-white/70 opacity-80 transition-opacity duration-200 group-hover/zone:opacity-100 drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)]" />
                    </button>

                    {/* Optional: cursor hint (subtle, premium) */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white/[0.03] to-transparent" />
                      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white/[0.03] to-transparent" />
                    </div>
                  </div>

                  {/* Caption bar */}
                  <div className="flex items-center justify-between gap-6 px-6 py-5 border-t border-white/10 bg-black/40">
                    <div className="text-white/80 text-sm">{current.alt}</div>
                    <div className="hidden sm:block h-[1px] w-24 bg-[color:var(--gold)]/45" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
