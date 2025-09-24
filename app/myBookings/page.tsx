"use client";

import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaUsers, FaCalendarCheck, FaStar } from "react-icons/fa";
import { Booking, BookingService, InstrumentBooking } from "@/services/booking.services";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const monthsES = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre"
];

const extractHHMM = (iso?: string) => {
  if (!iso) return "";
  const tIndex = iso.indexOf("T");
  if (tIndex === -1) return iso;
  let timePart = iso.substring(tIndex + 1);
  timePart = timePart.replace("Z", "");
  timePart = timePart.split(".")[0];
  const [hh, mm] = timePart.split(":");
  return `${hh}:${mm}`;
};

const formatDateFromISO = (iso?: string) => {
  if (!iso) return "";
  const datePart = iso.split("T")[0];
  const [year, month, day] = datePart.split("-");
  const monthName = monthsES[Number(month) - 1] ?? month;
  return `${Number(day)} de ${monthName} de ${year}`;
};

const formatTimeRangeRaw = (start?: string, end?: string) => {
  return `${extractHHMM(start)} - ${extractHHMM(end)}`;
};

export default function Reservas() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    // usamos accessToken como definiste; si cambia, agregá más claves acá
    return localStorage.getItem("accessToken") || null;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        toast.error("No hay sesión activa. Iniciá sesión para ver tus reservas.");
        setBookings([]);
        return;
      }
      // BookingService.getMyBookings REQUIERE token
      const data = await BookingService.getMyBookings(token);
      setBookings(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar tus reservas");
    } finally {
      setLoading(false);
    }
  };

  // Contar cancelaciones realizadas "hoy" (usa updatedAt si viene)
  const getTodayCancellations = () => {
    const today = new Date();
    return bookings.filter((b) => {
      if (b.status !== "CANCELADA") return false;
      const when = b.updatedAt ? new Date(b.updatedAt) : null;
      if (!when) return false;
      return (
        when.getDate() === today.getDate() &&
        when.getMonth() === today.getMonth() &&
        when.getFullYear() === today.getFullYear()
      );
    }).length;
  };

  // Se puede cancelar si faltan al menos 48h y no superó el límite diario de 2
  const canCancel = (startTime?: string) => {
    if (!startTime) return false;
    const diffMs = new Date(startTime).getTime() - Date.now();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    return diffMs >= fortyEightHours && getTodayCancellations() < 2;
  };

  const cancelReservation = async (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    if (!canCancel(booking.startTime)) {
      toast.error(
        "No se puede cancelar esta reserva: faltan menos de 2 días o ya alcanzaste el límite diario de cancelaciones."
      );
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar reserva",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const token = getToken();
        if (!token) {
          toast.error("No hay sesión activa.");
          return;
        }
        const updatedBooking = await BookingService.cancelBooking(bookingId, token);
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  status: updatedBooking.status,
                  // reflejamos timestamps si back no los manda
                  updatedAt: updatedBooking.updatedAt ?? new Date().toISOString(),
                }
              : b
          )
        );
        toast.success("Reserva cancelada correctamente");
      } catch (error: any) {
        console.error(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error al cancelar la reserva");
        }
      }
    }
  };

  // mostrar pagar solo si NO está cancelada y NO está paga
  const canPay = (b: Booking) => b.status !== "CANCELADA" && !b.isPaid;

  // navega al checkout (la página obtiene el clientSecret)
  const goToCheckout = (b: Booking) => {
    router.push(`/payments/booking/${b.id}`);
  };

  const now = new Date();

  const proximas = bookings
    .filter((b) => b.startTime && new Date(b.startTime) >= now && b.status !== "CANCELADA")
    .sort((a, b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime());

  const pasadas = bookings
    .filter((b) => b.startTime && new Date(b.startTime) < now && b.status !== "CANCELADA")
    .sort((a, b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime());

  const canceladas = bookings
    .filter((b) => b.status === "CANCELADA")
    .sort((a, b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime());

  const formatDuration = (start?: string, end?: string) => {
    if (!start || !end) return "";
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const diffMinutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  const handleRating = (bookingId: string, stars: number) => {
    setRatings((prev) => ({ ...prev, [bookingId]: stars }));
    toast.success(`Reserva calificada con ${stars} estrellas`);
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "PENDIENTE":
      case "PENDING":
        return "Pendiente";
      case "CONFIRMED":
      case "CONFIRMADA":
        return "Confirmada";
      case "CANCELADA":
      case "CANCELLED":
        return "Cancelada";
      case "COMPLETADA":
      case "COMPLETED":
        return "Completado";
      default:
        return status;
    }
  };

  const renderInstruments = (instruments?: InstrumentBooking[] | null) => {
    if (!instruments || instruments.length === 0) return null;
    return (
      <div className="mt-2 text-sm text-gray-700">
        <p className="font-semibold">Instrumentos alquilados:</p>
        <ul className="list-disc ml-5">
          {instruments.map((inst) => (
            <li key={inst.id} className="flex items-center gap-2">
              {inst.name} (${inst.price})
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sky-700 text-lg font-semibold">Cargando reservas...</p>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen items-center">
      <ToastContainer />
      <div className="w-full bg-sky-800 text-white py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Mis Reservas</h1>
        <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto">
          Gestiona tus reservas de salas
        </p>
        <div className="flex justify-center mt-2">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <FaCalendarCheck size={40} className="text-sky-700" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Próximas Sesiones */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Próximas Sesiones</h2>
          <div className="space-y-4">
            {proximas.length === 0 && <p className="text-gray-500">No tienes próximas reservas.</p>}
            {proximas.map((b) => (
              <div
                key={b.id}
                className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {b.studio} - {b.room}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-sky-700" /> {formatDateFromISO(b.startTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-sky-700" /> {formatTimeRangeRaw(b.startTime, b.endTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUsers className="text-sky-700" /> {formatDuration(b.startTime, b.endTime)}
                    </span>
                  </div>

                  {renderInstruments(b.instruments)}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end space-x-0 sm:space-x-3 mt-3 sm:mt-0 w-full sm:w-auto gap-2">
                  <p className="font-semibold text-gray-800">Total ${b.totalPrice}</p>

                  {/* Estado de pago segun Dai */}
                  {b.status !== "CANCELADA" && (
                    <>
                      {b.isPaid ? (
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-md font-semibold">
                          Reserva pagada
                        </span>
                      ) : (
                        <>
                          {canPay(b) && (
                            <button
                              onClick={() => goToCheckout(b)}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
                            >
                              Pagar reserva
                            </button>
                          )}

                          {canCancel(b.startTime) ? (
                            <button
                              onClick={() => cancelReservation(b.id)}
                              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition"
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
                    </>
                  )}

                  {b.status === "CANCELADA" && (
                    <span className="text-red-600 font-semibold px-4 py-2 rounded-md border border-red-300">
                      {translateStatus(b.status)}
                    </span>
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
            {pasadas.map((b) => (
              <div key={b.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">{b.studio} - {b.room}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-sky-700" /> {formatDateFromISO(b.startTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-sky-700" /> {formatTimeRangeRaw(b.startTime, b.endTime)}
                  </span>
                  <span className="text-green-600 font-medium">{translateStatus(b.status)}</span>
                </div>

                {renderInstruments(b.instruments)}

                <div className="flex flex-wrap items-center justify-between mt-3">
                  <p className="font-semibold text-gray-800">Total ${b.totalPrice}</p>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <FaStar
                        key={star}
                        size={20}
                        className={`cursor-pointer ${ratings[b.id] && ratings[b.id] >= star ? "text-yellow-400" : "text-gray-300"}`}
                        onClick={() => handleRating(b.id, star)}
                      />
                    ))}
                  </div>
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
            {canceladas.map((b) => (
              <div key={b.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">{b.studio} - {b.room}</h3>
                <span className="text-red-600 font-medium mt-1">{translateStatus(b.status)}</span>

                {renderInstruments(b.instruments)}

                <p className="font-semibold text-gray-800 mt-2">Total ${b.totalPrice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
