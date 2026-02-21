"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function LogoHomeLink() {
  const pathname = usePathname();

  const onClick = (e: React.MouseEvent) => {
    // If already on homepage, smooth scroll instead of navigating
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-3">
      <Image
        src="/images/logo.webp"
        alt="NG3 Barbershop"
        width={38}
        height={38}
        className="rounded-xl border border-white/10 bg-black/30"
      />
      <div className="leading-tight">
        <div className="text-white/90 font-[var(--font-heading)] tracking-[0.06em]">
          NG3
        </div>
        <div className="text-white/55 text-xs tracking-[0.28em]">
          BARBERSHOP
        </div>
      </div>
    </Link>
  );
}
