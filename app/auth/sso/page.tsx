"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/AuthStore";
import { parseJwt } from "@/utils/jwt";
import type { User } from "@/types/Auth";

export default function SSOPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const redirect = params.get("redirect") || "/";

    if (!token) {
      // limpia storage y cookie si vino sin token
      localStorage.removeItem("accessToken");
      document.cookie = "accessToken=; Path=/; Max-Age=0; SameSite=Lax";
      setAuth({ accessToken: null, user: null });
      router.replace("/");
      return;
    }

    try {
      // guarda para el cliente
      localStorage.setItem("accessToken", token);

      // cookie legible por middleware (parche A)
      document.cookie = `accessToken=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      const claims = parseJwt<{ sub?: string; email?: string; role?: string }>(token);
      const user: User | null = claims
        ? {
          id: claims.sub ?? "",
          email: claims.email ?? "",
          role: claims.role,
          name: (claims.email?.split("@")[0] ?? "") as string,
        }
        : null;

      setAuth({ accessToken: token, user });
      router.replace(redirect);
    } catch (e) {
      console.error("SSO error:", e);
      localStorage.removeItem("accessToken");
      document.cookie = "accessToken=; Path=/; Max-Age=0; SameSite=Lax";
      setAuth({ accessToken: null, user: null });
      router.replace("/");
    }
  }, [router, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Procesando inicio de sesión...</p>
    </div>
  );
}
