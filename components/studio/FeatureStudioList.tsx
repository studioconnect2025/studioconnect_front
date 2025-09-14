"use client";

import { useEffect, useState } from "react";
import { FeaturedStudioCard } from "./FeatureStudioCard";
import { OwnerService, type Studio as ServiceStudio } from "@/services/studio.services";
import type { FeaturedStudio } from "@/types/featuredStudio";

export function FeaturedStudiosList({ limit = 3 }: { limit?: number }) {
  const [items, setItems] = useState<FeaturedStudio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 1) Traer estudios (listado base)
        const studios = (await OwnerService.getAllStudios()) as ServiceStudio[];

        // 2) Ordenar por fecha si existe createdAt
        const sorted =
          Array.isArray(studios) && studios.length
            ? [...studios].sort((a: any, b: any) =>
                a?.createdAt && b?.createdAt
                  ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  : 0
              )
            : [];

        // 3) Mapear a FeaturedStudio (mínimo)
        const baseFeatured = sorted.map<FeaturedStudio>((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          location: undefined,
          rating: undefined,
          photos: undefined,
          amenities: undefined,
          pricePerHour: undefined,
          createdAt: s?.createdAt,
        }));

        // 4) Tomar los N primeros y ENRIQUECER con detalle (para traer photos reales)
        const base = baseFeatured.slice(0, limit);

        const enriched = await Promise.all(
          base.map(async (f) => {
            try {
              const detail = (await OwnerService.getStudioById(f.id)) as any;
              return {
                ...f,
                photos: detail?.photos ?? f.photos ?? [],
                location: detail?.city ?? detail?.address ?? f.location,
                rating: typeof detail?.rating === "number" ? detail.rating : f.rating,
                amenities: Array.isArray(detail?.amenities) ? detail.amenities : f.amenities,
                // si querés mostrar precio en la card, tomamos el primero disponible
                pricePerHour:
                  typeof detail?.pricePerHour === "number"
                    ? detail.pricePerHour
                    : Array.isArray(detail?.rooms) && typeof detail.rooms[0]?.pricePerHour === "number"
                    ? detail.rooms[0].pricePerHour
                    : f.pricePerHour,
              } as FeaturedStudio;
            } catch {
              return { ...f, photos: f.photos ?? [] } as FeaturedStudio;
            }
          })
        );

        if (mounted) setItems(enriched);
      } catch (e) {
        console.error("Error cargando estudios:", e);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-4 mb-6">
      <header className="text-center mb-6">
        <h2 className="text-black text-2xl sm:text-3xl md:text-3xl text-center font-medium">
          Estudios destacados
        </h2>
        <p className="text-black text-sm sm:text-base md:text-lg text-center mb-6 mt-2 sm:mt-4">
          Descubrí los mejor valorados de tu zona
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {items.map((studio) => (
            <FeaturedStudioCard key={studio.id} id={studio.id} studio={studio} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-600">No hay estudios para mostrar.</p>
      )}
    </section>
  );
}
