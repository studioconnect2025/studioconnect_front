import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_PATH = "/auth/login";
const OWNER_ONLY = ["/dashboard", "/studioRooms", "/myStudio"];
const AUTH_PATHS = ["/profile", "/bookings"];
const ALLOWED_OWNER_ROLES = new Set(["OWNER", "HOST", "ADMIN"]);

const isOwner = (p: string) => OWNER_ONLY.some((x) => p.startsWith(x));
const isAuth = (p: string) => AUTH_PATHS.some((x) => p.startsWith(x));

function decode(token: string) {
  try {
    const seg = token.split(".")[1];
    const b64 = seg.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((seg.length + 3) % 4);
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function normalizeRole(raw: any) {
  if (!raw) return "";
  let s = String(raw).replace(/Ã±/g, "ñ").replace(/Ã‘/g, "Ñ");
  const base = s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase().trim();
  const map: Record<string, string> = {
    "DUENO DE ESTUDIO": "OWNER",
    PROPIETARIO: "OWNER",
    OWNER: "OWNER",
    HOST: "HOST",
    ADMIN: "ADMIN",
    ADMINISTRADOR: "ADMIN",
    MUSICO: "MUSICIAN",
    MUSICIAN: "MUSICIAN",
  };
  return map[base] ?? base;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const needs = isOwner(pathname) || isAuth(pathname);
  if (!needs) return NextResponse.next();

  const token = req.cookies.get("accessToken")?.value || "";
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = `?next=${encodeURIComponent(pathname + (search || ""))}`;
    return NextResponse.redirect(url);
  }

  const payload = decode(token);
  const exp = Number(payload?.exp || 0);
  if (exp && Date.now() / 1000 >= exp) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = `?next=${encodeURIComponent(pathname + (search || ""))}`;
    return NextResponse.redirect(url);
  }

  if (isOwner(pathname)) {
    const role = normalizeRole(payload?.role || payload?.roles?.[0] || payload?.userRole);
    if (!ALLOWED_OWNER_ROLES.has(role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/studioRooms/:path*",
    "/myStudio/:path*",
    "/profile/:path*",
    "/bookings/:path*",
  ],
};
