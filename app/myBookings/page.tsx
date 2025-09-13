"use client";

import { FaCalendarAlt, FaClock, FaUsers, FaCommentDots, FaCalendarCheck } from "react-icons/fa";


interface Reserva {
  id: number;
  estudio: string;
  ciudad: string;
  fecha: string;
  hora: string;
  duracion: string;
  precio: string;
  estado?: "Completado" | "Pendiente";
}

const proximas: Reserva[] = [
  {
    id: 1,
    estudio: "Harmony Studios - Sala A",
    ciudad: "Palermo, BS AS",
    fecha: "15 de marzo, 2025",
    hora: "2:00 PM - 6:00 PM",
    duracion: "4 horas",
    precio: "$48.000",
  },
  {
    id: 2,
    estudio: "Sound Wave Studios - Sala B",
    ciudad: "La plata, BS AS",
    fecha: "22 de marzo, 2025",
    hora: "10:00 AM - 2:00 PM",
    duracion: "4 horas",
    precio: "$20.000",
  },
  {
    id: 3,
    estudio: "Echo Chamber - Sala C",
    ciudad: "Pilar, BS AS",
    fecha: "5 de abril, 2025",
    hora: "7:00 PM - 11:00 PM",
    duracion: "4 horas",
    precio: "$50.000",
  },
];

const pasadas: Reserva[] = [
  {
    id: 4,
    estudio: "Vintage Sound Studios - Sala D",
    ciudad: "Pilar",
    fecha: "28 de febrero, 2025",
    hora: "1:00 PM - 5:00 PM",
    duracion: "4 horas",
    precio: "$400",
    estado: "Completado",
  },
  {
    id: 5,
    estudio: "Blue Moon Records - Sala E",
    ciudad: "Zarate",
    fecha: "15 de febrero, 2025",
    hora: "3:00 PM - 9:00 PM",
    duracion: "6 horas",
    precio: "$600",
    estado: "Completado",
  },
];

const Reservas = () => {
  return (
    <div className="bg-gray-100 min-h-screen items-center">
      {/* Header */}
          <div className="w-full bg-sky-800 text-white py-5 text-center">
            <h1 className="text-2xl md:text-3xl font-bold">Mis Reservas</h1>
            <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto">
             Gestiona tus próximas reservas de salas
            </p>
            <div className="flex justify-center mt-2">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <FaCalendarCheck  size={50} className="text-sky-700" />
              </div>
            </div>
          </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Próximas Sesiones */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Próximas Sesiones
          </h2>
          <div className="space-y-4">
            {proximas.map((reserva) => (
              <div
                key={reserva.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4"
              >
                {/* Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                    Estudio
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {reserva.estudio}
                    </h3>
                    <p className="text-sm text-gray-500">{reserva.ciudad}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-sky-700" />{" "}
                        {reserva.fecha}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-sky-700" /> {reserva.hora}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUsers className="text-sky-700" /> {reserva.duracion}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center sm:space-x-6 mt-3 sm:mt-0">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0">
                    Total {reserva.precio}
                  </p>
                  <button className="bg-sky-700 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-sky-900 transition">
                    <FaCommentDots /> Contactar al estudio
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition mt-2 sm:mt-0">
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sesiones Pasadas */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sesiones Pasadas
          </h2>
          <div className="space-y-4">
            {pasadas.map((reserva) => (
              <div
                key={reserva.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4"
              >
                {/* Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                    Estudio
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {reserva.estudio}
                    </h3>
                    <p className="text-sm text-gray-500">{reserva.ciudad}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-sky-700" />{" "}
                        {reserva.fecha}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-sky-700" /> {reserva.hora}
                      </span>
                      <span className="text-green-600 font-medium">
                        {reserva.estado}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center sm:space-x-6 mt-3 sm:mt-0">
                  <p className="font-semibold text-gray-800 mb-2 sm:mb-0">
                    Total {reserva.precio}
                  </p>
                  <button className="bg-sky-700 text-white px-4 py-2 rounded-md hover:bg-sky-900 transition">
                    Dejar Reseña
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition mt-2 sm:mt-0">
                    Reservar de Nuevo
                  </button>
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
