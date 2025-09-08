"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/AuthStore";
import { parseJwt } from "@/utils/jwt";

type Props = {
  children: React.ReactNode;
  roles?: string[]; 
};

export default function RequireAuth({ children, roles }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, user } = useAuthStore.getState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const state = useAuthStore.getState();
    if (state.isAuthenticated) {
      setReady(true);
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (!token) {
     
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
      return;
    }

    try {
      const claims = parseJwt<{ sub?: string; email?: string; role?: string }>(token);
      const finalUser = claims
        ? {
            id: claims.sub ?? "",
            email: claims.email ?? "",
            role: claims.role,
            name: (claims.email?.split("@")[0] as string) ?? "",
          }
        : null;

      useAuthStore.setState({
        user: finalUser,
        accessToken: token,
        isAuthenticated: !!finalUser,
        loading: false,
        error: null,
      });

      setReady(true);
    } catch {
      // Token inválido → limpiar y llevar a login
      localStorage.removeItem("accessToken");
      useAuthStore.setState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
    }
  }, [pathname, router]);

  // Chequeo de roles (opcional)
  const roleAllowed = useMemo(() => {
    if (!roles?.length) return true;
    const current = useAuthStore.getState().user?.role;
    return !!current && roles.includes(current);
  }, [roles, user?.role, isAuthenticated]);

  useEffect(() => {
    if (ready && isAuthenticated && !roleAllowed) {
      router.replace("/"); // o una página 403
    }
  }, [ready, isAuthenticated, roleAllowed, router]);

  if (!ready) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">Cargando…</div>
      </div>
    );
  }

  return <>{children}</>;
}
