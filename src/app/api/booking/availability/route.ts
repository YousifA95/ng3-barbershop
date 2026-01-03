import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const barberId = searchParams.get("barberId") || "";
  const date = searchParams.get("date") || ""; // YYYY-MM-DD

  if (!barberId || !date) {
    return NextResponse.json({ ok: false, error: "Missing params" }, { status: 400 });
  }

  const url = process.env.APPS_SCRIPT_WEBAPP_URL!;
  const secret = process.env.APPS_SCRIPT_SECRET!;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "availability", secret, barberId, date }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    return NextResponse.json({ ok: false, error: data?.error || "Failed" }, { status: 500 });
  }

  // data.intervals: [{ startISO, endISO, status }]
  return NextResponse.json({ ok: true, intervals: data.intervals });
}
