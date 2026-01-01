import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { RolexGalleryClient } from "@/components/RolexGalleryClient";
import { ServicesMenu } from "@/components/ServicesMenu";
import { GALLERY, SERVICES, SHOP } from "@/lib/site";
import { MagneticLink } from "@/components/MagneticLink";

export default function HomePage() {
  const PHONE_TEL = `tel:${SHOP.phone.replace(/[^\d]/g, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Barbershop",
    name: SHOP.name,
    telephone: SHOP.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "45553 Mound Rd",
      addressLocality: "Shelby Township",
      addressRegion: "MI",
      postalCode: "48317",
      addressCountry: "US",
    },
    url: "https://ng3barbershop.com",
    sameAs: [SHOP.maps],
  };

  return (
    <main id="main" className="grain min-h-screen">
      {/* LocalBusiness / SEO */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Skip link (keyboard accessibility) */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[999] rounded-2xl bg-white/10 px-4 py-3 text-sm text-white"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <a href="#content" className="flex items-center gap-3">
            <Image
              src="/images/logo.webp"
              alt="NG3 Barbershop logo"
              width={44}
              height={44}
              className="rounded-xl border border-white/10 bg-black/40"
              priority
            />
            <div className="leading-tight">
              <div className="font-[var(--font-heading)] tracking-[0.14em] text-sm">
                NG3 BARBERSHOP
              </div>
              <div className="text-white/55 text-xs">Shelby Township, MI</div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a className="link-underline hover:text-white transition" href="#services">
              Services
            </a>
            <a className="link-underline hover:text-white transition" href="#gallery">
              Gallery
            </a>
            <a className="link-underline hover:text-white transition" href="#location">
              Location
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              className="hidden sm:inline text-sm text-white/70 hover:text-white transition"
              href={PHONE_TEL}
            >
              {SHOP.phone}
            </a>

            {/* Desktop CTA */}
            <MagneticLink
              href="#book"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-[color:var(--gold)]/35 text-[color:var(--gold)] hover:bg-[color:var(--gold)]/10 transition"
            >
              Book Now
            </MagneticLink>

            {/* Mobile menu (no JS required) */}
            <details className="md:hidden relative">
              <summary className="list-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/80 hover:text-white hover:border-white/20 transition cursor-pointer select-none [&::-webkit-details-marker]:hidden">
                <span className="sr-only">Open menu</span>
                <div className="flex flex-col gap-1">
                  <span className="block h-[2px] w-5 bg-white/80" />
                  <span className="block h-[2px] w-5 bg-white/60" />
                  <span className="block h-[2px] w-5 bg-white/80" />
                </div>
              </summary>

              <div className="absolute right-0 mt-3 w-[260px] overflow-hidden rounded-2xl border border-white/10 bg-black/85 backdrop-blur shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
                <div className="p-3">
                  <a
                    className="block rounded-xl px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
                    href="#services"
                  >
                    Services
                  </a>
                  <a
                    className="block rounded-xl px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
                    href="#gallery"
                  >
                    Gallery
                  </a>
                  <a
                    className="block rounded-xl px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition"
                    href="#location"
                  >
                    Location
                  </a>

                  <div className="my-2 h-px bg-white/10" />

                  <a
                    className="block rounded-xl px-4 py-3 text-sm text-white/90 hover:bg-white/5 transition"
                    href={PHONE_TEL}
                  >
                    Call {SHOP.phone}
                  </a>

                  <a
                    className="mt-2 block rounded-xl px-4 py-3 text-sm text-black font-medium bg-[color:var(--gold)] hover:opacity-95 transition text-center"
                    href="#book"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>

      <div id="content">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0b0b0c]">
            <div className="absolute inset-0 hero-side-fade">
              <Image
                src="/images/hero.webp"
                alt="NG3 Barbershop — premium grooming"
                fill
                priority
                sizes="100vw"
                className="object-cover object-[55%_35%]"
              />
            </div>

            {/* Editorial overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_15%,rgba(212,175,55,0.10),transparent_52%)]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 md:pt-28 md:pb-20">
            <SectionReveal>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
                Precision. Consistency. Restraint.
              </div>

              <h1 className="mt-6 font-[var(--font-heading)] text-4xl md:text-6xl leading-[1.03] tracking-tight">
                Premium cuts.
                <span className="text-[color:var(--gold)]"> Luxury</span> finish.
              </h1>

              <p className="mt-5 max-w-2xl text-white/70 text-base md:text-lg leading-relaxed">
                Calm, high-end grooming—clean fades, sharp line-ups, and consistently refined results.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <MagneticLink href="#book" className="btn-primary">
                  Book Appointment
                </MagneticLink>

                <a href="#location" className="btn-secondary">
                  Get Directions
                </a>
              </div>

              <div className="mt-5 text-sm text-white/55">
                Walk-ins welcome • Appointments recommended
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <ServicesMenu services={SERVICES} />
        </section>

        {/* GALLERY */}
        <section id="gallery" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <RolexGalleryClient items={GALLERY} />
        </section>

        {/* BOOKING */}
        <section id="book" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <SectionReveal>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/6 to-white/3 p-8 md:p-12">
              <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
                APPOINTMENTS
              </div>
              <h2 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl">
                Book an appointment
              </h2>
              <p className="mt-3 text-white/70 max-w-2xl">
                Reserve your slot by phone. If you have a specific style in mind, mention it when you call.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href={PHONE_TEL} className="btn-primary">
                  Call to Book
                </a>

                <a
                  className="px-5 py-3 rounded-2xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition text-center"
                  href="#services"
                >
                  View Services
                </a>
              </div>

              <div className="mt-5 text-sm text-white/55">
                Please arrive a few minutes early for the smoothest experience.
              </div>
            </div>
          </SectionReveal>
        </section>

        {/* LOCATION */}
        <section id="location" className="mx-auto max-w-6xl px-5 pb-20 md:pb-28">
          <SectionReveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
                  VISIT
                </div>
                <h2 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl">
                  Visit NG3
                </h2>
                <p className="mt-3 max-w-2xl text-white/70">
                  Convenient location, clear hours, and a straightforward booking process.
                </p>
              </div>
              <div className="hidden md:block text-right text-white/50 text-sm">
                Tap “Open in Maps” for directions
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <div className="text-white/60 text-xs tracking-[0.22em]">ADDRESS</div>
                <div className="mt-2 text-lg">{SHOP.address}</div>

                <div className="mt-6 text-white/60 text-xs tracking-[0.22em]">HOURS</div>
                <div className="mt-3 space-y-2 text-white/75">
                  {SHOP.hours.map(([day, hours]) => (
                    <div key={day} className="flex justify-between gap-6">
                      <span>{day}</span>
                      <span className="text-white/60">{hours}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    className="btn-secondary"
                    href={SHOP.maps}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Maps
                  </a>
                  <a
                    className="px-5 py-3 rounded-2xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition text-center"
                    href={PHONE_TEL}
                  >
                    Call {SHOP.phone}
                  </a>
                </div>

                <div className="mt-6 text-sm text-white/55">
                  Parking available nearby • Walk-ins welcome
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                {/* Luxury overlay hairline + soft vignette */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/20" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-[color:var(--gold)]/15" />

                <div className="relative h-[420px]">
                  <iframe
                    title="NG3 Barbershop — Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2935.5365413349687!2d-83.05580512272327!3d42.62878421808017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824dd862446df3f%3A0x1d39a558937dca23!2sNG3!5e0!3m2!1sen!2sus!4v1767235218345!5m2!1sen!2sus"
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                {/* Bottom action bar */}
                <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-black/35 px-6 py-4">
                  <div className="text-white/70 text-sm">{SHOP.address}</div>

                  <a
                    href={SHOP.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-[color:var(--gold)]/35 bg-[color:var(--gold)]/10 px-4 py-2 text-sm text-[color:var(--gold)] hover:bg-[color:var(--gold)]/15 transition"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
            </div>
          </SectionReveal>
        </section>

        <footer className="border-t border-white/5">
          <div className="mx-auto max-w-6xl px-5 py-10 text-white/60 text-sm flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div>
              <span className="text-white/70">{SHOP.name}</span> · Shelby Township, MI
            </div>
            <div>© {new Date().getFullYear()} NG3. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </main>
  );
}
