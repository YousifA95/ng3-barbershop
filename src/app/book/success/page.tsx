import { SHOP } from "@/lib/site";

export default function BookingSuccessPage() {
  return (
    <main className="grain min-h-screen">
      <section className="mx-auto max-w-3xl px-5 py-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 text-center">
          <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
            REQUESTED
          </div>
          <h1 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl text-white">
            Requested successfully — we’ll confirm by phone
          </h1>
          <p className="mt-4 text-white/70 leading-relaxed">
            If you don’t hear back, please call NG3 at{" "}
            <a className="text-white underline underline-offset-4" href={`tel:${SHOP.phone.replace(/[^\d]/g, "")}`}>
              {SHOP.phone}
            </a>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="btn btn-primary justify-center">
              Return Home
            </a>
            <a href="/book" className="btn btn-secondary justify-center">
              Request Another
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
