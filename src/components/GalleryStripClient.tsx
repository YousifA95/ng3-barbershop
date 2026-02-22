"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type GalleryImage = { src: string; alt?: string };

export default function GalleryStripClient({
    images,
    className = "",
}: {
    images: GalleryImage[];
    className?: string;
}) {
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const [index, setIndex] = useState(0);

    const scrollToIndex = (newIndex: number) => {
        const el = scrollerRef.current;
        if (!el) return;

        const tiles = el.querySelectorAll<HTMLElement>("[data-tile]");
        if (!tiles.length) return;

        // LOOPING LOGIC
        if (newIndex < 0) {
            newIndex = tiles.length - 1;
        }
        if (newIndex >= tiles.length) {
            newIndex = 0;
        }

        setIndex(newIndex);

        tiles[newIndex].scrollIntoView({
            behavior: "smooth",
            inline: "start",
            block: "nearest",
        });
    };

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

            {/* Filmstrip */}
            <div
                ref={scrollerRef}
                className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-16 py-6"
            >
                {images.map((img, i) => (
                    <div
                        key={img.src + i}
                        data-tile
                        className="relative snap-start shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                        style={{
                            width: "min(300px, 68vw)", // adjust if you want more/less tiles visible
                            aspectRatio: "2 / 3",
                        }}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt ?? "Gallery image"}
                            fill
                            sizes="(max-width: 768px) 76vw, 420px"
                            className="object-cover"
                            priority={i < 2}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
                    </div>
                ))}
            </div>
        </div>
    );
}
