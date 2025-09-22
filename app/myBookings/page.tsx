"use client";

import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaUsers, FaCalendarCheck, FaStar } from "react-icons/fa";
import { Booking, BookingService } from "@/services/booking.services";
import { OwnerService, Studio } from "@/services/studio.services";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation"


interface BookingWithStudio extends Booking {
  studioData?: Studio;
}

const Reservas = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await BookingService.getMyBookings();

      // Traer datos de cada estudio
      const bookingsWithStudio = await Promise.all(
        data.map(async (b) => {
          try {
            const studioData = await OwnerService.getStudioById(b.studio);
            return { ...b, studioData };
          } catch {
            return b; 
          }
        })
      );

      setBookings(bookingsWithStudio);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar tus reservas");
    } finally {
      setLoading(false);
    }
  };

  const canCancel = (startTime: string) => {
    const now = new Date();
    const bookingDate = new Date(startTime);
    const diffInDays = (bookingDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffInDays >= 2; 
  };

  const cancelReservation = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (!canCancel(booking.startTime)) {
      toast.error("No se puede cancelar esta reserva: faltan menos de 2 días o límite diario alcanzado.");
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar reserva',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      try {
        await BookingService.cancelBooking(bookingId);
        toast.success("Reserva cancelada correctamente");
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "CANCELLED" } : b));
      } catch (error) {
        console.error(error);
        toast.error("Error al cancelar la reserva");
      }
    }
  };

  const now = new Date();
  const proximas = bookings.filter(b => new Date(b.startTime) >= now && b.status !== "CANCELLED");
  const pasadas = bookings.filter(b => new Date(b.startTime) < now && b.status !== "CANCELLED");
  const canceladas = bookings.filter(b => b.status === "CANCELLED");

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

  const formatTime = (start: string, end: string) => {
    const s = new Date(start).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const e = new Date(end).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    return `${s} - ${e}`;
  };

  const formatDuration = (start: string, end: string) => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const diffMinutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  const handleRating = (bookingId: string, stars: number) => {
    setRatings(prev => ({ ...prev, [bookingId]: stars }));
    toast.success(`Reserva calificada con ${stars} estrellas`);
  };

  // 🔹 Traducción de estados del backend al front
  const translateStatus = (status: string) => {
    switch (status) {
      case "PENDING": return "Pendiente";
      case "CONFIRMED": return "Confirmada";
      case "CANCELLED": return "Cancelada";
      default: return status;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-sky-700 text-lg font-semibold">Cargando reservas...</p>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen items-center">
      <ToastContainer />
      <div className="w-full bg-sky-800 text-white py-5 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Mis Reservas</h1>
        <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto">Gestiona tus reservas de salas</p>
        <div className="flex justify-center mt-2">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <FaCalendarCheck size={50} className="text-sky-700" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Próximas Sesiones */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Próximas Sesiones</h2>
          <div className="space-y-4">
            {proximas.length === 0 && <p className="text-gray-500">No tienes próximas reservas.</p>}
            {proximas.map(b => (
              <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                    <img
                      src={b.studioData?.photos?.[0] ?? "/images/placeholders/studio-cover.jpg"}
                      alt={b.studioData?.name ?? "Estudio"}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{b.studioData?.name ?? b.studio} - {b.room}</h3>
                    <p className="text-sm text-gray-500">{b.studioData?.city ?? ""}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                      <span className="flex items-center gap-1"><FaCalendarAlt className="text-sky-700" /> {formatDate(b.startTime)}</span>
                      <span className="flex items-center gap-1"><FaClock className="text-sky-700" /> {formatTime(b.startTime, b.endTime)}</span>
                      <span className="flex items-center gap-1"><FaUsers className="text-sky-700" /> {formatDuration(b.startTime, b.endTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center sm:space-x-6 mt-3 sm:mt-0">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0">Total ${b.totalPrice}</p>

                  {b.status === "CANCELLED" ? (
                    <span className="text-red-600 font-semibold px-4 py-2 rounded-md border border-red-300">
                      {translateStatus(b.status)}
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => router.push(`/payments/booking/${b.id}`)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
                      >
                        Pagar reserva
                      </button>

                      {canCancel(b.startTime) ? (
                        <button
                          onClick={() => cancelReservation(b.id)}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition ml-2"
                        >
                          Cancelar
                        </button>
                      ) : (
                        <span className="ml-2 relative group cursor-pointer text-gray-500 px-3 py-1 border rounded-full">
                          ?
                          <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-xs px-2 py-1 rounded w-64 text-center">
                            Solo se puede cancelar hasta 2 días antes de la reserva o ya alcanzaste el límite de cancelaciones diarias
                          </span>
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sesiones Pasadas */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sesiones Pasadas</h2>
          <div className="space-y-4">
            {pasadas.length === 0 && <p className="text-gray-500">No tienes reservas pasadas.</p>}
            {pasadas.map(b => (
              <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                    <img
                      src={b.studioData?.photos?.[0] ?? "/images/placeholders/studio-cover.jpg"}
                      alt={b.studioData?.name ?? "Estudio"}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{b.studioData?.name ?? b.studio} - {b.room}</h3>
                    <p className="text-sm text-gray-500">{b.studioData?.city ?? ""}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                      <span className="flex items-center gap-1"><FaCalendarAlt className="text-sky-700" /> {formatDate(b.startTime)}</span>
                      <span className="flex items-center gap-1"><FaClock className="text-sky-700" /> {formatTime(b.startTime, b.endTime)}</span>
                      <span className="text-green-600 font-medium">{translateStatus(b.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center sm:space-x-6 mt-3 sm:mt-0">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0">Total ${b.totalPrice}</p>

                  {/* Puntuación con estrellas */}
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(star => (
                      <FaStar
                        key={star}
                        size={20}
                        className={`cursor-pointer ${ratings[b.id] && ratings[b.id] >= star ? "text-yellow-400" : "text-gray-300"}`}
                        onClick={() => handleRating(b.id, star)}
                      />
                    ))}
                  </div>

                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition mt-2 sm:mt-0">
                    Reservar de Nuevo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reservas Canceladas */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reservas Canceladas</h2>
          <div className="space-y-4">
            {canceladas.length === 0 && <p className="text-gray-500">No tienes reservas canceladas.</p>}
            {canceladas.map(b => (
              <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                    <img
                      src={b.studioData?.photos?.[0] ?? "/images/placeholders/studio-cover.jpg"}
                      alt={b.studioData?.name ?? "Estudio"}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{b.studioData?.name ?? b.studio} - {b.room}</h3>
                    <p className="text-sm text-gray-500">{b.studioData?.city ?? ""}</p>
                    <span className="text-red-600 font-medium mt-1">{translateStatus(b.status)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center sm:space-x-6 mt-3 sm:mt-0">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0">Total ${b.totalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservas;
