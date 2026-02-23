import type { Metadata } from "next";
import HeroVideo from "@/components/HeroVideo";

import { SectionReveal } from "@/components/SectionReveal";
import GalleryStripClient from "@/components/GalleryStripClient";
import { ServicesMenu } from "@/components/ServicesMenu";
import { MagneticLink } from "@/components/MagneticLink";
import { GALLERY, SERVICES, SHOP } from "@/lib/site";
import LogoHomeLink from "@/components/LogoHomeLink";
import TeamSection from "@/components/TeamSection";

export const metadata: Metadata = {
  metadataBase: new URL(SHOP.url),
  title: "NG3 Barbershop | Shelby Township, MI",
  description:
    "Premium cuts. Luxury finish. Calm, high-end grooming—clean fades, sharp line-ups, and consistently refined results.",
  openGraph: {
    title: "NG3 Barbershop",
    description:
      "Premium cuts. Luxury finish. Calm, high-end grooming—clean fades, sharp line-ups, and consistently refined results.",
    url: "/",
    siteName: "NG3 Barbershop",
    images: [
      {
        url: `${SHOP.url}/images/og.jpg`,
        width: 1200,
        height: 630,
        alt: "NG3 Barbershop — Shelby Township, MI",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    images: ["/images/og.jpg"],
  },

  alternates: {
    canonical: "/",
  },
};

const dayMap: Record<string, string> = {
  Monday: "Mo",
  Tuesday: "Tu",
  Wednesday: "We",
  Thursday: "Th",
  Friday: "Fr",
  Saturday: "Sa",
  Sunday: "Su",
};

function convertTo24(time: string) {
  const [h, period] = time.split(" ");
  let hour = parseInt(h, 10);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:00`;
}

function buildLocalBusinessJsonLd() {
  const openingHours = SHOP.hours
    .filter(([, h]) => !h.toLowerCase().includes("closed"))
    .map(([day, hours]) => {
      const [start, end] = hours.split(" – ");

      return `${dayMap[day]} ${convertTo24(start)}-${convertTo24(end)}`;
    });
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SHOP.name,
    url: SHOP.url,
    telephone: SHOP.phone,
    image: [`${SHOP.url}/images/og.jpg`],
    logo: `${SHOP.url}/images/logo.png`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "45553 Mound Rd",
      addressLocality: "Shelby Township",
      addressRegion: "MI",
      postalCode: "48317",
      addressCountry: "US",
    },
    openingHours,
    sameAs: [SHOP.instagram],
  };
}

export default function HomePage() {
  const desktopReviewUrl = SHOP.placeidDesk;

  const mobileReviewUrl = SHOP.placeidMobile;

  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const reviewUrl = isMobile ? mobileReviewUrl : desktopReviewUrl;

  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <main className="grain min-h-screen">
      {/* LocalBusiness structured data */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur border-b border-white/5 bg-black/30">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hero */}
            <LogoHomeLink />
          </div>

          {/* Desktop nav */}

          <div className="flex items-center gap-3">
            <a
              className="hidden sm:inline text-sm text-white/70 hover:text-white transition"
              href={`tel:${SHOP.phone.replace(/[^\d]/g, "")}`}
            >
              {SHOP.phone}
            </a>

            <MagneticLink
              href="#appointments"
              className="btn btn-primary px-3 py-2 text-sm md:px-5 md:py-3 md:text-base"
              ariaLabel="Book now"
            >
              Book Now
            </MagneticLink>

            {/* Mobile menu (CSS-only, no JS) */}
            <details className="md:hidden group relative">
              <summary className="btn btn-secondary w-16 px-3 py-2 cursor-pointer list-none">
                <span className="sr-only">Open menu</span>
                <span aria-hidden className="text-sm text-white/80">
                  <a
                    href={`tel:${SHOP.phone.replace(/[^\d]/g, "")}`}
                    className="text-sm text-white/80 tracking-wider"
                  >
                    Call
                  </a>
                </span>
              </summary>
            </details>
          </div>
        </div>
      </header>

      <HeroVideo />

      {/* Section separator (Gallery) */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-4 md:pt-28 md:pb-14">
        <div className="flex items-center gap-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="text-[11px] uppercase tracking-[0.38em] text-white/45">
            The Experience
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* GALLERY */}
      <section id="gallery" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
        <SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-5">
              <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
                LOOKBOOK
              </div>
              <h2 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl">
                Gallery
              </h2>
              <p className="mt-3 text-white/70 leading-relaxed">
                Precision fades, clean line work, and a premium finish—captured
                with restraint.
              </p>
            </div>
          </div>
          <section id="gallery" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <GalleryStripClient images={GALLERY} className="mt-1" />
          </section>
        </SectionReveal>
      </section>

      {/* Section separator (Services) */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-4 md:pt-0 md:pb-8">
        <div className="flex items-center gap-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="text-[11px] uppercase tracking-[0.38em] text-white/45">
            THE SERVICES
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-16 md:py-24">
        <ServicesMenu services={SERVICES} />
      </section>

      {/* Section separator (Team) */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-4 md:pt-14 md:pb-14">
        <div className="flex items-center gap-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="text-[11px] uppercase tracking-[0.38em] text-white/45">
            The Team
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* Team */}
      <TeamSection />

      {/* Section separator (Appointments) */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-4 md:pt-20 md:pb-20">
        <div className="flex items-center gap-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="text-[11px] uppercase tracking-[0.38em] text-white/45">

          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* APPOINTMENTS */}
      <section id="appointments" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
        <SectionReveal>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
            <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
              APPOINTMENTS
            </div>
            <h2 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl">
              Book an appointment
            </h2>

            <p className="mt-3 text-white/70 leading-relaxed max-w-2xl">
              Request your slot online, or reserve by phone. If you have a specific style in mind,
              mention it when you call.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <MagneticLink
                href={SHOP.booksy}
                target="_blank"
                className="btn btn-primary"
                ariaLabel="Book online"
              >
                Book Online
              </MagneticLink>

              <MagneticLink
                href={`tel:${SHOP.phone.replace(/[^\d]/g, "")}`}
                className="btn btn-secondary"
                ariaLabel="Call to book"
              >
                Call to Book
              </MagneticLink>

              <MagneticLink
                href="#services"
                className="btn btn-secondary"
                ariaLabel="View services"
              >
                View Services
              </MagneticLink>
            </div>

            <div className="mt-6 text-sm text-white/65">
              Please arrive a few minutes early for the smoothest experience.
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* LOCATION */}
      <section id="location" className="mx-auto max-w-6xl px-5 pb-20 md:pb-28">
        <SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
                VISIT
              </div>
              <h2 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl">
                Visit NG3
              </h2>
              <p className="mt-3 text-white/70 leading-relaxed">
                Convenient location, clear hours, and a straightforward booking
                process.
              </p>

              <div className="mt-6 text-sm text-white/60">
                Tap “Open in Maps” for directions
              </div>
            </div>

            <div className="md:col-span-7 rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                {/* ADDRESS */}
                <div>
                  <div className="text-white/60 text-xs tracking-[0.30em]">
                    ADDRESS
                  </div>
                  <div className="mt-3 text-white/85">{SHOP.address}</div>
                </div>

                {/* HOURS */}
                <div>
                  <div className="text-white/60 text-xs tracking-[0.30em]">
                    HOURS
                  </div>
                  <div className="mt-3 space-y-2 text-white/80 text-sm">
                    {SHOP.hours.map(([day, hours]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="text-white/70">{day}</span>
                        <span className="tabular-nums">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <MagneticLink
                  href={SHOP.maps}
                  className="btn btn-secondary"
                  ariaLabel="Open in maps"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Open in Maps
                </MagneticLink>
                <MagneticLink
                  href={`tel:${SHOP.phone.replace(/[^\d]/g, "")}`}
                  className="btn btn-primary"
                  ariaLabel="Call"
                >
                  Call {SHOP.phone}
                </MagneticLink>
              </div>

              <div className="mt-6 text-sm text-white/65">
                Parking available nearby • Walk-ins welcome
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* RATE US (Premium Card) */}
        <section className="mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
              <h3 className="font-[var(--font-heading)] text-2xl tracking-[0.12em] text-white/85">
                Enjoyed Your Visit?
              </h3>

              <div className="mt-4 flex justify-center gap-1 text-[color:var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                    fill="currentColor"
                    className="drop-shadow-[0_0_10px_rgba(212,175,55,0.18)]"
                  >
                    <path d="M12 17.3 6.8 20l1-5.9L3.5 9.9l6-.9L12 3.6l2.5 5.4 6 .9-4.3 4.2 1 5.9z" />
                  </svg>
                ))}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-white/55">
                Your feedback helps others discover NG3 Barbershop. If you enjoyed your
                experience, we&apos;d appreciate a quick review on Google.
              </p>

              <div className="mt-7 flex justify-center">
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-[var(--font-heading)] tracking-[0.08em] text-white/80 transition hover:border-[color:var(--gold)]/45 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
                  aria-label="Rate NG3 Barbershop on Google"
                >
                  Rate Us on Google
                  <span className="ml-2 inline-block translate-x-0 transition group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>

              <div className="mt-4 text-xs text-white/40">
                Takes ~15 seconds. We read every review.
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/5 pt-10 text-center text-sm text-white/55">
          <div className="text-white/70 font-[var(--font-heading)] tracking-[0.08em]">
            NG3 Barbershop · Shelby Township, MI
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            {/* Instagram */}
            <a
              href={SHOP.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="NG3 Barbershop on Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:border-[color:var(--gold)]/35 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
                <path
                  d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M17.5 6.5h.01"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={SHOP.facebook}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="NG3 Barbershop on Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:border-[color:var(--gold)]/35 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
                <path
                  d="M14 8.5V7.3c0-.9.6-1.3 1.3-1.3H17V3h-2.2C12.8 3 12 4.4 12 6.8V8.5H10v3h2V21h3v-9.5h2.2l.8-3H15Z"
                  fill="currentColor"
                />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@ng3barbershop"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="NG3 Barbershop on TikTok"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:border-[color:var(--gold)]/35 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
                <path d="M14.5 3c.3 2 1.4 3.5 3.3 4.2.7.3 1.5.4 2.2.4v3.1c-1 0-2-.2-2.9-.6v5.8c0 3.1-2.5 5.6-5.6 5.6S6 19 6 15.9s2.5-5.6 5.6-5.6c.3 0 .6 0 .9.1v3.2a2.4 2.4 0 1 0 1.9 2.3V3h.1z" />
              </svg>
            </a>
          </div>

          <div className="mt-4">
            © {new Date().getFullYear()} NG3. All rights reserved.
          </div>
        </footer>

      </section>
    </main>
  );
}
