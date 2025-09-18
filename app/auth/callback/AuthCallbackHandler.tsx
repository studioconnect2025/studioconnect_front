"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/AuthStore";
import { parseJwt } from "@/utils/jwt";
import type { User } from "@/types/Auth";
import SelectRoleModal from "@/components/auth/SelectRoleModal";
import { Loader } from "@/components/common/Loader";

export default function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [isLoading, setIsLoading] = useState(true);
  const [needsRole, setNeedsRole] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      localStorage.removeItem("accessToken");
      setAuth({ accessToken: null, user: null });
      router.replace("/login?error=sso_failed");
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
            name: (claims.email?.split("@")[0] as string) ?? "",
          }
        : null;

      setAuth({ accessToken: token, user });

      if (!user?.role) {
        // Si no hay rol, mostramos modal para elegir
        setNeedsRole(true);
        setIsLoading(false);
      } else {
        router.replace("/");
      }
    } catch (err) {
      console.error("Error procesando el token SSO:", err);
      localStorage.removeItem("accessToken");
      setAuth({ accessToken: null, user: null });
      router.replace("/login?error=sso_failed");
    }
  }, [router, searchParams, setAuth]);

  if (isLoading && !needsRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {needsRole && <SelectRoleModal />}
    </div>
  );
}
