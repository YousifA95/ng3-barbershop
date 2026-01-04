"use client";

import Script from "next/script";
import React, { useEffect, useRef } from "react";

export default function TurnstileWidget({
  sitekey,
  onToken,
  className = "",
}: {
  sitekey: string;
  onToken: (token: string) => void;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const tryRender = () => {
      if (!window.turnstile) return;
      if (widgetIdRef.current != null) return; // already rendered

      widgetIdRef.current = window.turnstile.render(el, {
        sitekey,
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };

    // Try immediately, then poll briefly until script loads
    tryRender();
    intervalRef.current = window.setInterval(tryRender, 50);

    return () => {
      if (intervalRef.current != null) window.clearInterval(intervalRef.current);
      intervalRef.current = null;

      if (window.turnstile && widgetIdRef.current != null) {
        // remove is optional in our type
        window.turnstile.remove?.(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [sitekey, onToken]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div ref={hostRef} className={className} />
    </>
  );
}
