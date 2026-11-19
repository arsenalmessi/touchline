
import { NextRequest, NextResponse } from "next/server";
import { verifyAgeCookie } from "@/lib/age-gate";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Allow Next.js assets, API endpoints and public files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Allow the age restriction pages
  if (
    pathname === "/age-verification" ||
    pathname === "/under-18"
  ) {
    return NextResponse.next();
  }

  const verified = verifyAgeCookie(
    request.cookies.get("serafine_age_verified")?.value
  );

  if (!verified) {
    const url = request.nextUrl.clone();

    url.pathname = "/age-verification";
    url.search = "";

    url.searchParams.set("returnTo", pathname + search);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
