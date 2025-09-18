"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { OwnerService, Studio } from "@/services/studio.services";
import Link from "next/link";

export default function Search() {
    const searchParams = useSearchParams();
    const location = searchParams.get("location") || "";
    const type = searchParams.get("type") || "";
    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredType, setFilteredType] = useState<string>(type);

    useEffect(() => {
        async function fetchStudios() {
            try {
                const data = await OwnerService.getAllStudios();
                let filtered = data;
                if (location) {
                    const locParts = location
                        .split(",")
                        .map((s) => s.trim().toLowerCase());
                    const cityQuery = locParts[0];
                    const provinceQuery = locParts[1];
                    const countryQuery = locParts[2];

                    filtered = filtered.sort((a, b) => {
                        const aCity = a.city?.toLowerCase() || "";
                        const aProvince = a.province?.toLowerCase() || "";
                        const aCountry = a.country?.toLowerCase() || "";

                        const bCity = b.city?.toLowerCase() || "";
                        const bProvince = b.province?.toLowerCase() || "";
                        const bCountry = b.country?.toLowerCase() || "";

                        const score = (c: string, p: string, co: string) => {
                            if (c.includes(cityQuery)) return 3;
                            if (p.includes(provinceQuery)) return 2;
                            if (co.includes(countryQuery)) return 1;
                            return 0;
                        };

                        return (
                            score(bCity, bProvince, bCountry) -
                            score(aCity, aProvince, aCountry)
                        );
                    });
                }
                if (type) {
                    filtered = filtered.filter(
                        (studio) =>
                            studio.studioType?.toLowerCase() ===
                            type.toLowerCase()
                    );
                }
                setStudios(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchStudios();
    }, [location, type]);
    const filteredStudios = filteredType
        ? studios.filter(
              (s) => s.studioType?.toLowerCase() === filteredType.toLowerCase()
          )
        : studios;

    if (loading) return <p>Cargando estudios...</p>;
    if (studios.length === 0)
        return <p>No hay estudios disponibles en esta zona</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">
                {filteredStudios.length} estudios encontrados{" "}
                {location && `en ${location}`}
            </h2>

            <div className="mb-4">
                <label>Tipo de estudio: </label>
                <select
                    className="border p-1 rounded"
                    value={filteredType}
                    onChange={(e) => setFilteredType(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="Grabación">Grabación</option>
                    <option value="Ensayo">Ensayo</option>
                    <option value="Producción">Producción</option>
                </select>
            </div>

            <div className="flex flex-col gap-4">
                {filteredStudios.map((studio) => (
                    <div
                        key={studio.id}
                        className="border p-4 rounded flex gap-4"
                    >
                        <div className="w-32 h-24 bg-gray-200 flex-shrink-0">
                            <img
                                src={
                                    studio.photos && studio.photos.length > 0
                                        ? studio.photos[0]
                                        : "/placeholder.png"
                                }
                                alt={studio.name}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{studio.name}</h3>
                            <p className="text-sm text-gray-500">
                                {studio.studioType}
                            </p>
                            <p className="text-sm">{studio.description}</p>
                            <Link
                                href={`/studios/${studio.id}`}
                                className="text-blue-600 hover:underline mt-2 inline-block"
                            >
                                Ver detalle →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
