import "./globals.css";
import Providers from "./providers";
import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import { ComingSoonOverlay } from "@/components/ComingSoonOverlay";
import { SHOP } from "@/lib/site";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";

  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <Providers>{children}</Providers>
        {comingSoon && <ComingSoonOverlay />}
      </body>
    </html>
  );
}
