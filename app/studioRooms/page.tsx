'use client';

import { FC, useEffect, useState } from "react";
import { FaEdit, FaCalendarAlt } from "react-icons/fa";
import { Room, getRoomsMockByStudioId } from "../../mocks/rooms";

type RoomsGridProps = {
    studioId: string;
};

const RoomsGrid: FC<RoomsGridProps> = ({ studioId }) => {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const data = getRoomsMockByStudioId(studioId);
        setRooms(data);
    }, [studioId]);

    return (
        <section className="min-h-screen bg-gray-50 flex flex-col items-center">
                {/* Header */}
                <div className="bg-sky-800 flex flex-col md:flex-row justify-between text-white py-10 px-6 shadow-md  mb-6 w-full">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-xl md:text-2xl font-semibold">
                            Gestión de Salas del Estudio
                        </h1>
                        <p className="text-xs md:text-sm text-sky-100 mt-1">
                            Administra las salas de tu estudio, agrega nuevos espacios y edita los detalles de las salas existentes
                        </p>
                    </div>
                    <div>
                        <button className="inline-flex items-center gap-2 bg-black px-2 py-2 rounded-lg shadow hover:bg-gray-900 transition text-xs mt-10">
                            <span className="text-base">＋</span> Agregar nueva sala
                        </button>
                    </div>
                </div>

                {/* Grid de tarjetas */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 w-[130vh]">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="rounded-xl border shadow-sm hover:shadow-xl transition flex flex-col "
                        >
                            {/* Header de la tarjeta */}
                            <div className="h-48 bg-gray-200 rounded-t-xl flex items-center justify-center text-gray-600 text-xs font-medium">
                                {room.title}
                            </div>

                            {/* Body */}
                            <div className="flex-1 p-4 flex flex-col gap-2">
                                <h2 className="text-base font-semibold text-gray-900">
                                    {room.title}
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Capacidad:{" "}
                                    <span className="font-medium text-gray-700">
                                        {room.capacity ?? "-"} personas
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500">Tamaño: </p>
                                <p className="text-xs text-gray-500">
                                    Tarifa:{" "}
                                    <span className="font-medium text-gray-700">
                                        ${room.priceHour.toLocaleString()}/hora
                                    </span>
                                </p>

                                {room.features && (
                                    <div className="mt-2">
                                        <p className="text-xs font-medium text-gray-700">
                                            Equipamiento
                                        </p>
                                        <ul className="mt-1 text-xs text-gray-600 list-disc list-inside space-y-0.5">
                                            {room.features.map((f, i) => (
                                                <li key={i}>{f}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between gap-2 p-3 border-t">
                                <button className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-500 py-1.5 rounded-lg hover:bg-gray-200 transition text-xs">
                                    <FaEdit /> Editar
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 bg-sky-600 text-white py-1.5 rounded-lg hover:bg-sky-700 transition text-xs">
                                    <FaCalendarAlt /> Programar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
        </section>
    );
};

export default RoomsGrid;
