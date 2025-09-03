"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
});

export const UserLocationMap = () => {
  const position: [number, number] = [-34.6037, -58.3816];
  

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
