"use client";

import { useState } from "react";

export default function ExpandableMap({
  src,
}: {
  src: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="sm:col-span-2 mt-2">
      <button
        type="button"
        aria-label={expanded ? "Collapse map" : "Expand map"}
        onClick={() => setExpanded((v) => !v)}
        className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30
                   shadow-[0_0_60px_rgba(212,175,55,0.08)]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
      >
        <iframe
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
          className={[
            "w-full transition-all duration-700",
            expanded ? "h-[560px] md:h-[620px]" : "h-[320px] md:h-[380px]",
          ].join(" ")}
        />

        {/* Theme tint overlay */}
        <div className="pointer-events-none absolute inset-0 bg-black/25 mix-blend-multiply transition group-hover:bg-black/15" />

        {/* Hint pill */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2
                        rounded-full border border-white/15 bg-black/40 px-4 py-1 text-[11px]
                        tracking-[0.25em] text-white/70 backdrop-blur-sm transition
                        group-hover:border-[color:var(--gold)]/35 group-hover:text-white/80"
        >
          {expanded ? "TAP TO COLLAPSE" : "TAP TO EXPAND"}
        </div>
      </button>

      <div className="mt-3 text-xs text-white/55 tracking-[0.12em]">
        Tip: Tap the map to expand, then pinch/drag to explore.
      </div>
    </div>
  );
}
