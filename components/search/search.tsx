"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { OwnerService, Studio } from "@/services/studio.services";
import { FeaturedStudioCard } from "@/components/studio/FeatureStudioCard";
import type { FeaturedStudio } from "@/types/featuredStudio";
import { BannerSearch } from "@/components/banners/BannerSearch";

type Props = { id: string; studio: FeaturedStudio };

export default function Search() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedType, setSelectedType] = useState<string>(type || "Todos");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchStudios = async () => {
    setLoading(true);
    try {
      const data = await OwnerService.getAllStudios();
      setStudios(data || []);
    } catch (err: any) {
      setError(err?.message || "Error al obtener estudios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const rawLocation = location.trim();
  const firstTerm = useMemo(() => {
    if (!rawLocation) return "";
    if (rawLocation.includes(",")) return rawLocation.split(",")[0].trim().toLowerCase();
    const full = rawLocation.toLowerCase();
    const fullMatches = studios.some((s) => {
      const c = s.city?.toLowerCase() || "";
      const p = s.province?.toLowerCase() || "";
      const co = s.country?.toLowerCase() || "";
      return c.includes(full) || p.includes(full) || co.includes(full);
    });
    if (fullMatches) return full;
    return rawLocation.split(" ")[0].trim().toLowerCase();
  }, [rawLocation, studios]);

  const filtered = useMemo(() => {
    let result = studios.slice();
    if (firstTerm) {
      result = result.filter((studio) => {
        const c = studio.city?.toLowerCase() || "";
        const p = studio.province?.toLowerCase() || "";
        const co = studio.country?.toLowerCase() || "";
        return c.includes(firstTerm) || p.includes(firstTerm) || co.includes(firstTerm);
      });
    }
    if (selectedType && selectedType !== "Todos") {
      result = result.slice().sort((a, b) => {
        const matchA = a.studioType?.toLowerCase() === selectedType.toLowerCase() ? 1 : 0;
        const matchB = b.studioType?.toLowerCase() === selectedType.toLowerCase() ? 1 : 0;
        return matchB - matchA;
      });
    }
    return result;
  }, [studios, firstTerm, selectedType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedStudios = useMemo(
    () => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filtered, currentPage]
  );

  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage((prev) => prev - 1); };
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage((prev) => prev + 1); };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="bg-white flex flex-col items-center w-full">
      {/* Hero con BannerSearch responsive */}
      <div className="w-full bg-sky-700 py-8 px-4 flex flex-col items-center text-center">
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mb-3">
          Encuentra tu estudio ideal
        </h2>
        <p className="text-white text-sm sm:text-base md:text-lg mb-4 max-w-2xl">
          Busca y filtra entre miles de estudios de grabación profesionales en
          la ubicación de tu preferencia
        </p>
        <div className="w-full max-w-3xl px-2 sm:px-0">
          <BannerSearch
            onLocationSelect={(lat, lng) => {
              console.log("Coordenadas seleccionadas:", lat, lng);
            }}
          />
        </div>
      </div>

      {/* Encabezado resultados */}
      <div className="w-full max-w-[1200px] px-4 mt-8 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800">
          {filtered.length} estudios encontrados {location && <span className="text-gray-600">en {location}</span>}
        </h3>

        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-4 py-2 text-gray-700 w-full sm:w-auto"
        >
          <option value="Todos">Todos</option>
          <option value="ensayo">Ensayo</option>
          <option value="grabacion">Grabación</option>
          <option value="produccion">Producción</option>
        </select>
      </div>

      {/* Contenedor de resultados */}
      <div className="w-full max-w-[1200px] mb-10 relative min-h-[60vh]">
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 text-lg font-medium">Cargando estudios...</p>
          </div>
        )}

        {!loading && paginatedStudios.length === 0 ? (
          <div className="col-span-full flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-700 text-lg text-center">
              No se encontraron estudios.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedStudios.map((studio) => (
              <div key={studio.id} className="w-full max-w-full mx-auto">
                <FeaturedStudioCard
                  id={studio.id}
                  studio={{
                    ...studio,
                    pricePerHour: studio.pricePerHour ? Number(studio.pricePerHour) : undefined,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {!loading && filtered.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-sky-700 cursor-pointer hover:bg-black text-white"
            }`}
          >
            Anterior
          </button>
          <span className="text-gray-700 self-center">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-sky-700 cursor-pointer hover:bg-black text-white"
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
