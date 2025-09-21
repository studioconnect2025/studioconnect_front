// components/riviews/ReviewForm.tsx
"use client";

import React, { useState } from "react";
import { ReviewsService } from "@/services/reviews.service";
import { useRouter } from "next/navigation";

export default function ReviewForm({
  bookingId,
  onSuccess,
}: {
  bookingId: string;
  onSuccess?: (r: any) => void;
}) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return alert("Falta bookingId");
    setLoading(true);
    try {
      // Si tu http no añade el token automáticamente, obtén token de tu store/localStorage
      // const token = localStorage.getItem("token");
      // await ReviewsService.createReview(bookingId, { rating, comment }, token ?? undefined);
      const res = await ReviewsService.createReview(bookingId, { rating, comment });
      onSuccess?.(res);
      // refrescar la página o redirigir:
      router.refresh();
      alert("Reseña creada correctamente");
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Error creando reseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded">
      <div>
        <label className="block text-sm font-medium mb-1">Calificación</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded p-2"
        >
          <option value={5}>5 - Excelente</option>
          <option value={4}>4 - Muy bueno</option>
          <option value={3}>3 - Bueno</option>
          <option value={2}>2 - Regular</option>
          <option value={1}>1 - Malo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Comentario (opcional)</label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar reseña"}
        </button>
      </div>
    </form>
  );
}
