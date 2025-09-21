// components/riviews/RiviewCard.tsx
"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "@/services/reviews.service";

export function ReviewCard({ review }: { review: Review }) {
  const rating = review.rating ?? 0;
  const musician = review.musician ?? ({} as any);
  const name =
    musician.name ||
    [musician.firstName, musician.lastName].filter(Boolean).join(" ") ||
    "Usuario";
  const role = musician.role ?? "";
  const avatar = musician.avatarUrl ?? "/avatars/default.jpg";
  const createdAt = review.createdAt ?? (review as any).created_at ?? null;
  const date = createdAt ? new Date(createdAt).toLocaleDateString() : "";

  return (
    <div className="h-full hover:shadow-2xl rounded-xl border bg-white shadow-sm p-5 flex flex-col">
      {/* estrellas */}
      <div className="mb-3 flex gap-1">
        {[...Array(5)].map((_, i) => {
          const filled = i < rating;
          return (
            <Star
              key={i}
              className={`h-4 w-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
            />
          );
        })}
      </div>

      {/* el comentario ocupa el espacio variable */}
      <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 flex-1">
        {review.comment ?? "—"}
      </p>

      {/* footer pegado abajo */}
      <div className="mt-4 flex items-center gap-3">
        <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src={avatar} alt={name} fill className="object-cover" sizes="40px" />
        </div>

        <div>
          <p className="text-sm text-gray-900">{name}</p>
          <p className="text-xs text-gray-600">
            {role} {date ? `• ${date}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
