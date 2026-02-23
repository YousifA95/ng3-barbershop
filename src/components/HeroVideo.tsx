"use client";

export default function HeroVideo() {
  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden">
      {/* Blurred background fill */}
      <video
        className="absolute inset-0 h-full w-full object-cover scale-110 blur-xl opacity-40"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Main video */}
      <video
        className="absolute inset-0 h-full w-full object-contain object-center"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />
      <div className="absolute inset-0 [background:radial-gradient(60%_60%_at_50%_35%,rgba(212,175,55,0.14),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pt-24 pb-32">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.28em] text-white/70">
            • Precision. Consistency. Restraint.
          </div>

          <h1 className="mt-6 font-[var(--font-heading)] text-4xl leading-[1.05] text-white md:text-6xl">
            Premium cuts. <span className="text-white/85">Luxury finish.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Calm, high-end grooming—clean fades, sharp line-ups, and consistently refined results.
          </p>

          {/* Scroll cue: aligned with text */}
          <div className="mt-8 flex justify-center">
            <a
              href="#gallery"
              aria-label="Scroll to Gallery"
              className="group inline-flex flex-col items-center
             px-12 py-6
             rounded-full
             transition-all duration-300
             hover:bg-white/[0.04]
             hover:translate-y-[1px]
             focus:outline-none
             focus-visible:ring-2
             focus-visible:ring-[color:var(--gold)]/60"
            >
              <span
                className="text-[11px] uppercase tracking-[0.32em]
               text-white/70
               transition
               group-hover:text-white"
              >
                Explore NG3
              </span>

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="mt-4 text-white/60 transition-all duration-300
               group-hover:text-[color:var(--gold)]"
                aria-hidden="true"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-heroFloat"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
