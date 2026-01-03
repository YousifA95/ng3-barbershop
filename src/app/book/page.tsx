"use client";

import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { BARBERS, SERVICES, TZ, HOURS_BY_WEEKDAY, SLOT_MINUTES, LEAD_TIME_MINUTES, ceilToSlot } from "@/lib/booking";
import { TurnstileWidget } from "@/components/TurnstileWidget";

type Interval = { startISO: string; durationMinutes: number; status: "Requested" | "Confirmed" };

function timesForDay(dateISO: string, serviceMinutes: number) {
  const d = DateTime.fromISO(dateISO, { zone: TZ });
  const hours = HOURS_BY_WEEKDAY[d.weekday % 7]; // 0=Sun ... 6=Sat
  if (!hours) return [];

  const open = DateTime.fromISO(`${dateISO}T${hours.open}`, { zone: TZ });
  const close = DateTime.fromISO(`${dateISO}T${hours.close}`, { zone: TZ });

  const duration = ceilToSlot(serviceMinutes);
  const slots: string[] = [];
  let t = open;

  while (t.plus({ minutes: duration }) <= close) {
    if (t.minute % SLOT_MINUTES === 0) {
      slots.push(t.toFormat("HH:mm"));
    }
    t = t.plus({ minutes: SLOT_MINUTES });
  }
  return slots;
}

function overlaps(aStart: DateTime, aEnd: DateTime, bStart: DateTime, bEnd: DateTime) {
  return aStart < bEnd && bStart < aEnd;
}

export default function BookPage() {
  const [serviceName, setServiceName] = useState(SERVICES[0].name);
  const [barberId, setBarberId] = useState(BARBERS[0].id);
  const [date, setDate] = useState(DateTime.now().setZone(TZ).toISODate()!);
  const [time, setTime] = useState<string>("");
  const [intervals, setIntervals] = useState<Interval[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const svc = useMemo(() => SERVICES.find((s) => s.name === serviceName)!, [serviceName]);
  const allSlots = useMemo(() => timesForDay(date, svc.minutes), [date, svc.minutes]);

  const availableSlots = useMemo(() => {
    const now = DateTime.now().setZone(TZ);
    const duration = ceilToSlot(svc.minutes);

    const blocked = intervals.map((i) => {
      const s = DateTime.fromISO(i.startISO, { zone: TZ });
      const e = s.plus({ minutes: i.durationMinutes });
      return { s, e };
    });


    return allSlots.filter((hhmm) => {
      const start = DateTime.fromISO(`${date}T${hhmm}`, { zone: TZ });
      const end = start.plus({ minutes: duration });

      // Lead time
      if (start.diff(now, "minutes").minutes < LEAD_TIME_MINUTES) return false;

      // Conflicts
      for (const b of blocked) {
        if (overlaps(start, end, b.s, b.e)) return false;
      }
      return true;
    });
  }, [allSlots, intervals, svc.minutes, date]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingTimes(true);
      setError("");
      setTime("");

      const res = await fetch(`/api/booking/availability?barberId=${encodeURIComponent(barberId)}&date=${encodeURIComponent(date)}`, {
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);

      if (cancelled) return;
      setLoadingTimes(false);

      if (!res.ok || !data?.ok) {
        setIntervals([]);
        setError(data?.error || "Unable to load availability.");
        return;
      }
      setIntervals(data.intervals || []);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [barberId, date]);

  function formatPhoneLive(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 10);
    const a = digits.slice(0, 3);
    const b = digits.slice(3, 6);
    const c = digits.slice(6, 10);

    if (digits.length <= 3) return a ? `(${a}` : "";
    if (digits.length <= 6) return `(${a}) ${b}`;
    return `(${a}) ${b}-${c}`;
  }

  async function submit() {
    setError("");
    if (!time) {
      setError("Please choose a time.");
      return;
    }
    if (!turnstileToken) {
      setError("Please complete bot protection.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/booking/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          serviceName,
          barberId,
          date,
          time,
          name,
          phone,
          turnstileToken,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Unable to request appointment.");
        setSubmitting(false);
        return;
      }

      window.location.href = `/book/success`;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grain min-h-screen">
      <section className="mx-auto max-w-4xl px-5 py-16 md:py-20">
        <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">BOOK</div>
        <h1 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl text-white">Request an appointment</h1>
        <p className="mt-3 text-white/70 leading-relaxed">
          Select a service, barber, and time. We’ll confirm by phone.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          {/* Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="block">
              <div className="text-white/60 text-xs tracking-[0.22em]">SERVICE</div>
              <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/85 outline-none focus:border-[color:var(--gold)]/35"
              >
                {SERVICES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} · ${s.price} · {s.minutes} min
                  </option>
                ))}
              </select>
            </label>

            {/* Barber */}
            <div>
              <div className="text-white/60 text-xs tracking-[0.22em]">BARBER</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {BARBERS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBarberId(b.id)}
                    className={
                      "rounded-2xl border px-3 py-3 text-sm transition " +
                      (barberId === b.id
                        ? "border-[color:var(--gold)]/45 bg-[color:var(--gold)]/10 text-white"
                        : "border-white/10 bg-black/25 text-white/75 hover:border-white/20")
                    }
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <label className="block">
              <div className="text-white/60 text-xs tracking-[0.22em]">DATE</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/85 outline-none focus:border-[color:var(--gold)]/35"
              />
            </label>

            {/* Time */}
            <div>
              <div className="text-white/60 text-xs tracking-[0.22em]">TIME</div>

              <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-3">
                {loadingTimes ? (
                  <div className="text-white/60 text-sm">Loading availability…</div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-white/60 text-sm">No available times for this day.</div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {availableSlots.map((hhmm) => {
                      const label = DateTime.fromISO(`${date}T${hhmm}`, { zone: TZ }).toFormat("h:mm a");
                      const active = time === hhmm;
                      return (
                        <button
                          key={hhmm}
                          type="button"
                          onClick={() => setTime(hhmm)}
                          className={
                            "rounded-xl border px-2 py-2 text-xs sm:text-sm tabular-nums transition " +
                            (active
                              ? "border-[color:var(--gold)]/45 bg-[color:var(--gold)]/10 text-white"
                              : "border-white/10 bg-black/25 text-white/75 hover:border-white/20")
                          }
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-2 text-xs text-white/50">
                Showing available times only. (15-minute grid · ≥ 2 hours ahead)
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="block">
              <div className="text-white/60 text-xs tracking-[0.22em]">YOUR NAME</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/85 outline-none focus:border-[color:var(--gold)]/35"
              />
            </label>

            <label className="block">
              <div className="text-white/60 text-xs tracking-[0.22em]">PHONE</div>
              <input
                value={phone}
                onChange={(e) => setPhone(formatPhoneLive(e.target.value))}
                inputMode="tel"
                placeholder="(000) 000-0000"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/85 outline-none focus:border-[color:var(--gold)]/35"
              />
              <div className="mt-2 text-xs text-white/50">US numbers only.</div>
            </label>
          </div>

          <TurnstileWidget
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onToken={(t) => setTurnstileToken(t)}
          />

          {error ? <div className="mt-5 text-sm text-red-300">{error}</div> : null}

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="btn btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Requesting…" : "Request Appointment"}
            </button>
            <a href="/" className="btn btn-secondary justify-center">
              Back to Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
