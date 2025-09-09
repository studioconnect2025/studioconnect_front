"use client";

import { useEffect, useState } from "react";
import { getMyStudio, type Studio } from "@/services/myStudio.services";

export default function MyStudioClient() {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { studio } = await getMyStudio();
        setStudio(studio);
      } catch (e: any) {
        setErr(e?.response?.data?.message ?? "Error al cargar el estudio");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="bg-white rounded-xl shadow p-6">Cargando…</div>;
  if (err) return <div className="bg-red-50 text-red-700 rounded-xl shadow p-6">{err}</div>;
  if (!studio) return <div className="bg-white rounded-xl shadow p-6">No se encontró tu estudio.</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold">{studio.name}</h2>
        <p className="text-sm text-gray-500">
          {[studio.city, studio.province].filter(Boolean).join(", ") || "Ubicación no disponible"}
        </p>
      </div>

    </div>
  );
}
