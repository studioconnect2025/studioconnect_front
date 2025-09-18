'use client';

import React from 'react';
import { googleMapsEmbedUrl } from './mapUrl';

type Props = {
  mapQuery: string; 
  address?: string;   
  className?: string; 
};

export default function StudioLocationMap({ mapQuery, address, className }: Props) {
  const src = googleMapsEmbedUrl(mapQuery);

  return (
    <div className={className ?? ''}>
      <div className="w-full overflow-hidden rounded-xl">
        <iframe
          src={src}
          className="w-full h-64 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-label="Mapa de ubicación del estudio"
        />
      </div>
      {address ? (
        <p className="mt-2 text-sm text-gray-700">{address}</p>
      ) : null}
    </div>
  );
}
