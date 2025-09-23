'use client';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

interface ClientUserLocationMapProps {
  defaultCenter: [number, number]; // Buenos Aires
}

const StudiosMap = dynamic<{ center: [number, number] }>(
  () => import('./UserLocationMap'),
  { ssr: false }
);

export default function ClientUserLocationMap({ defaultCenter }: ClientUserLocationMapProps) {
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [geoDenied, setGeoDenied] = useState(false);
  const [geoChecked, setGeoChecked] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setGeoDenied(false);
          setGeoChecked(true);
        },
        (error) => {
          console.warn("Ubicación no disponible, usando centro por defecto", error);
          setGeoDenied(true);
          setGeoChecked(true);
        }
      );
    } else {
      console.warn("Geolocalización no soportada");
      setGeoDenied(true);
      setGeoChecked(true);
    }
  }, []);

  return (
    <div>
      {geoChecked && geoDenied && (
        <div className="text-xl font-semibold mb-4 flex flex-col items-center justify-center p-2 border rounded-xl bg-yellow-50 text-center text-yellow-500 ">
          Habilite su ubicación en el navegador y recargue para ver el mapa en su ubicación actual
        </div>
      )}
      <Suspense
        fallback={
          <div className="h-80 w-full bg-gray-200 rounded-xl flex items-center justify-center">
            Cargando mapa...
          </div>
        }
      >
        <StudiosMap center={center} />
      </Suspense>
    </div>
  );
}
