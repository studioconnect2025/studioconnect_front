"use client";

import { useEffect, useState } from "react";
import { getMyStudio, type Studio } from "@/services/myStudio.services";
import MyStudioHeader from "./MyStudioHeader";
import RoomsSection from "./RoomsSection";

// Íconos
import { LuLayoutDashboard } from "react-icons/lu";
import { FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";

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
  if (err)      return <div className="bg-red-50 text-red-700 rounded-xl shadow p-6">{err}</div>;
  if (!studio)  return <div className="bg-white rounded-xl shadow p-6">No se encontró tu estudio.</div>;

  const card =
    "rounded-2xl overflow-hidden shadow-[0_12px_24px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 " +
    "bg-gradient-to-b from-[#0F3B57] via-[#0B2746] to-[#071E32] text-white backdrop-blur-md p-4 md:p-6";

  const location = [studio.city, studio.province].filter(Boolean).join(", ");

  return (
    <section className={card}>
      {/* Header */}
      <MyStudioHeader />

      {/* Bloques de info con íconos */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/12 bg-white/10 p-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <LuLayoutDashboard className="text-sky-400" />
            <span>Resumen</span>
          </div>
          <p className="mt-1 text-base font-semibold">{studio.name ?? "—"}</p>
          <p className="text-sm text-white/80">
            Salas activas: <b></b>
          </p>
        </div>

        <div className="rounded-xl border border-white/12 bg-white/10 p-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <FaMapMarkerAlt className="text-red-400" />
            <span>Ubicación</span>
          </div>
          <p className="mt-1 text-base font-semibold">
            {studio.address ? `${studio.address} • ` : ""}
            {location || "Ciudad, Provincia"}
          </p>
        </div>

        <div className="rounded-xl border border-white/12 bg-white/10 p-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <FaInfoCircle className="text-yellow-400" />
            <span>Info</span>
          </div>
          <p className="mt-1 text-sm text-white/80">
            Editá portada, descripción y contacto desde{" "}
            <span className="font-semibold">“Editar datos del estudio”.</span>
          </p>
        </div>
      </div>

      {/* Salas */}
      <div className="mt-6">
        <h3 className="mb-3 text-xl font-semibold text-white/95">Mis salas</h3>
        <RoomsSection />
      </div>
    </section>
  );
}
