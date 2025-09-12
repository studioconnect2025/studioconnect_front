"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RedirectResetPassword() {
  return (
    <Suspense fallback={<p className="text-center text-gray-600">Redirigiendo...</p>}>
      <RedirectResetPasswordInner />
    </Suspense>
  );
}

function RedirectResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      router.replace(`/reset-password?token=${token}`);
    } else {
      router.replace("/reset-password");
    }
  }, [token, router]);


  return null;
}

