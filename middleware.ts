import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminMiddleware } from "./middlewares/adminMiddleware";

export function middleware(req: NextRequest) {
  // Podés tener más de un middleware y rutear según el path
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return adminMiddleware(req);
  }

  // Si no hay match, dejamos pasar
  return NextResponse.next();
}

// Matcher para que solo se ejecute en /admin
export const config = {
  matcher: ["/admin"],
};
