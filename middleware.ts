import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/myStudio", "/owner", "/profile", "/bookings"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some((p) => pathname.startsWith(p));
  const token = req.cookies.get("accessToken")?.value;

  if (isProtected && !token) {
    const url = new URL("/", req.url);
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
  ],
};
