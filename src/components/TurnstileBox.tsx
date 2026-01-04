"use client";

import Script from "next/script";
import React, { useEffect, useRef } from "react";

export default function TurnstileBox({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);

  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!sitekey) return;

    const el = boxRef.current;
    if (!el) return;

    const tryRender = () => {
      if (!window.turnstile) return;
      if (widgetIdRef.current != null) return; // already rendered

      // Ensure container is clean (prevents weird duplicate DOM in dev)
      el.innerHTML = "";

      widgetIdRef.current = window.turnstile.render(el, {
        sitekey,
        theme: "dark",
        size: "normal",
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };

    tryRender();
    const t = window.setInterval(tryRender, 50);

    return () => {
      window.clearInterval(t);

      if (window.turnstile && widgetIdRef.current != null) {
        window.turnstile.remove?.(widgetIdRef.current);
      }

      widgetIdRef.current = null;
      onToken(""); // clear token on unmount
    };
  }, [sitekey, onToken]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div ref={boxRef} />
    </>
  );
}
