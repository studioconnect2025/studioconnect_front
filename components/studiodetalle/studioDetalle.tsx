"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { BookingService, BookingPayload } from "@/services/booking.services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuthUser, useIsAuth } from "@/stores/AuthStore";

const ClientUserLocationMap = dynamic(
    () => import("@/components/LocationMap/ClientUserLocationMap"),
    { ssr: false }
);

type Instrument = {
    id: string;
    name: string;
    price: number;
};

type Room = {
    id: string;
    name: string;
    pricePerHour: number;
    minHours: number;
    capacity?: number;
    features?: string[];
    images?: string[];
    instruments?: Instrument[];
    availability?: Record<string, { start: string; end: string }>;
};

export default function StudioDetailsClient({ studio }: any) {
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [selectedInstrumentId, setSelectedInstrumentId] =
        useState<string>("");
    const [instrumentHours, setInstrumentHours] = useState<number | "">("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const user = useAuthUser();
    const isLoggedIn = useIsAuth();

    const rooms: Room[] =
        studio.rooms?.map((r: any) => ({
            id: r.id,
            name: r.name,
            pricePerHour: Number(r.pricePerHour) ?? 0,
            minHours: r.minHours ?? 1,
            capacity: r.capacity,
            features: r.features ?? [],
            images: r.imageUrls ?? [],
            instruments: r.instruments ?? [],
            availability: r.availability ?? {},
        })) ?? [];

    const photos: string[] = studio.photos?.length
        ? studio.photos
        : rooms.flatMap((r) => r.images ?? []);

    const center: [number, number] = [
        studio.lat ?? -34.6037,
        studio.lng ?? -58.3816,
    ];
    const room = rooms.find((r) => r.id === selectedRoomId);
    const selectedInstrument = room?.instruments?.find(
        (i) => i.id === selectedInstrumentId
    );
    const instrumentTotal = selectedInstrument
        ? selectedInstrument.price * (Number(instrumentHours) || 0)
        : 0;
    const basePrice = room?.pricePerHour ?? 0;

    let hoursSelected = 0;
    if (startTime && endTime) {
        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);
        let start = new Date();
        start.setHours(sh, sm, 0, 0);
        let end = new Date();
        end.setHours(eh, em, 0, 0);
        if (end <= start) end.setDate(end.getDate() + 1);
        hoursSelected = (end.getTime() - start.getTime()) / 1000 / 3600;
    }

    const effectiveHours = Math.max(hoursSelected, room?.minHours ?? 1);
    const subtotal = basePrice * effectiveHours + instrumentTotal;
    const total = subtotal * 1.15;

    const formatUSD = (value: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(value);

    const handleReserve = async () => {
        if (!selectedRoomId || !selectedDate || !startTime || !endTime) {
            toast.error("Seleccione sala, fecha y horas.");
            return;
        }

        const payload: BookingPayload = {
            studioId: studio.id,
            roomId: selectedRoomId,
            startTime: `${selectedDate}T${startTime}:00Z`,
            endTime: `${selectedDate}T${endTime}:00Z`,
            instrumentIds:
                selectedInstrumentId && Number(instrumentHours) > 0
                    ? [selectedInstrumentId]
                    : [],
        };

        setLoading(true); // <-- inicio carga
        try {
            await BookingService.createBooking(payload);
            toast.success("Reserva creada con éxito!");
            router.push("/myBookings");
        } catch (error) {
            console.error(error);
            toast.error("Error al crear la reserva. Intenta nuevamente.");
        } finally {
            setLoading(false); // <-- fin carga
        }
    };

    const handleReserveClick = () => {
        if (!isLoggedIn) {
            toast.info("Debe iniciar sesión para reservar.");
            return;
        }
        if (user?.role !== "Músico") {
            toast.info("Solo los músicos pueden realizar reservas.");
            return;
        }
        handleReserve();
    };

    const prevPhoto = () =>
        setCurrentPhotoIndex((prev) =>
            prev === 0 ? photos.length - 1 : prev - 1
        );
    const nextPhoto = () =>
        setCurrentPhotoIndex((prev) =>
            prev === photos.length - 1 ? 0 : prev + 1
        );

    return (
        <main className="min-h-screen bg-[#F9FAFB] text-[#0B0F12] font-sans">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="mx-auto max-w-[1300px] px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_400px]">
                    {/* Columna izquierda */}
                    <div className="space-y-3">
                        {/* Carrusel */}
                        <section className="relative w-full rounded-xl overflow-hidden shadow-xl bg-black h-[300px] sm:h-[450px] flex items-center justify-center">
                            {photos.length > 0 && (
                                <img
                                    src={photos[currentPhotoIndex]}
                                    alt={`Foto ${currentPhotoIndex + 1}`}
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                            )}
                            <button
                                onClick={prevPhoto}
                                className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/60 text-black p-2 rounded-full transition cursor-pointer"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                onClick={nextPhoto}
                                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/60 text-black p-2 rounded-full transition cursor-pointer"
                            >
                                <FaChevronRight />
                            </button>
                        </section>

                        {/* Información del estudio */}
                        <section className="rounded-xl border border-[#E5E7EB] bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-4 sm:p-6 text-white shadow-md">
                            <h1 className="text-lg sm:text-xl font-bold">
                                {studio.name}
                            </h1>
                            <p className="mt-1 text-sm text-white/80">
                                {studio.address ?? studio.city}
                            </p>
                            {studio.description && (
                                <p className="mt-2 text-sm leading-relaxed text-white/90">
                                    {studio.description}
                                </p>
                            )}
                        </section>

                        {/* Salas con disponibilidad e instrumentos */}
                        <section className="rounded-xl border border-white/20 bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-4 sm:p-6 text-white shadow-xl">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4">
                                Salas disponibles
                            </h2>
                            <div className="space-y-4">
                                {rooms.map((r) => (
                                    <div
                                        key={r.id}
                                        className="rounded-2xl border border-white/20 bg-white/10 shadow-inner p-3 sm:p-4 flex flex-col gap-3"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                            {r.images &&
                                                r.images.length > 0 && (
                                                    <img
                                                        src={r.images[0]}
                                                        alt={r.name}
                                                        className="w-full sm:w-60 h-32 sm:h-32 object-cover rounded-lg flex-shrink-0"
                                                    />
                                                )}
                                            {r.availability && (
                                                <div className="bg-black/40 px-3 py-2 rounded-lg text-xs sm:text-sm text-white sm:flex-shrink-0">
                                                    <span className="font-semibold">
                                                        Disponibilidad:
                                                    </span>
                                                    {Object.entries(
                                                        r.availability
                                                    ).map(([day, hours]) => (
                                                        <p key={day}>
                                                            {day}: {hours.start}{" "}
                                                            - {hours.end}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-base sm:text-lg font-semibold">
                                                {r.name}
                                            </h3>
                                            <p className="text-sm sm:text-base text-white/80">
                                                {r.capacity
                                                    ? `Capacidad: ${r.capacity} · `
                                                    : ""}
                                                {r.pricePerHour
                                                    ? `${formatUSD(
                                                          r.pricePerHour
                                                      )}/hora · `
                                                    : "Consultar · "}
                                                {r.features
                                                    ?.slice(0, 3)
                                                    .join(" · ")}
                                            </p>

                                            {/* Instrumentos en fila */}
                                            {r.instruments &&
                                                r.instruments.length > 0 && (
                                                    <div className="mt-3">
                                                        <span className="font-semibold text-white mb-2 block">
                                                            Instrumentos:
                                                        </span>
                                                        <div className="flex flex-wrap gap-3">
                                                            {r.instruments.map(
                                                                (i) => (
                                                                    <span
                                                                        key={
                                                                            i.id
                                                                        }
                                                                        className="bg-white/20 text-white rounded-lg px-3 py-1 shadow-sm font-medium"
                                                                    >
                                                                        {i.name}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Mapa */}
                        <section className="rounded-xl border border-white/20 bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-4 sm:p-6 shadow-md">
                            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-amber-50">
                                Ubicación
                            </h2>
                            <ClientUserLocationMap defaultCenter={center} />
                            <p className="mt-1 text-sm text-white">
                                {studio.address ?? studio.city}
                            </p>
                        </section>
                    </div>

                    {/* Columna derecha */}
                    <aside className="lg:col-span-1 mt-6 lg:mt-0">
                        <div className="lg:sticky lg:top-4 lg:max-w-[450px] lg:ml-auto">
                            <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-md space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <p className="text-sm sm:text-[18px] font-semibold">
                                        {formatUSD(basePrice)}{" "}
                                        <span className="text-xs font-normal">
                                            /hora (USD)
                                        </span>
                                    </p>
                                    <span className="text-xs text-[#0B0F12]/60">
                                        Mínimo {room?.minHours ?? 1} h
                                    </span>
                                </div>

                                <select
                                    className="w-full border rounded-lg p-2 text-sm"
                                    onChange={(e) => {
                                        setSelectedRoomId(e.target.value);
                                        setSelectedInstrumentId("");
                                        setInstrumentHours("");
                                    }}
                                >
                                    <option value="">
                                        Seleccione una sala
                                    </option>
                                    {rooms.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name} -{" "}
                                            {formatUSD(r.pricePerHour)}/hora
                                        </option>
                                    ))}
                                </select>

                                {room &&
                                    room.instruments &&
                                    room.instruments.length > 0 && (
                                        <>
                                            <label className="block text-sm font-medium text-gray-700 mt-2">
                                                Seleccione un instrumento
                                            </label>
                                            <select
                                                className="w-full border rounded-lg p-2 text-sm"
                                                value={selectedInstrumentId}
                                                onChange={(e) => {
                                                    setSelectedInstrumentId(
                                                        e.target.value
                                                    );
                                                    setInstrumentHours("");
                                                }}
                                            >
                                                <option value="">
                                                    Ninguno
                                                </option>
                                                {room.instruments.map((i) => (
                                                    <option
                                                        key={i.id}
                                                        value={i.id}
                                                    >
                                                        {i.name} -{" "}
                                                        {formatUSD(i.price)}
                                                        /hora
                                                    </option>
                                                ))}
                                            </select>

                                            {selectedInstrument && (
                                                <div className="mt-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Horas de alquiler para{" "}
                                                        {
                                                            selectedInstrument.name
                                                        }
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        step={1}
                                                        value={instrumentHours}
                                                        onChange={(e) =>
                                                            setInstrumentHours(
                                                                e.target.value
                                                                    ? Number(
                                                                          e
                                                                              .target
                                                                              .value
                                                                      )
                                                                    : ""
                                                            )
                                                        }
                                                        placeholder="Ingrese horas"
                                                        className="w-full border rounded-lg p-2 text-sm mt-1"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Subtotal instrumento:{" "}
                                                        {formatUSD(
                                                            instrumentTotal
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}

                                <div className="space-y-2 mt-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) =>
                                            setSelectedDate(e.target.value)
                                        }
                                        className="w-full border rounded-lg p-2"
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mt-2">
                                        Hora de inicio
                                    </label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) =>
                                            setStartTime(e.target.value)
                                        }
                                        className="w-full border rounded-lg p-2"
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mt-2">
                                        Hora de fin
                                    </label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) =>
                                            setEndTime(e.target.value)
                                        }
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div className="text-sm text-gray-600 mt-2 border-t pt-2 space-y-1">
                                    <p>Horas sala: {effectiveHours}</p>
                                    <p>
                                        Instrumentos: +
                                        {formatUSD(instrumentTotal)}
                                    </p>
                                    <p>
                                        Tarifa de servicios (15%): +
                                        {formatUSD(subtotal * 0.15)}
                                    </p>
                                    <p className="font-bold text-lg">
                                        Total: {formatUSD(total)} USD
                                    </p>
                                </div>

                                <button
                                    onClick={handleReserveClick}
                                    className={`w-full font-semibold py-3 rounded-lg mt-2 shadow transition ${
                                        isLoggedIn && user?.role === "Músico"
                                            ? "bg-sky-700 hover:bg-black cursor-pointer text-white"
                                            : "bg-gray-400 cursor-not-allowed text-white"
                                    }`}
                                    disabled={
                                        !isLoggedIn ||
                                        user?.role !== "Músico" ||
                                        loading
                                    } // <-- deshabilita mientras carga
                                >
                                    {loading
                                        ? "Cargando…"
                                        : isLoggedIn
                                        ? user?.role === "Músico"
                                            ? "Reservar ahora"
                                            : "No disponible para owners"
                                        : "Inicia sesión para reservar"}
                                </button>
                            </section>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
