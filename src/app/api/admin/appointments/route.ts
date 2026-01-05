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
  if (!url || !adminSecret) {
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }

  // Backward compatible:
  // - Requested uses existing action listRequested
  // - Others use action list (Apps Script must support it)
  const action = status === "Requested" ? "listRequested" : "list";
  const payload =
    status === "Requested"
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
    return NextResponse.json(
      { ok: false, error: data?.error || "Failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, rows: data.rows });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { id?: string; status?: "Confirmed" | "Declined"; op?: string }
    | null;

  const id = String(body?.id || "").trim();
  const op = String(body?.op || "").trim();

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  const url = process.env.APPS_SCRIPT_WEBAPP_URL!;
  const adminSecret = process.env.APPS_SCRIPT_ADMIN_SECRET!;
  if (!url || !adminSecret) {
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }

  // DELETE path
  if (op === "delete") {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "deleteAppointment", adminSecret, id }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error || "Failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  // STATUS update path
  const status = String(body?.status || "").trim() as "Confirmed" | "Declined";
  if (!["Confirmed", "Declined"].includes(status)) {
    return NextResponse.json(
      { ok: false, error: "Bad input (status must be Confirmed or Declined)" },
      { status: 400 }
    );
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "updateStatus", adminSecret, id, status }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    return NextResponse.json(
      { ok: false, error: data?.error || "Failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
