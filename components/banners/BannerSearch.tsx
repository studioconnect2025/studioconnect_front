"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

export const BannerSearch = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (r: { display_name: string; lat: string; lon: string }) => {
    onLocationSelect(parseFloat(r.lat), parseFloat(r.lon));
    setQuery(r.display_name);
    setResults([]);
  };

  const handleSearch = async () => {
    if (!query) return;
    router.push(`/search?location=${encodeURIComponent(query)}`);
  };

  return (
    <div className="text-black px-4 sm:px-6 py-6 w-full max-w-6xl mx-auto">
      <div className="bg-white flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl shadow-lg items-center">
        {/* Input de ubicación */}
        <div className="flex-1 relative w-full" ref={containerRef}>
          <label
            htmlFor="location"
            className="mb-1 sm:mb-2 font-semibold text-gray-700 text-sm sm:text-base"
          >
            Locación
          </label>
          <div className="relative w-full">
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              id="location"
              type="text"
              placeholder="Ciudad, dirección"
              className="border border-gray-300 rounded-xl p-2 sm:p-3 pr-10 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {results.length > 0 && (
            <ul className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-1000 max-h-52 sm:max-h-60 overflow-y-auto text-sm">
              {results.map((r, i) => (
                <li
                  key={i}
                  className="p-2 sm:p-3 hover:bg-sky-100 cursor-pointer transition"
                  onClick={() => handleSelect(r)}
                >
                  {r.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Botón Buscar */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 transition text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base w-full sm:w-auto h-full sm:h-auto mt-5"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};
