"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaBuilding } from "react-icons/fa";
import { Modal } from "@/components/modal/modal";
import type { Room } from "@/types/Rooms";
import { dashboardService, Reservation as BookingRaw } from "@/services/dashboard.service";

type Reservation = {
  id: string;
  client: string;
  room: string;
  hours: number;
  amount: number;
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
  const [selectedRoom, setSelectedRoom] = useState("Todas las salas");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [rm, bk] = await Promise.all([
          dashboardService.getRooms(),
          dashboardService.getBookings(),
        ]);

        setRooms(rm);
        setRoomsCount(
          rm.filter((r: any) => (r as any).isActive ?? (r as any).active ?? true).length
        );

        const now = new Date();
        const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const recent: Reservation[] = [];
        const upcoming: UpcomingReservation[] = [];
        let next7 = 0;

        (bk as BookingRaw[]).forEach((b) => {
          const start = new Date(b.startTime);
          const end = new Date(b.endTime);
          const hours = Math.max(
            1,
            Math.round((end.getTime() - start.getTime()) / (60 * 60 * 1000))
          );

          if (start >= now && start < in7d) next7++;

          if (end < now) {
            recent.push({
              id: b.id,
              client: b.musician,
              room: b.room,
              hours,
              amount: b.totalPrice ?? 0,
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

  const filteredUpcoming =
    selectedRoom === "Todas las salas"
      ? upcomingReservations
      : upcomingReservations.filter((r) => r.room === selectedRoom);

  // Loading
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-sky-600 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full p-6 text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="pt-5 text-center">
          <h1 className="text-3xl font-bold text-black">
            Panel de control del propietario de las salas
          </h1>
          <p className="text-gray-500 mb-10">
            Gestiona tus salas y reservas
          </p>
        </header>

        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-3 transition hover:shadow-xl">
            <FaBuilding className="text-sky-700 text-5xl" />
            <p className="text-gray-600 font-medium">Salas activas</p>
            <h2 className="text-3xl font-bold text-sky-700">{roomsCount}</h2>
            <span className="text-sm text-gray-400 text-center">
              Total de salas en tu estudio
            </span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-3 transition hover:shadow-xl">
            <FaCalendarAlt className="text-sky-700 text-5xl" />
            <p className="text-gray-600 font-medium">Reservas próximos 7 días</p>
            <h2 className="text-3xl font-bold text-sky-700">{next7Count}</h2>
            <span className="text-sm text-gray-400 text-center">
              Contando desde hoy
            </span>
          </div>
        </div>

        {/* Reservas recientes y Salas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white text-gray-700 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-sky-700 mb-4">Reservas recientes</h3>
            {recentReservations.length === 0 ? (
              <p className="text-gray-400">Sin reservas recientes.</p>
            ) : (
              recentReservations.map((res) => (
                <div
                  key={res.id}
                  onClick={() => openModal(res)}
                  className="flex justify-between bg-sky-50 items-center border-b border-gray-200 pb-3 mb-3 last:border-0 cursor-pointer hover:bg-gray-50 rounded-md p-2 transition"
                >
                  <div>
                    <p className="font-semibold">{res.client}</p>
                    <p className="text-sm text-gray-500">
                      {res.room} • {res.hours} horas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sky-700">
                      ${(res.amount ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(res.date).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white text-gray-700 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-sky-700">Salas</h3>
              <Link
                href="/studioRooms"
                className="text-sm bg-sky-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700 transition"
              >
                Gestionar
              </Link>
            </div>
            {rooms.slice(0, 3).map((room) => (
              <div
                key={room.id}
                className="bg-sky-50 text-gray-700 p-4 rounded-lg flex justify-between items-center mb-3"
              >
                <div>
                  <p className="font-semibold">{(room as any).name ?? "Sala"}</p>
                  <p className="text-sm text-gray-500">
                    ${(room as any).pricePerHour ?? 0}/hora
                  </p>
                </div>
                <span className="text-green-600 font-medium">Activo</span>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas reservas */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-sky-700">Próximas reservas</h3>
            <select
              className="border rounded-lg px-3 py-2 text-sm text-white bg-sky-700 focus:ring-2 focus:ring-sky-500"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              <option>Todas las salas</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {filteredUpcoming.length === 0 ? (
              <p className="text-gray-400">Sin próximas reservas.</p>
            ) : (
              filteredUpcoming.map((res) => (
                <div
                  key={res.id}
                  onClick={() => openModal(res)}
                  className="flex gap-4 bg-sky-50 rounded-xl items-center p-4 cursor-pointer hover:shadow-md transition"
                >
                  <div className="bg-sky-100 text-sky-700 text-center px-4 py-3 rounded-xl">
                    <p className="font-bold">{new Date(res.date).getDate()}</p>
                    <p className="text-xs uppercase">
                      {new Date(res.date).toLocaleString("es-AR", { month: "short" })}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">{res.title}</p>
                    <p className="text-sm text-gray-500">{res.client} • {res.room}</p>
                    <p className="text-xs text-gray-400">{res.start} - {res.end}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedReservation && (
            <div className="space-y-6 bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl text-center font-bold text-sky-700 border-b pb-3">
                {selectedReservation.title}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-semibold">Cliente:</span> {selectedReservation.client}</p>
                {selectedReservation.email && (
                  <p><span className="font-semibold">Email:</span> {selectedReservation.email}</p>
                )}
                {selectedReservation.telefono && (
                  <p><span className="font-semibold">Teléfono:</span> {selectedReservation.telefono}</p>
                )}
                <p><span className="font-semibold">Sala:</span> {selectedReservation.room}</p>
                {selectedReservation.amount !== undefined && (
                  <p><span className="font-semibold">Monto:</span> ${selectedReservation.amount.toLocaleString()}</p>
                )}
                {selectedReservation.hours !== undefined && (
                  <p><span className="font-semibold">Horas:</span> {selectedReservation.hours}</p>
                )}
                <p><span className="font-semibold">Fecha:</span> {new Date(selectedReservation.date).toLocaleDateString("es-AR")}</p>
                <p><span className="font-semibold">Horario:</span> {selectedReservation.start} - {selectedReservation.end}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
