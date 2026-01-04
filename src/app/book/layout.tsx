import type { Metadata } from "next";
import { SHOP } from "@/lib/site";

const baseUrl = new URL(SHOP.url);

export const metadata: Metadata = {
  title: "Book Appointment | NG3 Barbershop",
  description:
    "Request an appointment at NG3 Barbershop in Shelby Township, MI. Choose your service, barber, and time—then we’ll confirm by phone.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book Appointment | NG3 Barbershop",
    description:
      "Request an appointment—choose service, barber, and time. We’ll confirm by phone.",
    url: new URL("/book", baseUrl).toString(),
    siteName: "NG3 Barbershop",
    type: "website",
    images: [
      {
        url: new URL("/images/hero.webp", baseUrl).toString(),
        width: 1200,
        height: 630,
        alt: "NG3 Barbershop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Appointment | NG3 Barbershop",
    description:
      "Request an appointment—choose service, barber, and time. We’ll confirm by phone.",
    images: [new URL("/images/hero.webp", baseUrl).toString()],
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
