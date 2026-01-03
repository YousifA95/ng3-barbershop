import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.APPS_SCRIPT_WEBAPP_URL;
  const adminSecret = process.env.APPS_SCRIPT_ADMIN_SECRET;
  if (!url || !adminSecret) {
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "listRequested", adminSecret }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    return NextResponse.json({ ok: false, error: data?.error || "Failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rows: data.rows });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { id, status } = (body || {}) as { id: string; status: "Confirmed" | "Declined" };

  if (!id || !["Confirmed", "Declined"].includes(status)) {
    return NextResponse.json({ ok: false, error: "Bad input" }, { status: 400 });
  }

  const url = process.env.APPS_SCRIPT_WEBAPP_URL;
  const adminSecret = process.env.APPS_SCRIPT_ADMIN_SECRET;
  if (!url || !adminSecret) {
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "updateStatus", adminSecret, id, status }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    return NextResponse.json({ ok: false, error: data?.error || "Failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
