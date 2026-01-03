"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

export function AdminIdleTimer({ minutes = 5 }: { minutes?: number }) {
  const timeoutMs = minutes * 60 * 1000;
  const tRef = useRef<number | null>(null);

  function reset() {
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => {
      signOut({ callbackUrl: "/" });
    }, timeoutMs);
  }

  useEffect(() => {
    reset();

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    const onActivity = () => reset();

    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
