"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const sp = useSearchParams();
  useEffect(() => {
    const next = sp.get("next") || "/myStudio";
    router.replace(`/?auth=login&next=${encodeURIComponent(next)}`);
  }, [router, sp]);
  return null;
}
