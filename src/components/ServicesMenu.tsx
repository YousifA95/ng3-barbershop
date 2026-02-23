import { SectionReveal } from "@/components/SectionReveal";
import type { Service } from "@/lib/site";

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

/**
 * Heuristic fallback so this component still behaves sensibly even if the
 * data isn't categorized yet.
 */
function inferCategory(name: string): "core" | "addon" {
  const n = name.toLowerCase();
  const addonHints = ["wax", "blade", "eyebrow", "dye", "line", "line-up", "line up"];
  // Beard-only services are typically add-ons unless paired with haircut.
  const beardOnly = n.includes("beard") && !n.includes("haircut");
  if (beardOnly) return "addon";
  if (addonHints.some((h) => n.includes(h))) return "addon";
  return "core";
}

export function ServicesMenu({ services }: { services: Service[] }) {
  const normalized = services.map((s) => ({
    ...s,
    category: (s.category ?? inferCategory(s.name)) as "core" | "addon",
  }));

  const core = normalized.filter((s) => s.category === "core");
  const addons = normalized.filter((s) => s.category === "addon");

  // Featured only applies within core services (signature tier).
  const signature = core.filter((s) => s.featured);
  const coreRest = core.filter((s) => !s.featured);

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
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* Core Services */}
          <div className="rounded-3xl border border-[color:var(--gold)]/18 bg-gradient-to-b from-[color:var(--gold)]/8 to-white/3 p-6 md:p-8">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
                  CORE SERVICES
                </div>
                <div className="mt-2 text-white/70 text-sm">
                  Modern barbering. Classic discipline.
                </div>
              </div>
            </div>

            {/* Signature */}
            {signature.length > 0 && (
              <div className="mt-6">
                <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
                  SIGNATURE
                </div>

                <div className="mt-4 divide-y divide-white/10">
                  {signature.map((s) => (
                    <div
                      key={s.name}
                      className="py-5 flex items-center justify-between gap-6"
                    >
                      <div className="min-w-0">
                        <div className="text-white/90 font-medium truncate">
                          {s.name}
                        </div>
                        <div className="mt-1 text-white/55 text-sm">
                          {s.minutes} min
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="hidden sm:block h-[1px] w-16 bg-[color:var(--gold)]/50" />
                        <div className="text-[color:var(--gold)] font-semibold tabular-nums">
                          {money(s.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rest of Core */}
            {coreRest.length > 0 && (
              <div className={signature.length > 0 ? "mt-6" : "mt-2"}>
                <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">
                  ELEGANCE PACKAGE
                </div>
                <div className="mt-0 divide-y divide-white/10">
                  {coreRest.map((s) => (
                    <div
                      key={s.name}
                      className="py-5 flex items-center justify-between gap-6"
                    >
                      <div className="min-w-0">
                        <div className="text-white/85 truncate">{s.name}</div>
                        <div className="mt-1 text-white/55 text-sm">
                          {s.minutes} min - Precision haircut, detailed beard shaping, eyebrow cleanup, hot towel treatment, razor detailing, and finished styling.
                        </div>
                      </div>

                      <div className="text-[color:var(--gold)] font-medium tabular-nums shrink-0">
                        {money(s.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add-ons */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <div className="text-white/60 text-xs tracking-[0.30em]">
              ADD-ONS
            </div>
            <div className="mt-2 text-white/70 text-sm">
              Quick refinements that elevate the finish.
            </div>

            <div className="mt-5 divide-y divide-white/10">
              {addons.map((s) => (
                <div
                  key={s.name}
                  className="py-5 flex items-center justify-between gap-6"
                >
                  <div className="min-w-0">
                    <div className="text-white/85 truncate">{s.name}</div>
                    <div className="mt-1 text-white/55 text-sm">
                      {s.minutes} min
                    </div>
                  </div>
                  <div className="text-white/85 font-medium tabular-nums shrink-0">
                    {money(s.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
