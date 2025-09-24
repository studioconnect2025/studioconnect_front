"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BookingCheckout from "@/components/payments/BookingCheckout";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function BookingPaymentPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('cs');

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: El ID de la reserva no es válido. No se puede iniciar el pago.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <BookingCheckout bookingId={params.bookingId} clientSecret={clientSecret} />
    </Elements>
  );
}