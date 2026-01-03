import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  if (host === "www.ng3barbershop.com") {
    const url = req.nextUrl.clone();
    url.hostname = "ng3barbershop.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
