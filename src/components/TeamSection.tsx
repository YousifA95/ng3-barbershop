"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Barber = {
  name: string;
  img: string; // e.g. "/images/barbers/adam.jpg"
};

const BARBERS: Barber[] = [
  { name: "Nameer", img: "/images/barber-1.webp" },
  { name: "Norman", img: "/images/barber-2.webp" },
  { name: "Neno", img: "/images/barber-3.webp" },
  { name: "Laith", img: "/images/barber-4.webp" },
  { name: "Fadi", img: "/images/barber-5.webp" },
  { name: "Tony", img: "/images/barber-6.webp" },
];

function Ring() {
  return (
    <>
      {/* outer ring */}
      <span className="pointer-events-none absolute inset-0 rounded-full border border-white/10" />

      {/* dotted ring */}
      <span className="pointer-events-none absolute inset-[-8px] rounded-full border border-dashed border-white/10 opacity-60" />

      {/* gold arc accent */}
      <span className="pointer-events-none absolute inset-[-10px] rounded-full [mask:conic-gradient(from_210deg,#000_0_78%,transparent_78%_100%)] border-2 border-[color:var(--gold)]/55" />

      {/* subtle glow */}
      <span className="pointer-events-none absolute inset-[-22px] rounded-full [background:radial-gradient(circle,rgba(212,175,55,0.10),transparent_55%)]" />
    </>
  );
}

function BarberCard({
  barber,
  variant,
  delayMs = 0,
  show = false,
}: {
  barber: Barber;
  variant?: "tl" | "tr" | "bl" | "br";
  delayMs?: number;
  show?: boolean;
}) {
  // small stagger offsets to mimic the reference layout
  const offset =
    variant === "tr"
      ? "md:translate-y-8"
      : variant === "bl"
        ? "md:-translate-y-2"
        : variant === "br"
          ? "md:translate-y-10"
          : "";

  return (
    <div
      className={[
        "relative",
        offset,
        // reveal animation (staggered)
        "transition-all duration-700 ease-out will-change-transform",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {/* smaller circles (adjusted down from 230/260) */}
      <div className="relative mx-auto h-[180px] w-[180px] md:h-[210px] md:w-[210px]">
        <div className="absolute inset-0 rounded-full bg-black/25" />
        <Ring />

        <div className="group relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-black/30">
          <Image
            src={barber.img}
            alt={barber.name}
            fill
            className="object-cover grayscale contrast-125 brightness-[0.92] transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 180px, 210px"
          />

          {/* image vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
        </div>
      </div>

      <div className="mt-6 text-center md:text-left">
        <div className="text-white/90 font-[var(--font-heading)] text-2xl tracking-[0.04em]">
          {barber.name}
        </div>
      </div>
    </div>
  );
}

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect(); // reveal once
        }
      },
      {
        // start revealing a bit before it's fully in view
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Stagger: “row-by-row” feel when you have 3 columns (desktop).
  // We approximate 3-col timing; on mobile it still looks like one-by-one.
  const delays = useMemo(() => {
    const cols = 3;
    return BARBERS.map((_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      return row * 220 + col * 120; // tweak if you want faster/slower
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="team"
      className={[
        "relative mx-auto max-w-6xl px-6 pt-0 pb-16 md:pb-24",
        // section-level reveal (so it “doesn’t show” until scrolled to)
        "transition-all duration-700 ease-out",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      ].join(" ")}
    >
      {/* background texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/0" />
        <div className="absolute inset-0 [background:radial-gradient(70%_60%_at_50%_30%,rgba(212,175,55,0.08),transparent_60%)]" />
      </div>

      <div className="flex items-end justify-between gap-8">
        <div>
          <h2 className="mt-5 font-[var(--font-heading)] text-3xl text-white md:text-4xl">
            Meet the Barbers
          </h2>
          <p className="mt-3 max-w-2xl text-white/65 leading-relaxed">
            A calm, detail-first crew—clean fades, sharp line-ups, and consistent finishes.
          </p>
        </div>

        {/* vertical title on desktop (doesn't affect layout height) */}
        <div className="hidden md:block pointer-events-none absolute right-6 top-16">
          <div className="select-none text-white/10 font-[var(--font-heading)] text-6xl tracking-[0.08em] [writing-mode:vertical-rl] rotate-180">
            THE BARBERS
          </div>
        </div>
      </div>

      {/* 3 columns on desktop */}
      <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-x-10 md:gap-y-14">
        {BARBERS.map((barber, i) => (
          <BarberCard
            key={barber.name}
            barber={barber}
            variant={
              i === 0 ? "tl" : i === 1 ? "tr" : i === 2 ? "bl" : i === 3 ? "br" : "br"
            }
            show={inView}
            delayMs={delays[i]}
          />
        ))}
      </div>
    </section>
  );
}
