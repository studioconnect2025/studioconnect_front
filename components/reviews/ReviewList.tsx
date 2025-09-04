"use client";

import { ReviewCard } from "./ReviewCard";
import REVIEWS from "@/mocks/review";

export function ReviewList() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10">
      <header className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl text-black">
          Opiniones de nuestros usuarios
        </h2>
        <p className="text-black mt-4">
          Únete a miles de músicos y dueños de estudios que ya confían en StudioConnect
        </p>
      </header>

    <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
  {REVIEWS.map((r, idx) => (
    <ReviewCard key={idx} review={r} />
  ))}
</div>
    </section>
  );
}
