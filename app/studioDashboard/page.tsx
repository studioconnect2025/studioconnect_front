"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaDollarSign, FaStar, FaBuilding } from "react-icons/fa";

import type { Room } from "@/mocks/rooms";
import { getRoomsMockByStudioId } from "@/mocks/rooms";
import {
  getMetrics,
  getRecentReservations,
  getUpcomingReservations,
  getMessages,
  type Metric,
  type Reservation,
  type UpcomingReservation,
  type Message,
} from "@/mocks/dashboard";

export default function StudioDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [upcomingReservations, setUpcomingReservations] = useState<UpcomingReservation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [m, r, u, msg, rm] = await Promise.all([
          getMetrics(),
          getRecentReservations(),
          getUpcomingReservations(),
          getMessages(),
          getRoomsMockByStudioId("harmony"),
        ]);
        setMetrics(m);
        setRecentReservations(r);
        setUpcomingReservations(u);
        setMessages(msg);
        setRooms(rm);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="pt-8">
          <h1 className="text-3xl text-black font-bold">
            Panel de control del propietario del estudio
          </h1>
          <p className="text-gray-500">Gestiona tus estudios y reservas</p>
        </header>

        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 text-black">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white p-4 rounded-xl shadow flex items-center gap-4 hover:shadow-2xl"
            >
              {metric.icon === "calendar" && <FaCalendarAlt className="text-sky-700 text-3xl" />}
              {metric.icon === "dollar" && <FaDollarSign className="text-sky-700 text-3xl" />}
              {metric.icon === "star" && <FaStar className="text-sky-700 text-3xl" />}
              {metric.icon === "building" && <FaBuilding className="text-sky-700 text-3xl" />}

              <div>
                <p className="text-gray-500">{metric.title}</p>
                <h2 className="text-xl font-bold">{metric.value}</h2>
                <span className="text-xs text-gray-500">{metric.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reservas recientes + Salas + Mensajes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Reservas recientes */}
          <div className="bg-sky-800 text-white p-4 rounded-xl shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Reservas recientes</h3>
            {recentReservations.map((res) => (
              <div
                key={res.id}
                className="flex justify-between border-b border-white/20 pb-2 mb-2 last:border-0"
              >
                <div>
                  <p className="font-semibold">{res.client}</p>
                  <p className="text-sm">
                    {res.studio} • {res.hours} horas
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${res.amount.toLocaleString()}</p>
                  <p className="text-xs">{new Date(res.date).toDateString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Salas */}
          <div className="bg-sky-800 text-white p-4 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Salas del estudio</h3>
              <Link
                href="/studioRooms"
                className="text-xs bg-white text-sky-700 px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition"
              >
                Ver todas
              </Link>
            </div>
            {loading ? (
              <p className="text-gray-300">Cargando salas...</p>
            ) : (
              rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white text-gray-700 p-3 rounded-md flex justify-between items-center mb-2"
                >
                  <div>
                    <p className="font-semibold">{room.title}</p>
                    <p className="text-sm">
                      {room.capacity} personas • ${room.priceHour}/hora
                    </p>
                  </div>
                  <span className="text-green-600 text-sm">Activo</span>
                </div>
              ))
            )}
          </div>

          {/* Mensajes */}
          <div className="bg-sky-800 text-white p-4 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Mensajes</h3>
              <Link
                href="/"
                className="text-xs bg-white text-sky-700 px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition"
              >
                Ver todos
              </Link>
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className="mb-3 last:mb-0">
                <p className="font-semibold">
                  {msg.author}{" "}
                  <span className="text-xs text-gray-400">{msg.timeAgo}</span>
                </p>
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas reservas */}
        <div className="bg-sky-800 p-4 rounded-xl shadow mt-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Próximas reservas</h3>
            <select className="border rounded-md px-2 py-1 text-sm text-white">
              <option>Todas las salas</option>
            </select>
          </div>
          <div className="space-y-4">
            {upcomingReservations.map((res) => (
              <div key={res.id} className="flex gap-4 bg-white rounded-xl items-center p-2">
                <div className="bg-gray-200 text-gray-500 text-center px-3 py-2 rounded-xl">
                  <p className="font-bold">{new Date(res.date).getDate()}</p>
                  <p className="text-xs uppercase">
                    {new Date(res.date).toLocaleString("es-AR", { month: "short" })}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-700">{res.title}</p>
                  <p className="text-sm text-gray-500">
                    {res.client} + {res.studio}
                  </p>
                  <p className="text-xs text-gray-400">
                    {res.start} - {res.end}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-md text-xs mr-2 ${
                    res.status === "Confirmado"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {res.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
