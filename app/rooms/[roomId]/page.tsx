"use client";

import { useEffect, useState } from "react";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import { BookingService, Booking } from "@/services/booking.services";
import { ReviewsService, Review } from "@/services/reviews.service";

export default function RoomPage(props: any) {
  // ⚡️ Extraemos roomId de forma segura
  const roomId = props?.params?.roomId as string;

  const [eligibleBooking, setEligibleBooking] = useState<Booking | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Traer reseñas existentes
        const existingReviews = await ReviewsService.getRoomReviews(roomId);

        // 2. Traer reservas del músico
        const myBookings = await BookingService.getMyBookings();

        // 3. Filtrar reservas de esta sala que ya terminaron y están confirmadas/completadas
        const now = new Date();
        const validBookings = (myBookings ?? []).filter(
          (b) =>
            b.room === roomId &&
            ["CONFIRMED", "COMPLETED"].includes((b.status || "").toUpperCase()) &&
            new Date(b.endTime) < now
        );

        // 4. Encontrar una booking que todavía no tenga reseña
        const bookingWithoutReview = validBookings.find(
          (b) => !existingReviews.some((r) => r.booking?.id === b.id)
        );

        if (mounted) {
          setReviews(existingReviews ?? []);
          setEligibleBooking(bookingWithoutReview ?? null);
        }
      } catch (err: any) {
        console.error("Error cargando datos de sala:", err);
        if (mounted) setError(err?.message ?? "Error cargando datos");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [roomId]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Aquí iría el detalle de la sala (imagen, precio, descripción...) */}

      <ReviewList reviews={reviews} roomId={roomId} />

      {!loading && eligibleBooking && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Deja tu reseña</h3>
          <ReviewForm
            bookingId={eligibleBooking.id}
            onSuccess={(newReview) => {
              // Agregar la nueva reseña al listado
              setReviews((prev) => [newReview, ...prev]);
              setEligibleBooking(null);
            }}
          />
        </div>
      )}

      {error && (
        <div className="mt-6">
          <p className="text-red-600">Ocurrió un error: {error}</p>
        </div>
      )}
    </div>
  );
}
