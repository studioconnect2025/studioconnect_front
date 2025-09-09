'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/AuthStore'; // Importa tu store
import { parseJwt } from '@/utils/jwt'; // Asumo que tienes esta utilidad

function SSOContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      try {
        localStorage.setItem('accessToken', token);
        const claims = parseJwt<{ sub?: string; email?: string; role?: string }>(token);
        const user = claims
          ? {
              id: claims.sub ?? "",
              email: claims.email ?? "",
              role: claims.role,
              name: (claims.email?.split("@")[0] as string) ?? "",
            }
          : null;

        if (user) {
          // --- AJUSTE AQUÍ ---
          // Simplemente pasa el usuario y el token.
          // La lógica de isAuthenticated: true ya está dentro de la función setAuth en tu store.
          setAuth({
            user: user,
            accessToken: token,
          });
        }

        router.replace('/studioDashboard');

      } catch (error) {
        console.error("Error al procesar el token:", error);
        router.replace('/login?error=token_invalido');
      }
    } else {
      router.replace('/login?error=sso_fallido');
    }
  }, [router, searchParams, setAuth]);

  return <div>Verificando autenticación...</div>;
}

// Usamos Suspense para asegurar que los searchParams estén disponibles del lado del cliente
export default function SSOPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <SSOContent />
        </Suspense>
    )
}