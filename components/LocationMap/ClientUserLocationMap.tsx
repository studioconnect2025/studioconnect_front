'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
interface ClientUserLocationMapProps {
  center: [number, number];
}

const StudiosMap = dynamic<{ center: [number, number] }>(
  () => import('./UserLocationMap'),
  { ssr: false }
);

export default function ClientUserLocationMap({ center }: ClientUserLocationMapProps) {
  return (
    <Suspense fallback={<div className="h-80 w-full bg-gray-200 rounded-xl flex items-center justify-center">Cargando mapa...</div>}>
      <StudiosMap center={center} />
    </Suspense>
  );
}
