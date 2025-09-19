import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROLE = "Administrador";

function decodeJwt(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function adminMiddleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/acceso-denegado";
    return NextResponse.rewrite(url);
  }

  const payload = decodeJwt(token);
  if (payload?.role === ADMIN_ROLE) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/acceso-denegado";
  return NextResponse.rewrite(url);
}
