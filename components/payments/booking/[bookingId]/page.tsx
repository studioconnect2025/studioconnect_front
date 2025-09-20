"use client";

import { useParams } from "next/navigation";
import BookingCheckout from "@/components/payments/BookingCheckout";

export default function BookingPaymentPage() {
  const { bookingId } = useParams();

  if (!bookingId || typeof bookingId !== "string") {
    return <p>ID de reserva inválido</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <BookingCheckout bookingId={bookingId} />
    </div>
  );
}
