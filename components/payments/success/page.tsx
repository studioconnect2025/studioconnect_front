"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function MembershipSuccessPage() {
  const params = useSearchParams();
  const paymentIntentId = params.get("payment_intent");
  const [status, setStatus] = useState("Verificando...");

  useEffect(() => {
    if (!paymentIntentId) return;

    const checkStatus = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/confirm/${paymentIntentId}`);
      const data = await res.json();

      if (data.isActive) {
        setStatus("✅ Membresía activada con éxito!");
      } else {
        setStatus("❌ Hubo un problema con el pago.");
      }
    };

    checkStatus();
  }, [paymentIntentId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">{status}</h1>
    </div>
  );
}
