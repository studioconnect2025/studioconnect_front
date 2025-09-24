"use client";

import { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { PaymentsService } from "@/services/payments.service";

interface BookingCheckoutProps {
  clientSecret: string | null;
  bookingId: string;
}

export default function BookingCheckout({ clientSecret, bookingId }: BookingCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/myBookings`
        },
        redirect: "if_required",
      });

      const { error, paymentIntent } = result;

      if (error) {
        setErrorMsg(error.message || "Error al procesar el pago");
      } else if (paymentIntent?.status === "succeeded") {
        try {
          // El pago fue autorizado. Ahora, notifica al backend para capturar el pago.
          await PaymentsService.confirmPayment(paymentIntent.id, bookingId);
          localStorage.setItem("bookingJustPaid", bookingId);
          localStorage.setItem("bookingPaymentIntent", paymentIntent.id || "");
        } catch (err) {
          console.error("Error al confirmar el pago en el backend:", err);
          setErrorMsg("Pago exitoso, pero hubo un error al confirmar. Contacta a soporte.");
        }
        router.push("/myBookings");
      } else if ('url' in result && typeof result.url === 'string') {
        router.push(result.url);
      }
    } catch (err: any) {
      console.error("Error durante confirmPayment:", err);
      setErrorMsg(err?.message || "Error inesperado al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;
  if (!clientSecret) return <p>No se pudo cargar la pasarela de pago. Inténtalo de nuevo.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">Pagar Reserva</h2>
        <PaymentElement />
        <Button type="submit" disabled={!stripe || loading || !clientSecret} className="w-full bg-sky-700 text-white hover:bg-sky-800 transition">
          {loading ? "Procesando..." : "Pagar Reserva"}
        </Button>
      </form>
    </div>
  );
}
