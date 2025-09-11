"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FaCalendarAlt,
    FaDollarSign,
    FaStar,
    FaBuilding,
    FaStore,
} from "react-icons/fa";
import { Modal } from "@/components/modal/modal";
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

export default function RoomDashboard() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [recentReservations, setRecentReservations] = useState<Reservation[]>(
        []
    );
    const [upcomingReservations, setUpcomingReservations] = useState<
        UpcomingReservation[]
    >([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<
        (UpcomingReservation & Partial<Reservation>) | null
    >(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusChanged, setStatusChanged] = useState<string | null>(null);

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

    const openModal = (reservation: Reservation | UpcomingReservation) => {
        const unifiedReservation: UpcomingReservation & Partial<Reservation> = {
            id: reservation.id,
            title:
                "title" in reservation ? reservation.title : reservation.room,
            client: reservation.client,
            email: "email" in reservation ? reservation.email : "",
            telefono: "telefono" in reservation ? reservation.telefono : "",
            room: "room" in reservation ? reservation.room : "sala desconocida",
            date: reservation.date,
            start: "start" in reservation ? reservation.start : "10:00",
            end: "end" in reservation ? reservation.end : "11:00",
            status: reservation.status,
            amount: "amount" in reservation ? reservation.amount : undefined,
            hours: "hours" in reservation ? reservation.hours : undefined,
        };
        setSelectedReservation(unifiedReservation);
        setIsModalOpen(true);
        setStatusChanged(null);
    };

    const closeModal = () => {
        setSelectedReservation(null);
        setIsModalOpen(false);
        setStatusChanged(null);
    };

    const updateReservationStatus = (
        id: string,
        newStatus: "Confirmado" | "Pendiente"
    ) => {
        setUpcomingReservations((prev) =>
            prev.map((res) =>
                res.id === id ? { ...res, status: newStatus } : res
            )
        );

        if (selectedReservation?.id === id) {
            setSelectedReservation({
                ...selectedReservation,
                status: newStatus,
            });
        }

        setStatusChanged(newStatus);
        setTimeout(() => setStatusChanged(null), 3000);
    };

    return (
        <div className="bg-white w-full min-h-screen pb-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="pt-8">
                    <div className="bg-sky-700 p-4 rounded-xl text-3xl text-white font-bold flex items-center justify-center">

                        Panel de control del propietario de las salas
                    </div>
                    <p className="text-gray-500 mt-4 text-2xl font-bold flex items-center justify-center">
                        Gestiona tus salas y reservas
                    </p>
                </header>

                {/* Métricas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 text-black">
                    {metrics.map((metric) => (
                        <div
                            key={metric.id}
                            className="bg-white p-4 rounded-xl shadow flex items-center gap-4 hover:shadow-2xl"
                        >
                            {metric.icon === "calendar" && (
                                <FaCalendarAlt className="text-sky-700 text-3xl" />
                            )}
                            {metric.icon === "dollar" && (
                                <FaDollarSign className="text-sky-700 text-3xl" />
                            )}
                            {metric.icon === "star" && (
                                <FaStar className="text-sky-700 text-3xl" />
                            )}
                            {metric.icon === "building" && (
                                <FaBuilding className="text-sky-700 text-3xl" />
                            )}

                            <div>
                                <p className="text-gray-500">{metric.title}</p>
                                <h2 className="text-xl font-bold">
                                    {metric.value}
                                </h2>
                                <span className="text-xs text-gray-500">
                                    {metric.subtitle}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reservas recientes, Salas y Mensajes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                    {/* Reservas recientes */}
                    <div className="bg-sky-800 text-white p-4 rounded-xl shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">
                            Reservas recientes
                        </h3>
                        {recentReservations.map((res) => (
                            <div
                                key={res.id}
                                onClick={() => openModal(res)}
                                className="flex justify-between border-b border-white/20 pb-2 mb-2 last:border-0 cursor-pointer hover:bg-sky-700/50 transition"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {res.client}
                                    </p>
                                    <p className="text-sm">
                                        {res.room} • {res.hours} horas
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">
                                        ${res.amount.toLocaleString()}
                                    </p>
                                    <p className="text-xs">
                                        {new Date(res.date).toDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Salas */}
                    <div className="bg-sky-800 text-white p-4 rounded-xl shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Salas</h3>
                            <Link
                                href="/studioRooms"
                                className="text-xs bg-white text-sky-700 px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition"
                            >
                                Gestionar
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
                                        <p className="font-semibold">
                                            {room.title}
                                        </p>
                                        <p className="text-sm">
                                            {room.capacity} personas • $
                                            {room.priceHour}/hora
                                        </p>
                                    </div>
                                    <span className="text-green-600 text-sm">
                                        Activo
                                    </span>
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
                                    <span className="text-xs text-gray-400">
                                        {msg.timeAgo}
                                    </span>
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
                            <div
                                key={res.id}
                                onClick={() => openModal(res)}
                                className="flex gap-4 bg-white rounded-xl items-center p-2 cursor-pointer hover:shadow-md transition"
                            >
                                <div className="bg-gray-200 text-gray-500 text-center px-3 py-2 rounded-xl">
                                    <p className="font-bold">
                                        {new Date(res.date).getDate()}
                                    </p>
                                    <p className="text-xs uppercase">
                                        {new Date(res.date).toLocaleString(
                                            "es-AR",
                                            { month: "short" }
                                        )}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-700">
                                        {res.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {res.client} • {res.room}
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

                {/* Modal con opciones */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    {selectedReservation && (
                        <div className="space-y-6 text-gray-700 p-6">
                            <h2 className="text-2xl bg-sky-700 py-2 text-white rounded-2xl text-center font-bold ">
                                {selectedReservation.title}
                            </h2>
                            <div className="text-center">
                                <p>
                                    <span className="font-semibold">
                                        Cliente:
                                    </span>{" "}
                                    {selectedReservation.client}
                                </p>
                                {selectedReservation.email && (
                                    <p>
                                        <span className="font-semibold">
                                            Email:
                                        </span>{" "}
                                        {selectedReservation.email}
                                    </p>
                                )}
                                {selectedReservation.telefono && (
                                    <p>
                                        <span className="font-semibold">
                                            Teléfono:
                                        </span>{" "}
                                        {selectedReservation.telefono}
                                    </p>
                                )}
                                <p>
                                    <span className="font-semibold">Sala:</span>{" "}
                                    {selectedReservation.room}
                                </p>
                                {selectedReservation.amount !== undefined && (
                                    <p>
                                        <span className="font-semibold">
                                            Monto:
                                        </span>{" "}
                                        $
                                        {selectedReservation.amount.toLocaleString()}
                                    </p>
                                )}
                                {selectedReservation.hours !== undefined && (
                                    <p>
                                        <span className="font-semibold">
                                            Horas:
                                        </span>{" "}
                                        {selectedReservation.hours}
                                    </p>
                                )}
                                <p>
                                    <span className="font-semibold">
                                        Fecha:
                                    </span>{" "}
                                    {new Date(
                                        selectedReservation.date
                                    ).toLocaleDateString("es-AR")}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Horario:
                                    </span>{" "}
                                    {selectedReservation.start} -{" "}
                                    {selectedReservation.end}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Estado:
                                    </span>{" "}
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs ${
                                            selectedReservation.status ===
                                            "Confirmado"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-yellow-100 text-yellow-600"
                                        }`}
                                    >
                                        {selectedReservation.status}
                                    </span>
                                    {statusChanged && (
                                        <span className="ml-2">
                                            {statusChanged === "Confirmado"}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="mt-6 border-t pt-4 space-y-1">
                                <h3 className="text-lg font-semibold">
                                    Contactar al cliente
                                </h3>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Email:</span>{" "}
                                    {selectedReservation.email}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">
                                        Teléfono:
                                    </span>{" "}
                                    {selectedReservation.telefono}
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <button
                                    onClick={() =>
                                        updateReservationStatus(
                                            selectedReservation.id,
                                            selectedReservation.status ===
                                                "Confirmado"
                                                ? "Pendiente"
                                                : "Confirmado"
                                        )
                                    }
                                    className="px-4 py-2 rounded-lg cursor-pointer bg-black text-white hover:bg-sky-700 transition"
                                >
                                    {selectedReservation.status === "Confirmado"
                                        ? "Marcar como Pendiente"
                                        : "Confirmar reserva"}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}
