export default function BookingSuccessPage() {
  return (
    <main className="grain min-h-screen">
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-20">
        <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">CONFIRMATION</div>

        <h1 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl text-white">
          Requested successfully — we’ll confirm by phone
        </h1>

        <p className="mt-4 text-white/70 leading-relaxed">
          Call NG3 at{" "}
          <a className="text-white underline decoration-white/25 underline-offset-4" href="tel:+15868844280">
            (586) 884-4280
          </a>{" "}
          if you don’t hear back.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <a href="/" className="btn btn-primary justify-center">
            Back to Home
          </a>

          <a href="/book" className="btn btn-secondary justify-center">
            Request Another
          </a>
        </div>
      </section>
    </main>
  );
}
