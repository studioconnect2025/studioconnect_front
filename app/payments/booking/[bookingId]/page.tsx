"use client";

import BookingCheckout from "@/components/payments/BookingCheckout";

export default function BookingPaymentPage({
  params,
}: {
  params: { bookingId: string };
}) {
  return (
    <div>
      <BookingCheckout bookingId={params.bookingId} />
    </div>
  );
}
//app/payments/booking/[bookingId]/page.tsx
