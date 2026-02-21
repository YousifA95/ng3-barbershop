import "./globals.css";
import Providers from "./providers";
import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import { ComingSoonOverlay } from "@/components/ComingSoonOverlay";
import { SHOP } from "@/lib/site";
import Script from "next/script";
import IntroSplash from "@/components/IntroSplash";

const heading = Cinzel({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SHOP.url),
  title: {
    default: "NG3 Barbershop | Shelby Township",
    template: "%s | NG3 Barbershop",
  },
  description:
    "Luxury grooming experience in Shelby Township, MI. Book premium cuts and beard services.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";

  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <head>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  anonymize_ip: true
                });
              `}
            </Script>
          </>
        )}
      </head>

      <body>
        <IntroSplash />
        <Providers>{children}</Providers>
        {comingSoon && <ComingSoonOverlay />}
      </body>
    </html>
  );
}
