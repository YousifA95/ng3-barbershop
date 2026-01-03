import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { BARBERS, SERVICES, TZ, LEAD_TIME_MINUTES, ceilToSlot } from "@/lib/booking";
import { cleanName, normalizeUSPhone } from "@/lib/validation";

async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY!;
  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);

  // Server-side validation is mandatory. :contentReference[oaicite:2]{index=2}
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  const json = await res.json().catch(() => null);
  return !!json?.success;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Bad JSON" }, { status: 400 });

  const { serviceName, barberId, date, time, name, phone, turnstileToken } = body as {
    serviceName: string;
    barberId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    name: string;
    phone: string;
    turnstileToken: string;
  };

  const svc = SERVICES.find((s) => s.name === serviceName);
  const barber = BARBERS.find((b) => b.id === barberId);
  const safeName = cleanName(name);
  const phoneParsed = normalizeUSPhone(phone);

  if (!svc || !barber || !safeName || !phoneParsed || !date || !time) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ ok: false, error: "Invalid date/time" }, { status: 400 });
  }

  if (!turnstileToken) {
    return NextResponse.json({ ok: false, error: "Missing Turnstile token" }, { status: 400 });
  }
  const okToken = await verifyTurnstile(turnstileToken);
  if (!okToken) {
    return NextResponse.json({ ok: false, error: "Bot verification failed" }, { status: 403 });
  }

  // Lead time enforcement (defense-in-depth; Apps Script will also enforce).
  const start = DateTime.fromISO(`${date}T${time}`, { zone: TZ });
  if (!start.isValid) {
    return NextResponse.json({ ok: false, error: "Invalid start time" }, { status: 400 });
  }
  const now = DateTime.now().setZone(TZ);
  if (start.diff(now, "minutes").minutes < LEAD_TIME_MINUTES) {
    return NextResponse.json(
      { ok: false, error: "Appointments must be at least 2 hours ahead." },
      { status: 400 }
    );
  }

  // Normalize duration to 15-min grid (10-min service blocks a 15-min slot)
  const durationMinutes = ceilToSlot(svc.minutes);

  const url = process.env.APPS_SCRIPT_WEBAPP_URL!;
  const secret = process.env.APPS_SCRIPT_SECRET!;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      action: "create",
      secret,
      barberId,
      barberName: barber.name,
      serviceName: svc.name,
      durationMinutes,
      startISO: start.toISO(),
      requesterName: safeName,
      requesterPhoneNational: phoneParsed.national,
      requesterPhoneE164: phoneParsed.e164,
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    return NextResponse.json(
      { ok: false, error: data?.error || "Request failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, id: data.id });
}
