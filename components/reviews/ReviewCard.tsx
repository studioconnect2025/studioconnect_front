"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "@/mocks/review";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="h-full hover:shadow-2xl rounded-xl border bg-white shadow-sm p-5 flex flex-col">
      {/* estrellas */}
      <div className="mb-3 flex gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>

      {/* el comentario ocupa el espacio variable */}
      <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 flex-1">
        {review.comment}
      </p>

      {/* footer pegado abajo */}
 <div className="mt-4 flex items-center gap-3">
  <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
    <Image
      src={review.avatarUrl ?? "/avatars/default.jpg"}
      alt={review.name}
      fill
      className="object-cover"
      sizes="40px"
    />
  </div>

  <div>
    <p className="text-sm  text-gray-900">{review.name}</p>
    <p className="text-xs text-gray-600">{review.role}</p>
  </div>
</div>
    </div>
  );
}
