"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaBuilding } from "react-icons/fa";
import { Modal } from "@/components/modal/modal";
import type { Room } from "@/types/Rooms";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function authFetch(path: string) {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
    if (!token) throw new Error("No hay token disponible");
    const url = new URL(path, API_BASE).toString();
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
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
    const [selectedRoom, setSelectedRoom] = useState("Todas las salas");

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [rm, bk] = await Promise.all([getRooms(), getOwnerBookings()]);
                setRooms(rm);
                setRoomsCount(rm.filter((r: any) => (r as any).isActive ?? (r as any).active ?? true).length);

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
        setUpcomingReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        if (selectedReservation?.id === id)
            setSelectedReservation({ ...selectedReservation, status: newStatus });
        setStatusChanged(newStatus);
        setTimeout(() => setStatusChanged(null), 3000);
    };

    const filteredUpcoming =
        selectedRoom === "Todas las salas"
            ? upcomingReservations
            : upcomingReservations.filter((r) => r.room === selectedRoom);

    // Pantalla de carga
    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-white">
                <div className="w-16 h-16 border-4 border-t-sky-700 border-gray-200 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white w-full p-5 text-black">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="pt-5 text-center">
                    <h1 className="text-3xl font-bold text-black">
                        Panel de control del propietario de las salas
                    </h1>
                    <p className="text-gray-500 mb-10">
                        Gestiona tus salas y reservas
                    </p>
                </header>

                {/* Métricas centradas y cuadradas */}
                <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-2 w-60 hover:shadow-2xl min-h-[220px]">
                        <FaBuilding className="text-sky-700 text-4xl" />
                        <p className="text-gray-500">Salas activas</p>
                        <h2 className="text-xl font-bold">{roomsCount}</h2>
                        <span className="text-xs text-gray-500 text-center">
                            Total de salas de tu estudio
                        </span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-2 w-60 hover:shadow-2xl min-h-[130px]">
                        <FaCalendarAlt className="text-sky-700 text-4xl text-center" />
                        <p className="text-gray-500">Reservas próximos 7 días</p>
                        <h2 className="text-xl font-bold">{next7Count}</h2>
                        <span className="text-xs text-gray-500 text-center">
                            Contando desde hoy
                        </span>
                    </div>
                </div>

                {/* Reservas recientes y Salas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-sky-800 text-white p-4 rounded-xl shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">Reservas recientes</h3>
                        {recentReservations.length === 0 ? (
                            <p className="text-gray-300">Sin reservas recientes.</p>
                        ) : (
                            recentReservations.map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => openModal(res)}
                                    className="flex justify-between border-b border-white/20 pb-2 mb-2 last:border-0 cursor-pointer hover:bg-sky-700/50 transition"
                                >
                                    <div>
                                        <p className="font-semibold">{res.client}</p>
                                        <p className="text-sm">
                                            {res.room} • {res.hours} horas
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">
                                            ${(res.amount ?? 0).toLocaleString()}
                                        </p>
                                        <p className="text-xs">
                                            {new Date(res.date).toDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

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
                        {rooms.slice(0, 3).map((room) => (
                            <div
                                key={room.id}
                                className="bg-white text-gray-700 p-3 rounded-md flex justify-between items-center mb-2"
                            >
                                <div>
                                    <p className="font-semibold">{(room as any).name ?? "Sala"}</p>
                                    <p className="text-sm">${(room as any).pricePerHour ?? 0}/hora</p>
                                </div>
                                <span className="text-green-600 text-sm">Activo</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Próximas reservas */}
                <div className="bg-sky-800 p-4 rounded-xl shadow mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Próximas reservas</h3>
                        <select
                            className="border rounded-md px-2 py-1 text-sm text-white bg-sky-700"
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
                            <p className="text-gray-300">Sin próximas reservas.</p>
                        ) : (
                            filteredUpcoming.map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => openModal(res)}
                                    className="flex gap-4 bg-white rounded-xl items-center p-2 cursor-pointer hover:shadow-md transition"
                                >
                                    <div className="bg-gray-200 text-gray-500 text-center px-3 py-2 rounded-xl">
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
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs ${
                                            res.status === "Confirmado"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-yellow-100 text-yellow-600"
                                        }`}
                                    >
                                        {res.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Modal */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    {selectedReservation && (
                        <div className="space-y-6 text-gray-700 p-6">
                            <h2 className="text-2xl bg-sky-700 py-2 text-white rounded-2xl text-center font-bold">
                                {selectedReservation.title}
                            </h2>
                            <div className="text-center">
                                <p>
                                    <span className="font-semibold">Cliente:</span> {selectedReservation.client}
                                </p>
                                {selectedReservation.email && (
                                    <p>
                                        <span className="font-semibold">Email:</span> {selectedReservation.email}
                                    </p>
                                )}
                                {selectedReservation.telefono && (
                                    <p>
                                        <span className="font-semibold">Teléfono:</span> {selectedReservation.telefono}
                                    </p>
                                )}
                                <p>
                                    <span className="font-semibold">Sala:</span> {selectedReservation.room}
                                </p>
                                {selectedReservation.amount !== undefined && (
                                    <p>
                                        <span className="font-semibold">Monto:</span> ${selectedReservation.amount.toLocaleString()}
                                    </p>
                                )}
                                {selectedReservation.hours !== undefined && (
                                    <p>
                                        <span className="font-semibold">Horas:</span> {selectedReservation.hours}
                                    </p>
                                )}
                                <p>
                                    <span className="font-semibold">Fecha:</span> {new Date(selectedReservation.date).toLocaleDateString("es-AR")}
                                </p>
                                <p>
                                    <span className="font-semibold">Horario:</span> {selectedReservation.start} - {selectedReservation.end}
                                </p>
                                <p>
                                    <span className="font-semibold">Estado:</span>{" "}
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs ${
                                            selectedReservation.status === "Confirmado"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-yellow-100 text-yellow-600"
                                        }`}
                                    >
                                        {selectedReservation.status}
                                    </span>
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <button
                                    onClick={() =>
                                        updateReservationStatus(
                                            selectedReservation.id,
                                            selectedReservation.status === "Confirmado"
                                                ? "Pendiente"
                                                : "Confirmado"
                                        )
                                    }
                                    className="px-4 py-2 rounded-lg cursor-pointer bg-sky-700 text-white hover:bg-sky-800 transition"
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
