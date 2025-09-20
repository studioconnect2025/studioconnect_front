"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { BookingService, BookingPayload } from "@/services/booking.services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ClientUserLocationMap = dynamic(
  () => import("@/components/LocationMap/ClientUserLocationMap"),
  { ssr: false }
);

type Instrument = {
  id: string;
  name: string;
  price: number;
  available: boolean;
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
  const [selectedInstruments, setSelectedInstruments] = useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [instrumentToast, setInstrumentToast] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const router = useRouter();

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

  const center: [number, number] = [studio.lat ?? -34.6037, studio.lng ?? -58.3816];

  const room = rooms.find((r) => r.id === selectedRoomId);

  const instrumentsTotal =
    room?.instruments?.reduce((acc, inst) => {
      const qty = selectedInstruments[inst.id] || 0;
      return acc + inst.price * qty;
    }, 0) ?? 0;

  const basePrice = room?.pricePerHour ?? 0;

  const hoursSelected =
    startTime && endTime
      ? (new Date(`1970-01-01T${endTime}`).getTime() -
          new Date(`1970-01-01T${startTime}`).getTime()) /
        1000 /
        3600
      : 0;

  const effectiveHours = Math.max(hoursSelected, room?.minHours ?? 1);

  const total = basePrice * effectiveHours + instrumentsTotal;

  const handleInstrumentChange = (
    instrumentId: string,
    delta: number,
    instName: string,
    roomId: string
  ) => {
    if (selectedRoomId !== roomId) {
      toast.warn("Seleccione primero esta sala para agregar instrumentos.");
      return;
    }
    setSelectedInstruments((prev) => {
      const current = prev[instrumentId] || 0;
      const newQty = Math.max(current + delta, 0);
      if (delta > 0 && newQty > current) {
        setInstrumentToast(`Agregado: ${instName} (${newQty})`);
      }
      return { ...prev, [instrumentId]: newQty };
    });
  };

  useEffect(() => {
    if (instrumentToast) {
      toast.info(instrumentToast);
      setInstrumentToast(null);
    }
  }, [instrumentToast]);

  const handleReserve = async () => {
    if (!selectedRoomId || !selectedDate || !startTime || !endTime) {
      toast.error("Seleccione sala, fecha y horas.");
      return;
    }

    // 🚨 Validación: no permitir fechas pasadas
    const today = new Date();
    const chosenDate = new Date(selectedDate + "T00:00:00");

    if (chosenDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      toast.error("No se puede reservar en años pasados ni fechas anteriores a hoy.");
      return;
    }

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const opening = new Date(`1970-01-01T${studio.openingTime ?? "00:00"}`);
    const closing = new Date(`1970-01-01T${studio.closingTime ?? "23:59"}`);

    if (start < opening || end > closing) {
      toast.error(
        `El horario seleccionado debe estar entre ${
          studio.openingTime ?? "00:00"
        } y ${studio.closingTime ?? "23:59"}`
      );
      return;
    }

    const hoursSelected = (end.getTime() - start.getTime()) / 1000 / 3600;
    if (hoursSelected < (room?.minHours ?? 1)) {
      toast.error(`Debe reservar al menos ${room?.minHours ?? 1} hora(s).`);
      return;
    }

    const instrumentIds = Object.entries(selectedInstruments)
      .filter(([_, qty]) => qty > 0)
      .map(([id, _]) => id);

    const instrumentNames = room?.instruments
      ?.filter((inst) => instrumentIds.includes(inst.id))
      .map((inst) => inst.name)
      .join(", ");

    const payload: BookingPayload = {
      studioId: studio.id,
      roomId: selectedRoomId,
      startTime: `${selectedDate}T${startTime}:00Z`,
      endTime: `${selectedDate}T${endTime}:00Z`,
      instrumentIds,
    };

    try {
      await BookingService.createBooking(payload);
      toast.success(
        `Reserva creada con éxito! ${
          instrumentNames ? `Instrumentos: ${instrumentNames}` : ""
        }`
      );
      router.push("/myBookings");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la reserva. Intenta nuevamente.");
    }
  };

  const prevPhoto = () =>
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  const nextPhoto = () =>
    setCurrentPhotoIndex((prev) =>
      prev === photos.length - 1 ? 0 : prev + 1
    );

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#0B0F12] font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Columna izquierda */}
          <div className="space-y-4">
            {/* Carrusel de fotos */}
            <section className="relative w-full rounded-xl overflow-hidden shadow-xl bg-black h-[450px] flex items-center justify-center">
              {photos.length > 0 && (
                <img
                  src={photos[currentPhotoIndex]}
                  alt={`Foto ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              )}
              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/60 text-black p-2 rounded-full transition cursor-pointer"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/60 text-black p-2 rounded-full transition cursor-pointer"
              >
                <FaChevronRight />
              </button>
            </section>

            {/* Tarjeta estudio */}
            <section className="rounded-xl border border-[#E5E7EB] bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-6 text-white shadow-md">
              <h1 className="text-xl font-bold">{studio.name}</h1>
              <p className="mt-1 text-sm text-white/80">
                {studio.address ?? studio.city}
              </p>
              {studio.description && (
                <p className="mt-3 text-sm leading-relaxed text-white/90">
                  {studio.description}
                </p>
              )}
              {studio.openingTime && studio.closingTime && (
                <p className="mt-2 text-sm text-white/80">
                  Horarios de atención: {studio.openingTime} a{" "}
                  {studio.closingTime}
                </p>
              )}
            </section>

            {/* Salas disponibles */}
            <section className="rounded-xl border border-white/20 bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-6 text-white shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Salas disponibles</h2>
              <div className="space-y-5">
                {rooms.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-white/20 bg-white/10 shadow-inner p-4"
                  >
                    <h3 className="text-lg font-semibold mb-2">{r.name}</h3>
                    <p className="text-sm text-white/80 mb-2">
                      {r.capacity ? `Capacidad: ${r.capacity} · ` : ""}
                      {r.pricePerHour
                        ? `$${r.pricePerHour}/hora · `
                        : "Consultar · "}
                      {r.features?.slice(0, 3).join(" · ")}
                    </p>

                    {r.images && r.images.length > 0 && (
                      <div className="flex overflow-x-auto gap-3 mb-3">
                        {r.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${r.name} ${idx}`}
                            className="h-[120px] object-contain rounded-lg flex-shrink-0"
                          />
                        ))}
                      </div>
                    )}

                    {r.instruments && r.instruments.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Instrumentos:
                        </p>
                        <ul className="space-y-2">
                          {r.instruments.map((inst) => (
                            <li
                              key={inst.id}
                              className="flex items-center justify-between bg-white/10 px-3 py-2 rounded-lg border border-white/30"
                            >
                              <span>{inst.name}</span>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 bg-white/10 rounded px-1 py-0.5">
                                  <button
                                    onClick={() =>
                                      handleInstrumentChange(
                                        inst.id,
                                        -1,
                                        inst.name,
                                        r.id
                                      )
                                    }
                                    className="w-8 h-8 flex items-center justify-center rounded bg-white/20 hover:bg-white/30 transition cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center">
                                    {selectedInstruments[inst.id] || 0}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleInstrumentChange(
                                        inst.id,
                                        1,
                                        inst.name,
                                        r.id
                                      )
                                    }
                                    className="w-8 h-8 flex items-center justify-center rounded bg-white/20 hover:bg-white/30 transition cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="text-white/70 text-sm w-[60px] text-right">
                                  ${inst.price}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
                {rooms.length === 0 && (
                  <p className="text-sm text-white/70">
                    Este estudio aún no tiene salas publicadas.
                  </p>
                )}
              </div>
            </section>

            {/* Mapa */}
            <section className="rounded-xl border border-white/20 bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-amber-50">
                Ubicación
              </h2>
              <ClientUserLocationMap center={center} />
              <p className="mt-2 text-sm text-white">
                {studio.address ?? studio.city}
              </p>
            </section>
          </div>

          {/* Columna derecha */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-md">
                <div className="flex items-baseline justify-between">
                  <p className="text-[18px] font-semibold">
                    ${basePrice.toLocaleString()}{" "}
                    <span className="text-sm font-normal">/hora</span>
                  </p>
                  <span className="text-xs text-[#0B0F12]/60">
                    Mínimo {room?.minHours ?? 1} horas
                  </span>
                </div>

                <div className="space-y-3 mt-3">
                  <select
                    className="w-full border rounded-lg p-2 text-sm"
                    onChange={(e) => {
                      setSelectedRoomId(e.target.value);
                      setSelectedInstruments({});
                    }}
                  >
                    <option value="">Seleccione una sala</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} - ${r.pricePerHour}/hora - Mínimo {r.minHours}{" "}
                        h
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fecha y horas */}
                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    Hora de inicio
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    min={studio.openingTime ?? "00:00"}
                    max={studio.closingTime ?? "23:59"}
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    Hora de fin
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    min={startTime || studio.openingTime || "00:00"}
                    max={studio.closingTime ?? "23:59"}
                  />
                </div>

                {/* Total */}
                <div className="text-sm text-gray-600 mt-3 border-t pt-3 space-y-1">
                  <p>Horas: {effectiveHours}</p>
                  <p>Instrumentos: +${instrumentsTotal}</p>
                  <p className="font-bold text-lg">Total: ${total}</p>
                </div>

                <button
                  onClick={handleReserve}
                  className="w-full bg-sky-700 hover:bg-black cursor-pointer text-white font-semibold py-3 rounded-lg mt-4 shadow transition"
                >
                  Reservar ahora
                </button>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
