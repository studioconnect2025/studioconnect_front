"use client";

import { useState } from "react";

type Props = {
  photos: string[];
  altBase: string;
};

export default function Gallery({ photos, altBase }: Props) {
  const [active, setActive] = useState(0);

  const main = photos[active] ?? "";
  const thumbs = photos.slice(0, 5); 

  return (
    <>
      {/* Imagen principal (800 × 220) */}
      {main ? (
        <img
          src={main}
          alt={`${altBase} - foto ${active + 1}`}
          className="w-full h-[220px] rounded-md object-cover"
        />
      ) : (
        <div className="w-full h-[220px] rounded-md bg-[#F3F4F6]" />
      )}

      {/* Thumbnails */}
      <div className="mt-3 grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => {
          const src = thumbs[i + 1];
          const isActive = active === i + 1;
          return src ? (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i + 1)}
              className={[
                "h-[70px] w-full overflow-hidden rounded-md",
                "ring-2 ring-transparent hover:ring-[#0B0F12]/20",
                isActive ? "ring-[#0B0F12]" : "",
              ].join(" ")}
              aria-label={`Ver foto ${i + 2}`}
            >
              <img src={src} alt={`${altBase} - miniatura ${i + 2}`} className="h-full w-full object-cover" />
            </button>
          ) : (
            <div key={i} className="h-[70px] w-full rounded-md bg-[#F3F4F6]" />
          );
        })}
      </div>
    </>
  );
}
