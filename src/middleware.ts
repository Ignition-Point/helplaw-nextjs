import { NextResponse, type NextRequest } from "next/server";
import { getExpectedSiteAccessCookieValue } from "@/lib/site-access-cookie";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD?.trim();
  if (sitePassword) {
    const expected = await getExpectedSiteAccessCookieValue();
    const token = request.cookies.get("site_access")?.value;
    const pathname = request.nextUrl.pathname;

    if (token === expected) {
      return await updateSession(request);
    }
    if (pathname === "/password" || pathname.startsWith("/password/")) {
      return await updateSession(request);
    }
    return NextResponse.redirect(new URL("/password", request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
