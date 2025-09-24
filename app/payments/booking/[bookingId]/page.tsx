import BookingPaymentClient from "./BookingPaymentClient";

export default function Page({ params }: { params: { bookingId: string } }) {
  return <BookingPaymentClient bookingId={params.bookingId} />;
}
