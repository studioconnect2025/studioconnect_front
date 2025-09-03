// components/LocationMap/ClientUserLocationMap.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import dinámico del mapa real
const UserLocationMap = dynamic(
  () => import('./UserLocationMap'),
  { ssr: false }
);

export default function ClientUserLocationMap() {
  return (
    <Suspense fallback={
      <div className="h-80 w-full bg-gray-200 rounded-xl flex items-center justify-center">
        Cargando mapa...
      </div>
    }>
      <UserLocationMap />
    </Suspense>
  );
}
