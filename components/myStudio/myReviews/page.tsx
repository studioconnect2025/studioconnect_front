// app/myStudio/myReviews/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ReviewsService, Review } from "@/services/reviews.service";
import { ReviewCard } from "@/components/reviews/ReviewCard";


export default function OwnerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchOwnerReviews() {
      try {
        const data = await ReviewsService.getOwnerReviews();
        if (mounted) setReviews(data);
      } catch (err) {
        console.error("Error cargando reseñas de dueño:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchOwnerReviews();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Cargando reseñas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reseñas de mis salas</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500">Todavía no tienes reseñas en tus salas.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
