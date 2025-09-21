import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/myStudio", "/owner", "/profile", "/bookings", "/studios", "/rooms"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some((p) => pathname.startsWith(p));
  const token = req.cookies.get("accessToken")?.value; // ajustá el nombre si es otro

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/myStudio/:path*",
    "/owner/:path*",
    "/profile/:path*",
    "/bookings/:path*",
    "/studios/:path*",
    "/rooms/:path*",
  ],
};
