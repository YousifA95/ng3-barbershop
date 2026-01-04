"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import {
  BARBERS,
  SERVICES,
  TZ,
  HOURS_BY_WEEKDAY,
  SLOT_MINUTES,
  LEAD_TIME_MINUTES,
  ceilToSlot,
} from "@/lib/booking";
import TurnstileBox from "@/components/TurnstileBox";

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

function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

// NANP: area code + exchange code cannot start with 0 or 1
function isValidUSPhoneDigits10(d: string) {
  return /^[2-9]\d{2}[2-9]\d{2}\d{4}$/.test(d);
}

function TimeSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="h-10 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

/**
 * Prevent back-button resubmits:
 * - Store the last successful booking fingerprint in sessionStorage.
 * - Disable submit if the fingerprint matches current form state and hasn't expired.
 */
const BOOK_LOCK_KEY = "ng3_booking_last_v1";
const BOOK_LOCK_TTL_MS = 60 * 60 * 1000; // 60 minutes

type BookLock = { fp: string; ts: number };

function readBookLock(): BookLock | null {
  try {
    const raw = sessionStorage.getItem(BOOK_LOCK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookLock;
    if (!parsed?.fp || !parsed?.ts) return null;
    if (Date.now() - parsed.ts > BOOK_LOCK_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeBookLock(fp: string) {
  try {
    const payload: BookLock = { fp, ts: Date.now() };
    sessionStorage.setItem(BOOK_LOCK_KEY, JSON.stringify(payload));
  } catch {
    // ignore (private mode / blocked storage)
  }
}

function makeFingerprint(input: {
  serviceName: string;
  barberId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
}) {
  const nameNorm = input.name.trim().toLowerCase();
  const phoneDigits = digitsOnly(input.phone);
  return [
    input.serviceName || "",
    input.barberId || "",
    input.date || "",
    input.time || "",
    nameNorm,
    phoneDigits,
  ].join("|");
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
  const [justRequested, setJustRequested] = useState(false);
  const [error, setError] = useState<string>("");

  // Back-button resubmit lock
  const [submitLocked, setSubmitLocked] = useState(false);

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

      // Conflicts (Requested + Confirmed block the slot)
      for (const b of blocked) {
        if (overlaps(start, end, b.s, b.e)) return false;
      }
      return true;
    });
  }, [allSlots, intervals, svc.minutes, date]);

  // Load availability when barber/date changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingTimes(true);
      setError("");
      setTime("");

      const res = await fetch(
        `/api/booking/availability?barberId=${encodeURIComponent(barberId)}&date=${encodeURIComponent(date)}`,
        { cache: "no-store" }
      );

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

  // Keep Turnstile UI + token state aligned
  const resetTurnstile = useCallback(() => {
    setTurnstileToken("");
    if (typeof window !== "undefined" && (window as any).turnstile) {
      try {
        (window as any).turnstile.reset();
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    resetTurnstile();
  }, [serviceName, barberId, date, resetTurnstile]);

  const onTurnstileToken = useCallback((t: string) => {
    setTurnstileToken(t);
    if (t) setError("");
  }, []);

  // Auto-select earliest available time, and recover if selection becomes invalid
  useEffect(() => {
    if (loadingTimes) return;

    if (!time && availableSlots.length > 0) {
      setTime(availableSlots[0]);
      return;
    }

    if (time && availableSlots.length > 0 && !availableSlots.includes(time)) {
      setTime(availableSlots[0]);
      return;
    }

    if (availableSlots.length === 0 && time) {
      setTime("");
    }
  }, [loadingTimes, availableSlots, time]);

  function formatPhoneLive(v: string) {
    const digits = digitsOnly(v).slice(0, 10);
    const a = digits.slice(0, 3);
    const b = digits.slice(3, 6);
    const c = digits.slice(6, 10);

    if (digits.length <= 3) return a ? `(${a}` : "";
    if (digits.length <= 6) return `(${a}) ${b}`;
    return `(${a}) ${b}-${c}`;
  }

  async function findNextAvailableDay(maxDays = 21) {
    setError("");
    setLoadingTimes(true);

    const start = DateTime.fromISO(date, { zone: TZ });

    try {
      for (let i = 0; i < maxDays; i++) {
        const d = start.plus({ days: i });
        const iso = d.toISODate()!;
        const slots = timesForDay(iso, svc.minutes);
        if (slots.length === 0) continue;

        const res = await fetch(
          `/api/booking/availability?barberId=${encodeURIComponent(barberId)}&date=${encodeURIComponent(iso)}`,
          { cache: "no-store" }
        );
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) continue;

        const nextIntervals: Interval[] = data.intervals || [];
        const duration = ceilToSlot(svc.minutes);
        const now = DateTime.now().setZone(TZ);

        const blocked = nextIntervals.map((it) => {
          const s = DateTime.fromISO(it.startISO, { zone: TZ });
          const e = s.plus({ minutes: it.durationMinutes });
          return { s, e };
        });

        const firstAvail = slots.find((hhmm) => {
          const s = DateTime.fromISO(`${iso}T${hhmm}`, { zone: TZ });
          const e = s.plus({ minutes: duration });
          if (s.diff(now, "minutes").minutes < LEAD_TIME_MINUTES) return false;
          return !blocked.some((b) => overlaps(s, e, b.s, b.e));
        });

        if (firstAvail) {
          setDate(iso);
          setTime(firstAvail);
          return;
        }
      }

      setError("No availability found in the next few weeks.");
    } finally {
      setLoadingTimes(false);
    }
  }

  // Subtle booking summary strip
  const summary = useMemo(() => {
    const barber = BARBERS.find((b) => b.id === barberId)?.name ?? "";
    const svcLabel = svc?.name ?? "";
    const dateLabel = DateTime.fromISO(date, { zone: TZ }).toFormat("ccc, LLL d");
    const timeLabel = time ? DateTime.fromISO(`${date}T${time}`, { zone: TZ }).toFormat("h:mm a") : "—";
    const phoneLabel = phone || "—";
    return `${svcLabel} · ${barber} · ${dateLabel} · ${timeLabel} · ${phoneLabel}`;
  }, [barberId, svc, date, time, phone]);

  // Compute fingerprint from current form state
  const currentFingerprint = useMemo(
    () =>
      makeFingerprint({
        serviceName,
        barberId,
        date,
        time,
        name,
        phone,
      }),
    [serviceName, barberId, date, time, name, phone]
  );

  const refreshLock = useCallback(
    (fp: string) => {
      const lock = readBookLock();
      if (!lock) {
        setSubmitLocked(false);
        return;
      }
      setSubmitLocked(lock.fp === fp);
    },
    [setSubmitLocked]
  );

  // On mount + when fingerprint changes: check whether we should lock submit
  useEffect(() => {
    refreshLock(currentFingerprint);
  }, [currentFingerprint, refreshLock]);

  // When coming back via browser back/forward cache, re-check lock
  useEffect(() => {
    const onPageShow = () => refreshLock(currentFingerprint);
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [currentFingerprint, refreshLock]);

  async function submit() {
    setError("");

    if (submitLocked) {
      setError("This request was already sent. Change any detail to submit again.");
      return;
    }

    const nameTrim = name.trim();
    const phoneDigits = digitsOnly(phone);

    if (!nameTrim) {
      setError("Please enter your name (must be 2 or more letters).");
      return;
    }

    if (!isValidUSPhoneDigits10(phoneDigits)) {
      setError("Please enter a valid US phone number (10 digits), e.g., (586) 884-4280.");
      return;
    }

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
          name: nameTrim,
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

      // Lock this exact form state so back-button won't resubmit
      writeBookLock(currentFingerprint);
      setSubmitLocked(true);

      // premium success micro-state before redirect
      setJustRequested(true);
      window.setTimeout(() => {
        window.location.href = `/book/success`;
      }, 700);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grain min-h-screen">
      <section className="mx-auto max-w-4xl px-5 pt-14 pb-16 md:pt-16 md:pb-20">
        <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">BOOK</div>
        <h1 className="mt-2 font-[var(--font-heading)] text-3xl md:text-4xl text-white">
          Request an appointment
        </h1>
        <p className="mt-3 text-white/70 leading-relaxed">
          Select a service, barber, and time. We’ll confirm by phone.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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

            <label className="block">
              <div className="text-white/60 text-xs tracking-[0.22em]">DATE</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/85 outline-none focus:border-[color:var(--gold)]/35"
              />
            </label>

            <div>
              <div className="text-white/60 text-xs tracking-[0.22em]">TIME</div>
              <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-3">
                {loadingTimes ? (
                  <TimeSkeleton />
                ) : availableSlots.length === 0 ? (
                  <div className="text-white/60 text-sm">
                    No available times for this day.
                    <div className="mt-3">
                      <button type="button" onClick={() => findNextAvailableDay()} className="btn btn-secondary">
                        Find next available day
                      </button>
                    </div>
                  </div>
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
                            "h-10 rounded-xl border px-2 text-xs sm:text-sm tabular-nums transition " +
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

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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
                placeholder="(586) 884-4280"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/85 outline-none focus:border-[color:var(--gold)]/35"
              />
              <div className="mt-2 text-xs text-white/50">US numbers only.</div>
            </label>
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4">
            <TurnstileBox onToken={onTurnstileToken} />
          </div>

          <div className="mt-5 text-xs text-white/55 tracking-[0.14em] uppercase">{summary}</div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-500/5 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={submitting || justRequested || submitLocked}
              className="btn btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {justRequested ? "Requested ✓" : submitting ? "Requesting…" : "Request Appointment"}
            </button>

            <a href="/" className="btn btn-secondary justify-center">
              Back to Home
            </a>
          </div>

          {submitLocked ? (
            <div className="mt-3 text-xs text-white/55">
              Request already sent. Change any detail to submit again.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
