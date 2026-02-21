"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function IntroSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Prevent browser from restoring previous scroll position
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Respect reduced motion users
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const durationMs = prefersReduced ? 250 : 2000;

    const t = window.setTimeout(() => {
      // Ensure page starts at top after intro
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });

      setShow(false);
    }, durationMs);

    return () => window.clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] grid place-items-center bg-black"
    >
      {/* Subtle gold bloom + vignette */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_45%,rgba(212,175,55,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

      {/* Content */}
      <div className="relative flex flex-col items-center">
        <div className="introLogo relative h-20 w-20 md:h-24 md:w-24">
          <Image
            src="/images/logo.webp"
            alt=""
            fill
            priority
            className="object-contain"
          />
        </div>

        <div className="mt-5 introWordmark text-white/80 font-[var(--font-heading)] tracking-[0.30em] text-sm">
          NG3 BARBERSHOP
        </div>

        {/* Thin line accent */}
        <div className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-white/15 to-transparent introLine" />
      </div>

      {/* Fade-out curtain */}
      <div className="introFade absolute inset-0 bg-black" />
    </div>
  );
}