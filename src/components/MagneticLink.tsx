"use client";

import React, { useRef } from "react";

type MagneticLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  strength?: number;
  ariaLabel?: string; // allows ariaLabel="..." in page.tsx
} & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
>;

export function MagneticLink({
  href,
  children,
  className = "",
  strength = 18,
  ariaLabel,
  ...rest
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);

    el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label={ariaLabel}
      className={
        "inline-block transition-transform duration-200 will-change-transform " +
        className
      }
      {...rest}
    >
      {children}
    </a>
  );
}
