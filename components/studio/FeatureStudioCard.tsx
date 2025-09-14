"use client";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { FeaturedStudio } from "@/types/featuredStudio";

type Props = { id: string; studio: FeaturedStudio };

export function FeaturedStudioCard({ id, studio }: Props) {
  const cover =
    studio.photos && studio.photos.length > 0
      ? studio.photos[0]
      : "/images/placeholders/studio-cover.webp";

  const hasPrice = typeof studio.pricePerHour === "number";
  

  return (
    <div className="rounded-xl hover:shadow-2xl border cursor-pointer bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <div className="relative h-40 w-full bg-gray-100">
        <Image
          src={cover}
          alt={studio.name}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg text-black">{studio.name}</h3>
            {studio.location && (
              <p className="text-sm text-gray-500">{studio.location}</p>
            )}
          </div>
          {typeof studio.rating === "number" && (
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-700">
                {studio.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {studio.description && (
          <p className="text-sm text-black line-clamp-2">{studio.description}</p>
        )}

        {!!studio.amenities?.length && (
          <div className="flex flex-wrap gap-2">
            {studio.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {a}
              </span>
            ))}
            {studio.amenities.length > 3 && (
              <span className="text-xs text-gray-700">
                +{studio.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        <div
          className={`mt-auto flex items-center gap-3 ${
            hasPrice ? "justify-between" : "justify-end"
          }`}
        >
          {hasPrice && (
            <p className="text-base text-black">
              ${studio.pricePerHour!.toLocaleString("es-AR")}/hr
            </p>
          )}
          <Link
            href={`/studios/${id}`}
            className="inline-flex items-center justify-center rounded-lg bg-[#00618E] text-white px-4 py-2 text-sm hover:bg-gray-800 transition"
          >
            Reservar ahora
          </Link>
        </div>
      </div>
    </div>
  );
}
