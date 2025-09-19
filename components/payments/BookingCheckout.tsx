"use client";

import { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import Button from "@/components/ui/Button";
import axios from "axios";
import { useRouter } from "next/navigation";

interface BookingCheckoutProps {
  bookingId: string;
  instrumentIds?: string[];
}

export default function BookingCheckout({ bookingId, instrumentIds = [] }: BookingCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (!token) throw new Error("No hay sesión activa. Iniciá sesión para pagar.");

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}payments/booking`,
          { bookingId, instrumentIds },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClientSecret(data.clientSecret);
      } catch (error: any) {
        console.error("Error creando PaymentIntent (booking):", error);
        setErrorMsg(error?.response?.data?.message || error?.message || "Error al crear el pago");
      }
    };

    fetchPaymentIntent();
  }, [bookingId, instrumentIds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payments/success`,
        },
        redirect: "if_required", // evita redirect automático si no es necesario
      });

      const { error, paymentIntent } = result as any;

      if (error) {
        setErrorMsg(error.message || "Error al procesar el pago");
      } else if (paymentIntent?.status === "succeeded") {
        try {
          localStorage.setItem("bookingJustPaid", bookingId);
          localStorage.setItem("bookingPaymentIntent", paymentIntent.id || "");
        } catch (err) {
          console.warn("no se pudo guardar bookingJustPaid en localStorage", err);
        }

        // redirigimos al perfil (misma página para ambos roles)
        router.push("/musicianProfile");
      } else {
        // si Stripe hizo redirect, la confirmación se tratará en /payments/success
        // pero por seguridad, guardamos si tenemos paymentIntent
        if (paymentIntent?.id) {
          localStorage.setItem("bookingPaymentIntent", paymentIntent.id);
        }
      }
    } catch (err: any) {
      console.error("Error durante confirmPayment:", err);
      setErrorMsg(err?.message || "Error inesperado al procesar el pago");
    } finally {
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
