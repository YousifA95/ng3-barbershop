"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { AdminIdleTimer } from "@/components/AdminIdleTimer";

type Row = {
  id: string;
  appointment: string; // formatted ET
  barber: string;
  service: string;
  name: string;
  phone: string;
  status: string;
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/appointments", { cache: "no-store" });
    const data = await res.json().catch(() => null);
    setLoading(false);
    if (!res.ok || !data?.ok) {
      setErr(data?.error || "Failed to load.");
      setRows([]);
      return;
    }
    setRows(data.rows || []);
  }

  async function setStatus(id: string, status: "Confirmed" | "Declined") {
    setErr("");
    const res = await fetch("/api/admin/appointments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      setErr(data?.error || "Update failed.");
      return;
    }
    await load();
  }

  useEffect(() => {
    if (session?.user?.email) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  if (status === "loading") {
    return <main className="grain min-h-screen" />;
  }

  if (!session?.user?.email) {
    return (
      <main className="grain min-h-screen">
        <section className="mx-auto max-w-3xl px-5 py-24">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">ADMIN</div>
            <h1 className="mt-3 font-[var(--font-heading)] text-3xl text-white">Sign in</h1>
            <p className="mt-3 text-white/70">Google login required.</p>
            <div className="mt-7">
              <button className="btn btn-primary" onClick={() => signIn("google")}>
                Continue with Google
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="grain min-h-screen">
      <AdminIdleTimer minutes={5} />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[color:var(--gold)] text-xs tracking-[0.30em]">ADMIN</div>
            <h1 className="mt-3 font-[var(--font-heading)] text-3xl md:text-4xl text-white">
              Appointment Requests
            </h1>
            <p className="mt-3 text-white/70">Confirm or decline. Customer outreach is manual.</p>
          </div>

          <button className="btn btn-secondary" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign out
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-white/70 text-sm">
              {loading ? "Loading…" : `${rows.length} pending request(s)`}
            </div>
            <button className="btn btn-secondary" onClick={load} disabled={loading}>
              Refresh
            </button>
          </div>

          {err ? <div className="mt-4 text-sm text-red-300">{err}</div> : null}

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/60">
                <tr className="border-b border-white/10">
                  <th className="py-3 text-left font-medium">Time (ET)</th>
                  <th className="py-3 text-left font-medium">Barber</th>
                  <th className="py-3 text-left font-medium">Service</th>
                  <th className="py-3 text-left font-medium">Name</th>
                  <th className="py-3 text-left font-medium">Phone</th>
                  <th className="py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-white/5">
                    <td className="py-4 tabular-nums">{r.appointment}</td>
                    <td className="py-4">{r.barber}</td>
                    <td className="py-4">{r.service}</td>
                    <td className="py-4">{r.name}</td>
                    <td className="py-4 tabular-nums">{r.phone}</td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn btn-primary px-3 py-2 text-sm"
                          onClick={() => setStatus(r.id, "Confirmed")}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-secondary px-3 py-2 text-sm"
                          onClick={() => setStatus(r.id, "Declined")}
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading ? (
                  <tr>
                    <td className="py-8 text-white/60" colSpan={6}>
                      No pending requests.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
