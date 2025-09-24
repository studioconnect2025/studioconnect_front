"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BookingCheckout from "@/components/payments/BookingCheckout";
import { BookingService } from "@/services/booking.services";
import { toast } from "react-toastify";

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = pk ? loadStripe(pk) : null;

export default function BookingPaymentClient({ bookingId }: { bookingId: string }) {
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const qsClientSecret = searchParams.get("cs");
  const token = useMemo(
    () => (typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : ""),
    []
  );

  useEffect(() => {
    const init = async () => {
      try {
        if (!pk) {
          toast.error("Stripe publishable key no configurada");
          setLoading(false);
          return;
        }
        if (qsClientSecret) {
          setClientSecret(qsClientSecret);
          setLoading(false);
          return;
        }
        if (!token) {
          toast.error("No hay sesión. Iniciá sesión para pagar.");
          setLoading(false);
          return;
        }
        const { clientSecret: cs } = await BookingService.payBooking({ bookingId }, token);
        setClientSecret(cs);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.response?.data?.message ?? "No se pudo iniciar el pago");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [bookingId, qsClientSecret, token]);

  if (!stripePromise) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-500">Falta <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>.</p>
    </div>;
  }
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-sky-700">Iniciando pago…</p>
    </div>;
  }
  if (!clientSecret) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-500">No se pudo obtener el client secret.</p>
    </div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="max-w-xl mx-auto p-4">
        <BookingCheckout bookingId={bookingId} clientSecret={clientSecret} />
      </div>
    </Elements>
  );
}
