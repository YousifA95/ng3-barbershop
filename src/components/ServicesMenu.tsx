import { SectionReveal } from "@/components/SectionReveal";
import type { Service } from "@/lib/site";

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function ServicesMenu({ services }: { services: Service[] }) {
  const featured = services.filter((s) => s.featured);
  const rest = services.filter((s) => !s.featured);

  return (
    <SectionReveal>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4">
          <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
            SERVICES
          </div>
          <h2 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl">
            Menu
          </h2>
          <p className="mt-3 text-white/70 leading-relaxed">
            Transparent pricing. Precise timing. Premium finish.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-white/60 text-xs tracking-[0.22em]">NOTE</div>
            <div className="mt-2 text-white/80 text-sm">
              Arrive 5 minutes early to preserve schedule precision.
            </div>
            <div className="mt-2 text-white/60 text-sm">
              Booking and deposits will be enabled in the next phase.
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {/* Featured */}
          <div className="rounded-3xl border border-[color:var(--gold)]/18 bg-gradient-to-b from-[color:var(--gold)]/8 to-white/3 p-6 md:p-8">
            <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
              SIGNATURE
            </div>

            <div className="mt-5 divide-y divide-white/10">
              {featured.map((s) => (
                <div key={s.name} className="py-5 flex items-center justify-between gap-6">
                  <div>
                    <div className="text-white/90 font-medium">{s.name}</div>
                    <div className="mt-1 text-white/55 text-sm">{s.minutes} min</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block h-[1px] w-16 bg-[color:var(--gold)]/50" />
                    <div className="text-[color:var(--gold)] font-semibold">
                      {money(s.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rest */}
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <div className="text-white/60 text-xs tracking-[0.30em]">ADDITIONAL</div>
            <div className="mt-5 divide-y divide-white/10">
              {rest.map((s) => (
                <div key={s.name} className="py-5 flex items-center justify-between gap-6">
                  <div>
                    <div className="text-white/85">{s.name}</div>
                    <div className="mt-1 text-white/55 text-sm">{s.minutes} min</div>
                  </div>
                  <div className="text-white/80 font-medium">{money(s.price)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
