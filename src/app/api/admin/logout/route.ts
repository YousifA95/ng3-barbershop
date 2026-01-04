import { NextResponse } from "next/server";

function clearAuthCookies(res: NextResponse) {
  const names = [
    // session
    "next-auth.session-token",
    "__Secure-next-auth.session-token",

    // csrf + callback url
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",

    // oauth flow helpers (can linger)
    "next-auth.state",
    "next-auth.nonce",
    "next-auth.pkce.code_verifier",
  ];

  for (const name of names) {
    res.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
}

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Cache-Control", "no-store");
  clearAuthCookies(res);
  return res;
}

export async function GET() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Cache-Control", "no-store");
  clearAuthCookies(res);
  return res;
}
