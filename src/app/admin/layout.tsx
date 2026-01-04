import type { Metadata } from "next";
import { SHOP } from "@/lib/site";

const baseUrl = new URL(SHOP.url);

export const metadata: Metadata = {
  title: "Admin | NG3 Barbershop",
  description: "Administrator access for NG3 Barbershop.",
  alternates: { canonical: "/admin" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nocache: true,
    },
  },
  openGraph: {
    title: "Admin | NG3 Barbershop",
    description: "Administrator access for NG3 Barbershop.",
    url: new URL("/admin", baseUrl).toString(),
    siteName: "NG3 Barbershop",
    type: "website",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
