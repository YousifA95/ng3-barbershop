import type { Metadata } from "next";
import { SHOP } from "@/lib/site";

const baseUrl = new URL(SHOP.url);

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Request an appointment at NG3 Barbershop in Shelby Township, MI. Choose your service, barber, and time—then we’ll confirm by phone.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book Appointment | NG3 Barbershop",
    description:
      "Request an appointment—choose service, barber, and time. We’ll confirm by phone.",
    url: "/book", // ✅ route-based
    siteName: "NG3 Barbershop",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/hero.webp", // ✅ route-based
        width: 1200,
        height: 630,
        alt: "NG3 Barbershop",
      },
    ],
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
