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

    if (!token) {
      localStorage.removeItem("accessToken");
      setAuth({ accessToken: null, user: null });
      router.replace("/"); // sin /login
      return;
    }

    try {
      localStorage.setItem("accessToken", token);
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
      router.replace("/"); // Home
    } catch (e) {
      console.error("SSO error:", e);
      localStorage.removeItem("accessToken");
      setAuth({ accessToken: null, user: null });
      router.replace("/"); // Home
    }
  }, [router, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Procesando inicio de sesión...</p>
    </div>
  );
}
