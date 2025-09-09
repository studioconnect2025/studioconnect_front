"use client";

import { useEffect, useState } from "react";
import { getMyStudio, type Studio } from "@/services/myStudio.services";
import MyStudioHeader from "./MyStudioHeader";
import RoomsSection from "./RoomsSection";

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

  // clases reutilizables para las cards tipo “referencia”
  const card =
    "rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(2,6,23,0.35)] ring-1 ring-white/10 " +
    "bg-gradient-to-b from-[#0F3B57] via-[#0B2F46] to-[#062638] text-white " +
    "backdrop-blur-md p-4 md:p-6";

  return (
    <>
      {/* Header: card azul con degradé */}
      <section className={`${card} mb-6`}>
        <MyStudioHeader />
      </section>

      {/* Salas: misma card */}
      <section className={card}>
        <RoomsSection />
      </section>
    </>
  );
}
