"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RedirectResetPassword() {
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

  return <p className="text-center text-gray-600">Redirigiendo...</p>;
}
