"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaBuilding } from "react-icons/fa";
import { Modal } from "@/components/modal/modal";
import type { Room } from "@/types/Rooms";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function authFetch(path: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No hay token disponible");
  const url = new URL(path, API_BASE).toString();
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${path} ${res.status}: ${txt}`);
  }
  return res.json();
}

async function getRooms(): Promise<Room[]> {
  try {
    return await authFetch("/owners/me/studio/rooms");
  } catch {
    return [];
  }
}

type BookingRaw = {
  id: string;
  room: string;
  studio: string;
  musician: string;
  startTime: string;
  endTime: string;
  status: "PENDIENTE" | "CONFIRMADO" | "CANCELADO";
  isPaid: boolean;
  totalPrice: number | null;
};

async function getOwnerBookings(): Promise<BookingRaw[]> {
  try {
    return await authFetch("/bookings/owner/my-bookings");
  } catch {
    return [];
  }
}

type Reservation = {
  id: string;
  client: string;
  room: string;
  hours: number;
  amount: number;
  status: "Confirmado" | "Pendiente";
  date: string;
  email: string;
  telefono: string;
};

type UpcomingReservation = {
  id: string;
  title: string;
  room: string;
  client: string;
  date: string;
  start: string;
  end: string;
  email: string;
  telefono: string;
  status: "Confirmado" | "Pendiente";
};

export default function RoomDashboard() {
  const [loading, setLoading] = useState(true);
  const [roomsCount, setRoomsCount] = useState(0);
  const [next7Count, setNext7Count] = useState(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [upcomingReservations, setUpcomingReservations] = useState<UpcomingReservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<(UpcomingReservation & Partial<Reservation>) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusChanged, setStatusChanged] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [rm, bk] = await Promise.all([getRooms(), getOwnerBookings()]);
        setRooms(rm);
        setRoomsCount(rm.filter((r: any) => ((r as any).isActive ?? (r as any).active ?? true)).length);

        const now = new Date();
        const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const recent: Reservation[] = [];
        const upcoming: UpcomingReservation[] = [];
        let next7 = 0;

        bk.forEach((b) => {
          const start = new Date(b.startTime);
          const end = new Date(b.endTime);
          const hours = Math.max(1, Math.round((end.getTime() - start.getTime()) / (60 * 60 * 1000)));
          const status = b.status === "CONFIRMADO" ? "Confirmado" : "Pendiente";

          if (start >= now && start < in7d) next7++;

          if (end < now) {
            recent.push({
              id: b.id,
              client: b.musician,
              room: b.room,
              hours,
              amount: b.totalPrice ?? 0,
              status,
              date: start.toISOString(),
              email: b.musician,
              telefono: "",
            });
          } else {
            const fmt = (d: Date) => d.toISOString().slice(11, 16);
            upcoming.push({
              id: b.id,
              title: b.studio,
              room: b.room,
              client: b.musician,
              date: start.toISOString(),
              start: fmt(start),
              end: fmt(end),
              email: b.musician,
              telefono: "",
              status,
            });
          }
        });

        recent.sort((a, b) => +new Date(b.date) - +new Date(a.date));
        upcoming.sort((a, b) => +new Date(a.date) - +new Date(b.date));

        setRecentReservations(recent.slice(0, 5));
        setUpcomingReservations(upcoming.slice(0, 5));
        setNext7Count(next7);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openModal = (reservation: Reservation | UpcomingReservation) => {
    const unified: UpcomingReservation & Partial<Reservation> = {
      id: reservation.id,
      title: "title" in reservation ? reservation.title : reservation.room,
      client: (reservation as any).client,
      email: (reservation as any).email ?? "",
      telefono: (reservation as any).telefono ?? "",
      room: "room" in reservation ? reservation.room : "sala desconocida",
      date: (reservation as any).date,
      start: "start" in reservation ? reservation.start : "10:00",
      end: "end" in reservation ? reservation.end : "11:00",
      status: (reservation as any).status,
      amount: (reservation as any).amount,
      hours: (reservation as any).hours,
    };
    setSelectedReservation(unified);
    setIsModalOpen(true);
    setStatusChanged(null);
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setIsModalOpen(false);
    setStatusChanged(null);
  };

  const updateReservationStatus = (id: string, newStatus: "Confirmado" | "Pendiente") => {
    setUpcomingReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    if (selectedReservation?.id === id) setSelectedReservation({ ...selectedReservation, status: newStatus });
    setStatusChanged(newStatus);
    setTimeout(() => setStatusChanged(null), 3000);
  };

  return (
    <div className="bg-white text-slate-900 w-full min-h-screen">
      <div className="w-full bg-sky-800">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 md:py-4">
          <h1 className="text-center text-white text-xl md:text-2xl font-semibold">
            Panel de control del propietario de las salas
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-8">
        <p className="mb-6 md:mb-8 text-slate-600 text-base md:text-lg text-center font-medium">
          Gestiona tus salas y reservas
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-black">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex items-center gap-4">
            <FaBuilding className="text-sky-700 text-3xl" />
            <div>
              <p className="text-xs text-slate-500">Salas activas</p>
              <h2 className="text-xl font-semibold">{roomsCount}</h2>
              <span className="text-xs text-slate-500">Total de salas de tu estudio</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex items-center gap-4">
            <FaCalendarAlt className="text-sky-700 text-3xl" />
            <div>
              <p className="text-xs text-slate-500">Reservas próximos 7 días</p>
              <h2 className="text-xl font-semibold">{next7Count}</h2>
              <span className="text-xs text-slate-500">Contando desde hoy</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
            <h3 className="text-slate-900 font-semibold mb-4">Reservas recientes</h3>
            {recentReservations.length === 0 ? (
              <p className="text-sm text-slate-500">Sin reservas recientes.</p>
            ) : (
              recentReservations.map((res) => (
                <div
                  key={res.id}
                  onClick={() => openModal(res)}
                  className="flex justify-between border-b border-slate-200 pb-2 mb-2 last:border-0 cursor-pointer hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-semibold">{res.client}</p>
                    <p className="text-sm text-slate-600">
                      {res.room} • {res.hours} horas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(res.amount ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{new Date(res.date).toDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-900 font-semibold">Salas</h3>
              <Link
                href="/studioRooms"
                className="inline-flex items-center justify-center h-8 px-3 rounded-md bg-sky-700 hover:bg-sky-800 text-white text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300"
              >
                Gestionar
              </Link>
            </div>
            {loading ? (
              <p className="text-sm text-slate-500">Cargando salas...</p>
            ) : rooms.length === 0 ? (
              <p className="text-sm text-slate-500">No hay salas creadas.</p>
            ) : (
              rooms.slice(0, 3).map((room) => (
                <div key={room.id} className="bg-slate-50 text-slate-700 p-3 rounded-md flex justify-between items-center mb-2 border border-slate-200">
                  <div>
                    <p className="font-semibold">{(room as any).name ?? (room as any).title ?? "Sala"}</p>
                    <p className="text-sm">
                      $
                      {((room as any).pricePerHour ?? (room as any).price ?? (room as any).hourlyRate ?? 0)}
                      /
                      {((room as any).capacity ?? (room as any).maxPeople ?? "-")}hs
                    </p>
                  </div>
                  <span
                    className={`text-sm ${((room as any).isActive ?? (room as any).active) ? "text-green-600" : "text-red-500"}`}
                  >
                    {((room as any).isActive ?? (room as any).active) ? "Activo" : "Inactivo"}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
            <h3 className="text-slate-900 font-semibold mb-4">Mensajes</h3>
            <p className="text-sm text-slate-500">No disponible aún.</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-900 font-semibold">Próximas reservas</h3>
            <select className="border rounded-md px-2 py-1 text-sm text-slate-700 bg-white">
              <option>Todas las salas</option>
            </select>
          </div>
          <div className="space-y-4">
            {upcomingReservations.length === 0 ? (
              <p className="text-sm text-slate-500">Sin próximas reservas.</p>
            ) : (
              upcomingReservations.map((res) => (
                <div
                  key={res.id}
                  onClick={() => openModal(res)}
                  className="flex gap-4 bg-slate-50 rounded-xl items-center p-2 cursor-pointer hover:shadow-sm transition border border-slate-200"
                >
                  <div className="bg-slate-200 text-slate-600 text-center px-3 py-2 rounded-xl">
                    <p className="font-bold">{new Date(res.date).getDate()}</p>
                    <p className="text-xs uppercase">
                      {new Date(res.date).toLocaleString("es-AR", { month: "short" })}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{res.title}</p>
                    <p className="text-sm text-slate-600">
                      {res.client} • {res.room}
                    </p>
                    <p className="text-xs text-slate-500">
                      {res.start} - {res.end}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-md text-xs mr-2 ${res.status === "Confirmado" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {res.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedReservation && (
            <div className="space-y-6 text-slate-700 p-6">
              <h2 className="text-2xl bg-sky-700 py-2 text-white rounded-2xl text-center font-bold">{selectedReservation.title}</h2>
              <div className="text-center">
                <p><span className="font-semibold">Cliente:</span> {selectedReservation.client}</p>
                {selectedReservation.email && <p><span className="font-semibold">Email:</span> {selectedReservation.email}</p>}
                {selectedReservation.telefono && <p><span className="font-semibold">Teléfono:</span> {selectedReservation.telefono}</p>}
                <p><span className="font-semibold">Sala:</span> {selectedReservation.room}</p>
                {selectedReservation.amount !== undefined && (
                  <p><span className="font-semibold">Monto:</span> ${selectedReservation.amount.toLocaleString()}</p>
                )}
                {selectedReservation.hours !== undefined && (
                  <p><span className="font-semibold">Horas:</span> {selectedReservation.hours}</p>
                )}
                <p><span className="font-semibold">Fecha:</span> {new Date(selectedReservation.date).toLocaleDateString("es-AR")}</p>
                <p><span className="font-semibold">Horario:</span> {selectedReservation.start} - {selectedReservation.end}</p>
                <p>
                  <span className="font-semibold">Estado:</span>{" "}
                  <span className={`px-2 py-1 rounded-md text-xs ${selectedReservation.status === "Confirmado" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {selectedReservation.status}
                  </span>
                  {statusChanged && <span className="ml-2">{statusChanged === "Confirmado"}</span>}
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <button
                  onClick={() =>
                    updateReservationStatus(
                      selectedReservation.id,
                      selectedReservation.status === "Confirmado" ? "Pendiente" : "Confirmado"
                    )
                  }
                  className="px-4 py-2 rounded-lg cursor-pointer bg-sky-700 text-white hover:bg-sky-800 transition"
                >
                  {selectedReservation.status === "Confirmado" ? "Marcar como Pendiente" : "Confirmar reserva"}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
