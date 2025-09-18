"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup , Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { OwnerService, Studio } from "@/services/studio.services";

const studioIcon = new L.Icon({
    iconUrl: "/ubicacion.png",
    iconRetinaUrl: "/ubicacion.png",
    iconSize: [56, 61],
    iconAnchor: [28, 61],
    popupAnchor: [0, -61],
});

const userIcon = new L.Icon({
    iconUrl: "/ubication2.png",
    iconRetinaUrl: "/ubicacion.png",
    iconSize: [47, 60],
    iconAnchor: [28, 61],
    popupAnchor: [0, -61],
});

interface StudiosMapProps {
    center: [number, number];
}

export default function StudiosMap({ center }: StudiosMapProps) {
    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [mapCenter, setMapCenter] = useState<[number, number]>(center);

    useEffect(() => {
        setMapCenter(center);
    }, [center]);

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
            <div className="h-80 w-full bg-gray-200 rounded-xl flex items-center justify-center">
                Cargando estudios...
            </div>
        );
    }

    if (studios.length === 0) {
        return (
            <div className="h-80 w-full bg-gray-200 rounded-xl flex items-center justify-center">
                No hay estudios disponibles con coordenadas
            </div>
        );
    }

    return (
        <div className="h-80 w-full rounded-xl overflow-hidden">
            <MapContainer
                center={mapCenter}
                zoom={10}
                className="h-full w-full"
                key={`${mapCenter[0]}-${mapCenter[1]}`}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Marcador usuario */}
                <Marker position={mapCenter} icon={userIcon}>
                    <Tooltip
                        direction="top"
                        offset={[0, -55]}
                        opacity={1}
                        permanent
                    >
                        <span className="font-bold text-sm text-sky-700">
                            Tu
                        </span>
                    </Tooltip>
                </Marker>

                {/* Marcadores de estudios */}
                {studios.map((studio) => (
                    <Marker
                        key={studio.id}
                        position={[studio.lat!, studio.lng!]}
                        icon={studioIcon}
                    >
                        <Popup>
                            <div className="w-48">
                                <img
                                    src={
                                        studio.photos &&
                                        studio.photos.length > 0
                                            ? studio.photos[0]
                                            : "/placeholder.png"
                                    }
                                    alt={studio.name}
                                    className="w-full h-24 object-cover rounded-md"
                                />
                                <div className="mt-2">
                                    <h3 className="font-semibold text-sm">
                                        {studio.name}
                                    </h3>
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
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
