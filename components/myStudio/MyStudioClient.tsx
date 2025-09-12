"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyStudio, type Studio } from "@/services/myStudio.services";
import { roomsService } from "@/services/rooms.service";
import MyStudioHeader from "./MyStudioHeader";
import RoomsSection from "./RoomsSection";
import EditStudioModal from "@/components/myStudio/EditStudioModal";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";

export default function MyStudioClient() {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { studio } = await getMyStudio();
        setStudio(studio);

        const embedded =
          (studio as any)?.rooms ??
          (studio as any)?.studioRooms ??
          (studio as any)?.ownerRooms ??
          (studio as any)?.data?.rooms ??
          [];

        if (Array.isArray(embedded) && embedded.length) {
          setRooms(embedded);
        } else {
          const fetched = await roomsService.getMyRooms();
          const normalized = Array.isArray((fetched as any)?.rooms)
            ? (fetched as any).rooms
            : Array.isArray(fetched)
            ? (fetched as any)
            : [];
          setRooms(normalized);
        }
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

  const card =
    "rounded-2xl overflow-hidden shadow-[0_12px_24px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 " +
    "bg-gradient-to-b from-[#0F3B57] via-[#0B2746] to-[#071E32] text-white backdrop-blur-md p-4 md:p-6";

  const location = [studio.city, studio.province].filter(Boolean).join(", ");
  const headerLocation = [studio.address, location].filter(Boolean).join(" • ");

  return (
    <section className={card}>
      <MyStudioHeader onEditStudio={() => setOpenEdit(true)} locationText={headerLocation} />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/12 bg-white/10 p-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <LuLayoutDashboard className="text-sky-400" />
            <span>Resumen</span>
          </div>
          <p className="mt-1 text-base font-semibold">{studio.name ?? "—"}</p>
          <p className="text-sm text-white/80">
            Salas activas: <b>{rooms.length}</b>
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
            Editá portada, descripción y contacto desde <span className="font-semibold">“Editar datos del estudio”.</span>
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-xl font-semibold text-white/95">Mis salas</h3>
        <RoomsSection rooms={rooms} />

        <div className="mt-4 flex justify-end">
          <Link
            href="/studioRooms"
            className="inline-flex items-center justify-center py-1.5 rounded-md px-4 text-sm font-medium text-white bg-[#03597E] hover:bg-[#02406f] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Administrar salas
          </Link>
        </div>
      </div>

      <EditStudioModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        initial={{
          name: studio.name,
          city: studio.city,
          province: studio.province,
          address: studio.address,
          description: studio.description,
          services: studio.services ?? [],
          openingTime: (studio as any).openingTime,
          closingTime: (studio as any).closingTime,
        }}
        onSaved={(updated) => setStudio(updated)}
      />
    </section>
  );
}
