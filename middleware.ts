import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hostHeader(request: NextRequest): string {
  const raw =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  return raw.split(",")[0].trim().replace(/:\d+$/, "");
}

/** Canonical host: www only (301). Matches Vercel apex → www redirect. */
export function middleware(request: NextRequest) {
  if (hostHeader(request) !== "citelens.app") {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.hostname = "www.citelens.app";
  url.protocol = "https:";
  url.port = "";
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/"],
};
