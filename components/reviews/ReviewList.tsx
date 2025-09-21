// components/reviews/ReviewList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Review as ReviewType, ReviewsService } from "@/services/reviews.service";
import { ReviewCard } from "./ReviewCard";

interface ReviewListProps {
  /** Si pasás `reviews`, el componente renderiza esos reviews (modo controlado).
      Si no, podés pasar `roomId` y el componente hará la petición (via axios). */
  reviews?: ReviewType[];
  roomId?: string;
  title?: string;
  className?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews: propReviews,
  roomId,
  title = "Opiniones de nuestros usuarios",
  className = "",
}) => {
  const [reviews, setReviews] = useState<ReviewType[]>(propReviews ?? []);
  const [loading, setLoading] = useState<boolean>(!propReviews && !!roomId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si recibimos reviews por prop, usamos eso (modo controlado).
    if (propReviews) {
      setReviews(propReviews);
      setLoading(false);
      setError(null);
      return;
    }

    // Si no hay roomId, no intentamos llamar a la API (evitamos undefined).
    if (!roomId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    ReviewsService.getRoomReviews(roomId)
      .then((data) => {
        if (!mounted) return;
        setReviews(data ?? []);
      })
      .catch((err: any) => {
        console.error("Error cargando reviews:", err);
        if (!mounted) return;
        setError(err?.message ?? "No se pudieron cargar las reseñas");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [roomId, propReviews]);

  return (
    <section className={`w-full max-w-6xl mx-auto px-4 py-10 ${className}`}>
      <header className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl text-black">{title}</h2>
        <p className="text-black mt-4">
          Únete a miles de músicos y dueños de estudios que ya confían en StudioConnect
        </p>
      </header>

      {loading && <p className="text-center">Cargando reseñas...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-600">
              {roomId ? "Aún no hay reseñas para esta sala." : "No hay reseñas para mostrar."}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {reviews.map((r) => (
                <div key={r.id} className="flex">
                  <ReviewCard review={r} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ReviewList;
