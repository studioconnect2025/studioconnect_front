"use client";
import { FeaturedStudioCard } from "./FeatureStudioCard";
import { STUDIOS } from "@/mocks/studios";

export function FeaturedStudiosList({ limit = 3 }: { limit?: number }) {
  const items = Object.entries(STUDIOS).slice(0, limit); 

  return (
    <section className="w-full max-w-6xl mx-auto px-4">
      <header className="text-center mb-6">
        <h2 className="text-black text-2xl sm:text-3xl md:text-4xl text-center font-medium">Estudios destacados</h2>
        <p className="text-black text-sm sm:text-base md:text-lg text-center mb-6 mt-2 sm:mt-4">Descubrí los mejor valorados de tu zona</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(([id, studio]) => (
          <FeaturedStudioCard key={id} id={id} studio={studio} />
        ))}
      </div>
    </section>
  );
}
