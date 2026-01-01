"use client";

import { motion } from "framer-motion";

export function ComingSoonOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Blur + dim background */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-xl" />

      {/* Subtle luxury grain (optional feel) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.18) 0, rgba(255,255,255,0) 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12) 0, rgba(255,255,255,0) 40%)",
        }}
      />

      {/* Card */}
      <div className="relative mx-5 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a]/70 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        {/* Gold hairline accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-[color:var(--gold)]/45" />

        <div className="px-8 py-10 md:px-12 md:py-12 text-center">
          <div className="text-[color:var(--gold)] text-2xl tracking-[0.38em]">
            NG3<br/>BARBERSHOP
          </div>

          <h1 className="mt-4 font-[var(--font-heading)] text-3xl md:text-5xl text-white">
            COMING SOON
          </h1>

          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-white/10" />
            <div className="h-[2px] w-10 bg-[color:var(--gold)]/55" />
            <div className="h-px w-16 bg-white/10" />
          </div>

          <div className="mt-8 text-white/60 text-sm">
            45553 Mound Rd, Shelby Township, MI 48317 · (586) 884-4280
          </div>
        </div>
      </div>
    </motion.div>
  );
}
