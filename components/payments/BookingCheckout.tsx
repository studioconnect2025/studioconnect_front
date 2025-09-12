// src/components/payments/BookingCheckout.tsx
"use client";

import { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import Button from "@/components/ui/Button";

interface BookingCheckoutProps {
  bookingId: string;
  instrumentIds?: string[];
}

export default function BookingCheckout({ bookingId, instrumentIds = [] }: BookingCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 1. Obtener clientSecret del backend
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/booking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ajustar si usás otro sistema de auth
          },
          body: JSON.stringify({ bookingId, instrumentIds }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al crear el pago");

        setClientSecret(data.clientSecret);
      } catch (error: any) {
        setErrorMsg(error.message);
      }
    };

    fetchPaymentIntent();
  }, [bookingId, instrumentIds]);

  // 🔹 2. Confirmar pago
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payments/success`, // 🔹 redirige a una página de éxito
      },
    });

    if (error) {
      setErrorMsg(error.message || "Error al procesar el pago");
      setLoading(false);
    }
  };

  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;
  if (!clientSecret) return <p>Cargando pasarela de pago...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? "Procesando..." : "Pagar Reserva"}
      </Button>
    </form>
  );
}
