import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { RolexGalleryClient } from "@/components/RolexGalleryClient";
import { ServicesMenu } from "@/components/ServicesMenu";
import { GALLERY, SERVICES, SHOP } from "@/lib/site";
import { MagneticLink } from "@/components/MagneticLink";

export default function HomePage() {
  return (
    <main className="grain min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur border-b border-white/5 bg-black/30">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a className="hover:text-white transition" href="#services">
              Services
            </a>
            <a className="hover:text-white transition" href="#gallery">
              Gallery
            </a>
            <a className="hover:text-white transition" href="#location">
              Location
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              className="hidden sm:inline text-sm text-white/70 hover:text-white transition"
              href={`tel:${SHOP.phone.replace(/[^\d]/g, "")}`}
            >
              {SHOP.phone}
            </a>

            {/* Use a link (no onClick) to avoid Server -> Client prop passing */}
            <MagneticLink
              href="#book"
              className="px-4 py-2 rounded-xl border border-[color:var(--gold)]/35 text-[color:var(--gold)] hover:bg-[color:var(--gold)]/10 transition"
            >
              Book Now
            </MagneticLink>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]">
        <div className="absolute inset-0 hero-side-fade">
          <Image
            src="/images/hero.webp"
            alt="NG3 Barbershop — premium grooming"
            fill
            priority
            className="object-cover object-[55%_35%] scale-[1]"
          />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 md:pt-28 md:pb-20">
          <SectionReveal>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
              Premium grooming, executed with restraint
            </div>

            <h1 className="mt-6 font-[var(--font-heading)] text-4xl md:text-6xl leading-tight tracking-tight">
              Precision cuts.
              <span className="text-[color:var(--gold)]"> Luxury</span> finish.
            </h1>

            <p className="mt-5 max-w-2xl text-white/70 text-base md:text-lg leading-relaxed">
              A calm, high-end experience—clean fades, sharp line-ups, and consistent results.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {/* Link instead of button+onClick */}
              <MagneticLink
                href="#book"
                className="px-5 py-3 rounded-2xl bg-[color:var(--gold)] text-black font-medium hover:opacity-95 transition text-center"
              >
                Book Appointment
              </MagneticLink>

              <a
                href="#location"
                className="inline-flex items-center justify-center rounded-2xl border border-[color:var(--gold)]/35 bg-[color:var(--gold)]/10 px-5 py-3 text-[color:var(--gold)] hover:bg-[color:var(--gold)]/15 transition"
              >
                Get Directions
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="mx-auto max-w-6xl px-5 py-16 md:py-24"
      >
        <ServicesMenu services={SERVICES} />
      </section>

      {/* GALLERY */}
      <section id="gallery" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
        <RolexGalleryClient items={GALLERY} />
      </section>

      {/* BOOKING PLACEHOLDER */}
      <section id="book" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
        <SectionReveal>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/6 to-white/3 p-8 md:p-12">
            <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl">
              Book an appointment
            </h2>
            <p className="mt-3 text-white/70 max-w-2xl">
              Next phase: connect booking (Square/Squire/embed or fully custom). For now, call or
              tap “Book Now” to jump here.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {/* Keep as a link for now; later this can become a real booking link/embed */}
              <MagneticLink
                href="#book"
                className="px-5 py-3 rounded-2xl bg-[color:var(--gold)] text-black font-medium hover:opacity-95 transition text-center"
              >
                Booking Coming Here
              </MagneticLink>

              <a
                className="px-5 py-3 rounded-2xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition text-center"
                href={`tel:${SHOP.phone.replace(/[^\d]/g, "")}`}
              >
                Call {SHOP.phone}
              </a>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* LOCATION */}
      <section id="location" className="mx-auto max-w-6xl px-5 pb-20 md:pb-28">
        <SectionReveal>
          <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl">
            Visit NG3
          </h2>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <div className="text-white/60 text-xs tracking-[0.22em]">
                ADDRESS
              </div>
              <div className="mt-2 text-lg">{SHOP.address}</div>

              <div className="mt-6 text-white/60 text-xs tracking-[0.22em]">
                HOURS
              </div>
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
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 transition text-center"
                  href={SHOP.maps}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Maps
                </a>
                <a
                  className="px-5 py-3 rounded-2xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition text-center"
                  href={`tel:${SHOP.phone.replace(/[^\d]/g, "")}`}
                >
                  Call {SHOP.phone}
                </a>
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

              {/* Bottom action bar (optional but premium) */}
              <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-black/35 px-6 py-4">
                <div className="text-white/70 text-sm">
                  45553 Mound Rd, Shelby Township, MI 48317
                </div>

                <a
                  href="https://maps.app.goo.gl/Cfv5qyijnuFYV2D6A"
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
    </main>
  );
}
