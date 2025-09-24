import BookingPaymentClient from "./BookingPaymentClient";

export default async function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  return <BookingPaymentClient bookingId={bookingId} />;
}
