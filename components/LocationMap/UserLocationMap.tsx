"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configuración del ícono de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png", 
/*   iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png", */
});

const UserLocationMap = () => {
  // Estado para la ubicación del usuario
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation no soportada por el navegador");
      return;
    }

    // Obtenemos la ubicación inicial
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.error("Error obteniendo ubicación:", err);
        // Posicion default
        setPosition([-34.6037, -58.3816])
      }
    );
  }, []);

  if (!position) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-gray-200 rounded-xl">
        Obteniendo ubicación...
      </div>
    );
  }

  return (
    <div className="text-black p-4 rounded-xl h-80 w-full">
      <h2 className="mb-2">Mi ubicación</h2>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="h-54 w-full rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Ubicación del usuario</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default UserLocationMap;
