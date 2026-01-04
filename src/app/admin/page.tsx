"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { DateTime } from "luxon";
import { AnimatePresence, motion } from "framer-motion";
import { TZ } from "@/lib/booking";

type AdminStatus = "All" | "Requested" | "Confirmed" | "Declined";

type Row = {
  id: string;
  startISO: string; // ISO timestamp in TZ
  status: "Requested" | "Confirmed" | "Declined";
  serviceName: string;
  barberName: string;
  requesterName: string;
  requesterPhoneNational: string;
  createdAtISO?: string;
  modifiedAtISO?: string;
};

function safeStr(v: any) {
  return typeof v === "string" ? v : "";
}

function normalizeRow(raw: any): Row | null {
  // Support either object rows or array rows from Apps Script
  // Expected headers: ID, appointment date/time, Status, Service, Barber, Requester Name, Requester Phone number, CreatedAt, ModifiedAt
  if (!raw) return null;

  if (typeof raw === "object" && !Array.isArray(raw)) {
    const id = safeStr(raw.id || raw.ID);
    const startISO = safeStr(
      raw.startISO ||
      raw.start ||
      raw.appointmentDateTime ||
      raw["appointment date/time"] ||
      raw["Appointment Date/Time"] ||
      raw["appointment date/time Eastern Time AM/PM"]
    );
    const status = safeStr(raw.status || raw.Status) as Row["status"];

    const serviceName = safeStr(raw.serviceName || raw.Service || raw.service || raw["Service"]);
    const barberName = safeStr(raw.barberName || raw.Barber || raw.barber || raw["Barber"]);
    const requesterName = safeStr(
      raw.requesterName ||
      raw["Requester Name"] ||
      raw.Requester ||
      raw["Requester"] ||
      raw.requester ||
      raw.name
    );
    const requesterPhoneNational = safeStr(
      raw.requesterPhoneNational ||
      raw["Requester Phone number"] ||
      raw["Requester Phone Number"] ||
      raw["Requester Phone"] ||
      raw.requesterPhone ||
      raw.phone ||
      raw.Phone
    );

    if (!id || !startISO || !status) return null;

    return {
      id,
      startISO,
      status,
      serviceName,
      barberName,
      requesterName,
      requesterPhoneNational,
      createdAtISO: safeStr(raw.createdAtISO || raw.CreatedAt),
      modifiedAtISO: safeStr(raw.modifiedAtISO || raw.ModifiedAt),
    };
  }

  if (Array.isArray(raw)) {
    const [
      id,
      startISO,
      status,
      serviceName,
      barberName,
      requesterName,
      requesterPhoneNational,
      createdAtISO,
      modifiedAtISO,
    ] = raw;

    const sid = safeStr(id);
    const sStart = safeStr(startISO);
    const sStatus = safeStr(status) as Row["status"];
    if (!sid || !sStart || !sStatus) return null;

    return {
      id: sid,
      startISO: sStart,
      status: sStatus,
      serviceName: safeStr(serviceName),
      barberName: safeStr(barberName),
      requesterName: safeStr(requesterName),
      requesterPhoneNational: safeStr(requesterPhoneNational),
      createdAtISO: safeStr(createdAtISO),
      modifiedAtISO: safeStr(modifiedAtISO),
    };
  }

  return null;
}

function Pill({ status }: { status: Row["status"] }) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] tracking-[0.16em] uppercase";
  if (status === "Requested")
    return <span className={`${base} border-white/15 bg-white/5 text-white/80`}>Requested</span>;
  if (status === "Confirmed")
    return (
      <span className={`${base} border-[color:var(--gold)]/35 bg-[color:var(--gold)]/10 text-white`}>
        Confirmed
      </span>
    );
  return <span className={`${base} border-red-300/20 bg-red-500/5 text-red-200`}>Declined</span>;
}

function fmtDT(iso: string) {
  const dt = DateTime.fromISO(iso, { zone: TZ });
  if (!dt.isValid) return iso;
  return dt.toFormat("ccc, LLL d · h:mm a");
}

function fmtShort(iso?: string) {
  if (!iso) return "—";
  const dt = DateTime.fromISO(iso, { zone: TZ });
  if (!dt.isValid) return "—";
  return dt.toFormat("LLL d, h:mm a");
}

type Toast = { kind: "success" | "error"; title: string; detail?: string } | null;

export default function AdminPage() {
  const { data: session, status } = useSession();

  // Filters
  const [statusFilter, setStatusFilter] = useState<AdminStatus>("Requested");
  const [barberFilter, setBarberFilter] = useState<string>("All");
  const [q, setQ] = useState<string>("");

  // Data
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  // Toast auto-dismiss (5 seconds)
  const toastTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (!toast) return;

    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 5000);

    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    };
  }, [toast]);

  // ---- Inactivity timer (5 minutes from last activity) ----
  const idleTimerRef = useRef<number | null>(null);
  const bumpIdle = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(async () => {
      try {
        await fetch("/api/admin/logout", { method: "POST", cache: "no-store" });
      } catch { }
      await signOut({ callbackUrl: "/" });
    }, 5 * 60 * 1000);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    bumpIdle();
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;
    const handler = () => bumpIdle();
    events.forEach((ev) => window.addEventListener(ev, handler, { passive: true }));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handler));
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [status, bumpIdle]);

  // ---- Tab-close logout (best-effort) ----
  useEffect(() => {
    if (status !== "authenticated") return;

    const fireLogout = () => {
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/admin/logout");
        } else {
          fetch("/api/admin/logout", { method: "POST", keepalive: true }).catch(() => { });
        }
      } catch { }
    };

    // pagehide fires on tab close, and also on full reload.
    window.addEventListener("pagehide", fireLogout);
    return () => window.removeEventListener("pagehide", fireLogout);
  }, [status]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/appointments?status=${encodeURIComponent(statusFilter)}`, {
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setRows([]);
        setToast({ kind: "error", title: "Unable to load appointments", detail: data?.error || "Failed" });
        setLoading(false);
        return;
      }

      const parsed = Array.isArray(data.rows) ? data.rows.map(normalizeRow).filter(Boolean) : [];
      setRows(parsed as Row[]);
      setLoading(false);
    } catch {
      setRows([]);
      setLoading(false);
      setToast({ kind: "error", title: "Network error", detail: "Please refresh and try again." });
    }
  }, [statusFilter]);

  // Initial + refresh on filter change
  useEffect(() => {
    if (status !== "authenticated") return;
    load();
  }, [status, load]);

  // Auto-refresh (gentle) when viewing Requested (60s)
  useEffect(() => {
    if (status !== "authenticated") return;
    if (statusFilter !== "Requested") return;

    const t = window.setInterval(load, 120000);
    return () => window.clearInterval(t);
  }, [status, statusFilter, load]);

  const filtered = useMemo(() => {
    let out = rows;

    if (barberFilter !== "All") {
      out = out.filter((r) => r.barberName === barberFilter);
    }

    // Search: Service, Barber, Requester, Phone (text + digits)
    const qq = q.trim().toLowerCase();
    const digits = qq.replace(/\D/g, "");

    if (qq) {
      out = out.filter((r) => {
        const service = (r.serviceName || "").toLowerCase();
        const barber = (r.barberName || "").toLowerCase();
        const requester = (r.requesterName || "").toLowerCase();
        const phoneText = (r.requesterPhoneNational || "").toLowerCase();

        if (service.includes(qq) || barber.includes(qq) || requester.includes(qq) || phoneText.includes(qq)) {
          return true;
        }

        // Allow phone matching even if the user typed digits only (recommended) or mixed formatting
        if (digits.length >= 3) {
          const phoneDigits = (r.requesterPhoneNational || "").replace(/\D/g, "");
          if (phoneDigits.includes(digits)) return true;
        }

        return false;
      });
    }

    // Sort: newest first by appointment time
    out = [...out].sort((a, b) => {
      const A = DateTime.fromISO(a.startISO, { zone: TZ }).toMillis() || 0;
      const B = DateTime.fromISO(b.startISO, { zone: TZ }).toMillis() || 0;
      return B - A;
    });

    return out;
  }, [rows, barberFilter, q]);

  const uniqueBarbers = useMemo(() => {
    const s = new Set(rows.map((r) => r.barberName).filter(Boolean));
    return ["All", ...Array.from(s).sort()];
  }, [rows]);

  const doUpdate = useCallback(
    async (id: string, nextStatus: "Confirmed" | "Declined") => {
      setActingId(id);
      setToast(null);

      // Optimistic update
      const prev = rows;
      const next = rows.map((r) => (r.id === id ? { ...r, status: nextStatus } : r));
      setRows(next);

      try {
        const res = await fetch("/api/admin/appointments", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, status: nextStatus }),
        });
        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.ok) {
          setRows(prev); // rollback
          setToast({
            kind: "error",
            title: "Update failed",
            detail: data?.error || "Please try again.",
          });
          setActingId(null);
          return;
        }

        // If we’re filtering Requested, remove the row after success (keeps UI clean)
        if (statusFilter === "Requested") {
          setRows((cur) => cur.filter((r) => r.id !== id));
        }

        setToast({
          kind: "success",
          title: nextStatus === "Confirmed" ? "Confirmed" : "Declined",
          detail: "Saved to the sheet.",
        });
      } catch {
        setRows(prev); // rollback
        setToast({ kind: "error", title: "Network error", detail: "Please try again." });
      } finally {
        setActingId(null);
      }
    },
    [rows, statusFilter]
  );

  const logoutNow = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", cache: "no-store" });
    } catch { }
    await signOut({ callbackUrl: "/" });
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    const TAB_KEY = "ng3_admin_tab_ok";
    const hasTab = typeof window !== "undefined" && sessionStorage.getItem(TAB_KEY);
    const url = new URL(window.location.href);
    const isFresh = url.searchParams.get("fresh") === "1";

    // If this tab was not "fresh authenticated", force logout
    if (!hasTab) {
      if (isFresh) {
        sessionStorage.setItem(TAB_KEY, "1");
        url.searchParams.delete("fresh");
        window.history.replaceState({}, "", url.pathname + url.search);
      } else {
        // No per-tab marker and not a fresh login -> sign out
        logoutNow();
      }
      return;
    }

    // Clean up URL if user refreshes and still has fresh=1
    if (isFresh) {
      url.searchParams.delete("fresh");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [status, logoutNow]);

  if (status === "loading") {
    return (
      <main className="grain min-h-screen">
        <section className="mx-auto max-w-6xl px-5 pt-14 pb-20">
          <div className="h-6 w-40 rounded bg-white/5 animate-pulse" />
          <div className="mt-6 h-40 rounded-3xl border border-white/10 bg-white/5 animate-pulse" />
        </section>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="grain min-h-screen">
        <section className="mx-auto max-w-xl px-5 pt-16 pb-24 text-center">
          <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">ADMIN</div>
          <h1 className="mt-3 font-[var(--font-heading)] text-3xl text-white">Sign in</h1>
          <p className="mt-3 text-white/70">Access is restricted to NG3 administrators.</p>

          <div className="mt-8">
            <button
              className="btn btn-primary justify-center"
              onClick={() => signIn("google", { callbackUrl: "/admin?fresh=1" })}
            >
              Continue with Google
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="grain min-h-screen">
      <section className="mx-auto max-w-6xl px-5 pt-14 pb-20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">ADMIN</div>
            <h1 className="mt-2 font-[var(--font-heading)] text-3xl md:text-4xl text-white">
              Appointments
            </h1>
            <div className="mt-2 text-sm text-white/60">
              Signed in as <span className="text-white/80">{session?.user?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-secondary" onClick={load} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button className="btn btn-secondary" onClick={logoutNow}>
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <label className="block">
              <div className="text-white/60 text-xs tracking-[0.22em]">STATUS</div>
              <select
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/85 outline-none focus:border-[color:var(--gold)]/35"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AdminStatus)}
              >
                <option value="Requested">Requested</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Declined">Declined</option>
                <option value="All">All</option>
              </select>
            </label>

            <label className="block">
              <div className="text-white/60 text-xs tracking-[0.22em]">BARBER</div>
              <select
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/85 outline-none focus:border-[color:var(--gold)]/35"
                value={barberFilter}
                onChange={(e) => setBarberFilter(e.target.value)}
              >
                {uniqueBarbers.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="text-white/60 text-xs tracking-[0.22em]">SEARCH</div>
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/85 outline-none focus:border-[color:var(--gold)]/35"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Service, barber, requester, phone"
              />
            </label>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="text-white/55 text-xs tracking-[0.18em] uppercase">
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3">When</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Service</th>
                  <th className="text-left px-4 py-3">Barber</th>
                  <th className="text-left px-4 py-3">Requester</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Created</th>
                  <th className="text-right px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="text-white/80">
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-white/60" colSpan={8}>
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-white/60" colSpan={8}>
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const isActing = actingId === r.id;
                    const canAct = r.status === "Requested";

                    return (
                      <tr key={r.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                        <td className="px-4 py-4 whitespace-nowrap">{fmtDT(r.startISO)}</td>
                        <td className="px-4 py-4">
                          <Pill status={r.status} />
                        </td>
                        <td className="px-4 py-4">{r.serviceName}</td>
                        <td className="px-4 py-4">{r.barberName}</td>
                        <td className="px-4 py-4">{r.requesterName}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{r.requesterPhoneNational}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-white/60">{fmtShort(r.createdAtISO)}</td>
                        <td className="px-4 py-4 text-right">
                          {canAct ? (
                            <div className="inline-flex items-center gap-2">
                              <button
                                className="rounded-xl border border-[color:var(--gold)]/35 bg-[color:var(--gold)]/10 px-3 py-2 text-xs tracking-[0.14em] uppercase text-white transition hover:border-[color:var(--gold)]/55 disabled:opacity-60"
                                disabled={isActing}
                                onClick={() => doUpdate(r.id, "Confirmed")}
                              >
                                {isActing ? "Saving…" : "Confirm"}
                              </button>
                              <button
                                className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs tracking-[0.14em] uppercase text-white/80 transition hover:border-white/20 disabled:opacity-60"
                                disabled={isActing}
                                onClick={() => doUpdate(r.id, "Declined")}
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <span className="text-white/45 text-xs tracking-[0.14em] uppercase">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-white/45">
            Times displayed in Eastern Time. Auto-refresh runs only on “Requested”.
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] w-[92%] max-w-md"
            >
              <div
                className={
                  "rounded-2xl border px-4 py-3 backdrop-blur " +
                  (toast.kind === "success"
                    ? "border-[color:var(--gold)]/35 bg-black/60 text-white"
                    : "border-red-300/25 bg-black/60 text-red-100")
                }
              >
                <div className="text-xs tracking-[0.22em] uppercase opacity-80">
                  {toast.kind === "success" ? "Saved" : "Error"}
                </div>
                <div className="mt-1 text-sm">{toast.title}</div>
                {toast.detail ? <div className="mt-1 text-xs opacity-70">{toast.detail}</div> : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </main>
  );
}
