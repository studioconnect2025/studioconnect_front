"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/AuthStore";
import { parseJwt } from "@/utils/jwt";

type Props = {
  children: React.ReactNode;
  roles?: string[];      // p.ej. ["Dueño de Estudio"]
  redirectTo?: string;   // default: /login
};

export default function RequireRole({ children, roles, redirectTo = "/login" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore((s) => ({
    isAuthenticated: s.isAuthenticated,
    user: s.user
  }));
  const [ready, setReady] = useState(false);

  // Restaura sesión desde localStorage si el store está vacío
  useEffect(() => {
    if (isAuthenticated) {
      setReady(true);
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`${redirectTo}?next=${next}`);
      return;
    }

    try {
      const claims = parseJwt<{ sub?: string; email?: string; role?: string }>(token);
      const finalUser = claims
        ? { id: claims.sub ?? "", email: claims.email ?? "", role: claims.role, name: (claims.email?.split("@")[0] as string) ?? "" }
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
      localStorage.removeItem("accessToken");
      useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false });
      const next = encodeURIComponent(pathname || "/");
      router.replace(`${redirectTo}?next=${next}`);
    }
  }, [isAuthenticated, pathname, redirectTo, router]);

  // Chequeo de rol (si se pasó `roles`)
  const roleAllowed = useMemo(() => {
    if (!roles?.length) return true;
    const current = useAuthStore.getState().user?.role;
    return !!current && roles.includes(current);
  }, [roles, user?.role]);

  useEffect(() => {
    if (ready && isAuthenticated && !roleAllowed) {
      router.replace("/"); // o una /403
    }
  }, [ready, isAuthenticated, roleAllowed, router]);

  if (!ready) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando…</p>
      </div>
    );
  }

  return <>{children}</>;
}
