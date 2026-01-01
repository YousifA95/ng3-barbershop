"use client";

import React, { useRef } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  strength?: number;
};

export function MagneticButton({ strength = 18, className = "", ...props }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);

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
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={
        "transition-transform duration-200 will-change-transform " + className
      }
      {...props}
    />
  );
}
