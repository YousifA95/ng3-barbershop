import "./globals.css";
import Providers from "./providers";
import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import { ComingSoonOverlay } from "@/components/ComingSoonOverlay";

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
  title: "NG3 Barbershop | Shelby Township",
  description:
    "Luxury grooming experience in Shelby Township, MI. Book premium cuts and beard services.",
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
