import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth-options";

const allowed = new Set(["Requested", "Confirmed", "Declined", "All"]);

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") || "Requested").trim();

  if (!allowed.has(status)) {
    return NextResponse.json({ ok: false, error: "Bad status" }, { status: 400 });
  }

  const url = process.env.APPS_SCRIPT_WEBAPP_URL!;
  const adminSecret = process.env.APPS_SCRIPT_ADMIN_SECRET!;

  // Backward compatible:
  // - Requested uses existing action listRequested
  // - Others use action list (you’ll add it in Apps Script below)
  const action = status === "Requested" ? "listRequested" : "list";
  const payload = status === "Requested"
    ? { action, adminSecret }
    : { action, adminSecret, status };

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
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
  const { id, status } = body as { id: string; status: "Confirmed" | "Declined" };

  if (!id || !["Confirmed", "Declined"].includes(status)) {
    return NextResponse.json({ ok: false, error: "Bad input" }, { status: 400 });
  }

  const url = process.env.APPS_SCRIPT_WEBAPP_URL!;
  const adminSecret = process.env.APPS_SCRIPT_ADMIN_SECRET!;

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
