"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { OwnerService, Studio } from "@/services/studio.services";

// Íconos
const studioIcon = new L.Icon({
  iconUrl: "/ubicacion.png",
  iconRetinaUrl: "/ubicacion.png",
  iconSize: [56, 61],
  iconAnchor: [28, 61],
  popupAnchor: [0, -61],
});

const userIcon = new L.Icon({
  iconUrl: "/ubication2.png",
  iconRetinaUrl: "/ubicacion2.png",
  iconSize: [47, 60],
  iconAnchor: [28, 61],
  popupAnchor: [0, -61],
});

// Dynamic MapContainer para evitar SSR
const DynamicMapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const DynamicTileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const DynamicMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const DynamicPopup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const DynamicTooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

interface StudiosMapProps {
  center: [number, number];
}

export default function StudiosMap({ center }: StudiosMapProps) {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudios() {
      try {
        const data = await OwnerService.getAllStudios();
        const studiosWithCoords = data.filter((s) => s.lat && s.lng);
        setStudios(studiosWithCoords);
      } catch (err) {
        console.error("Error cargando estudios:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudios();
  }, []);

  if (loading) {
    return (
      <div className="h-80 w-full rounded-xl bg-gray-100 flex items-center justify-center text-sky-700 font-semibold">
        Cargando estudios...
      </div>
    );
  }

  if (studios.length === 0) {
    return (
      <div className="h-80 w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
        No hay estudios disponibles con coordenadas
      </div>
    );
  }

  return (
    <div className="h-80 w-full rounded-xl overflow-hidden">
      <DynamicMapContainer center={center} zoom={10} className="h-full w-full">
        <DynamicTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador usuario */}
        <DynamicMarker position={center} icon={userIcon}>
          <DynamicTooltip direction="top" offset={[0, -55]} opacity={1} permanent>
            <span className="font-bold text-sm text-sky-700">Tú</span>
          </DynamicTooltip>
        </DynamicMarker>

        {/* Marcadores de estudios */}
        {studios.map((studio) => (
          <DynamicMarker
            key={studio.id}
            position={[studio.lat!, studio.lng!]}
            icon={studioIcon}
          >
            <DynamicPopup>
              <div className="w-48">
                <img
                  src={
                    studio.photos && studio.photos.length > 0
                      ? studio.photos[0]
                      : "/placeholder.png"
                  }
                  alt={studio.name}
                  className="w-full h-24 object-cover rounded-md"
                />
                <div className="mt-2">
                  <h3 className="font-semibold text-sm">{studio.name}</h3>
                  <p className="text-xs text-gray-500">
                    {studio.studioType || "Tipo de estudio"}
                  </p>
                  <Link
                    href={`/studios/${studio.id}`}
                    className="mt-2 inline-block text-xs text-blue-600 hover:underline"
                  >
                    Ver detalle →
                  </Link>
                </div>
              </div>
            </DynamicPopup>
          </DynamicMarker>
        ))}
      </DynamicMapContainer>
    </div>
  );
}
