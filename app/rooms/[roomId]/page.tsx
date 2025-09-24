"use client";

import { useEffect, useState } from "react";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import { BookingService, Booking, BookingStatus } from "@/services/booking.services";
import { ReviewsService, Review } from "@/services/reviews.service";

/** Helper: intenta token desde localStorage o cookie "token" */
function getTokenSafe(): string {
  if (typeof window === "undefined") return "";
  const ls =
    localStorage.getItem("token") ??
    localStorage.getItem("accessToken") ??
    localStorage.getItem("authToken");
  if (ls) return ls;

  const m = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

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

        const token = getTokenSafe();

        // 1) Traer reseñas de la sala
        // 2) Traer reservas del músico (si hay token), en paralelo
        const [existingReviews, myBookings] = await Promise.all([
          ReviewsService.getRoomReviews(roomId),
          token ? BookingService.getMyBookings(token) : Promise.resolve<Booking[]>([]),
        ]);

        const now = new Date();

        const isCompletedOrConfirmed = (status: string | BookingStatus) => {
          const s = String(status).toUpperCase();
          return s === "CONFIRMED" || s === "COMPLETED" || s === "COMPLETADO";
        };

        // Coincidencia por roomId (preferente) o por nombre de room (fallback)
        const isSameRoom = (b: Booking) =>
          (b.roomId ? b.roomId === roomId : b.room === roomId);

        const finishedBookings = (myBookings ?? []).filter(
          (b) =>
            isSameRoom(b) &&
            isCompletedOrConfirmed(b.status) &&
            b.endTime &&
            new Date(b.endTime) < now
        );

        // Buscar una reserva que todavía no tenga reseña
        const bookingWithoutReview =
          finishedBookings.find((b) => !existingReviews.some((r) => r.booking?.id === b.id)) ?? null;

        if (!mounted) return;

        setReviews(existingReviews ?? []);
        setEligibleBooking(bookingWithoutReview);
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
