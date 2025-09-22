"use client";

import { FC, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaDoorOpen, FaPiggyBank, FaTrashArrowUp } from "react-icons/fa6";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { roomsService } from "@/services/rooms.service";
import { instrumentsService } from "@/services/instruments.service";
import type { Room as RoomType, Instrument as InstrumentType } from "@/types/Rooms";
import { getMyStudio, type Studio } from "@/services/myStudio.services";


// ==================== Modal Edición Sala ====================
interface EditRoomModalProps {
    room: RoomType;
    onClose: () => void;
    onUpdated: (updatedRoom: RoomType) => void;
}

const EditRoomModal: FC<EditRoomModalProps> = ({ room, onClose, onUpdated }) => {
    const [formData, setFormData] = useState({
        name: "",
        capacity: 0,
        size: 0,
        pricePerHour: "",
        description: "",
    });
    const [images, setImages] = useState<FileList | null>(null);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Instrumentos locales para editar en el modal
    const [instruments, setInstruments] = useState<InstrumentType[]>([]);
    const handleDeleteImage = async (index: number) => {
    const result = await Swal.fire({
        title: "¿Eliminar esta imagen?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;

    try {
        await roomsService.deleteRoomImage({ roomId: room.id, imageIndex: index });
        setImagesPreview(prev => prev.filter((_, i) => i !== index));
        toast.success("Imagen eliminada");
    } catch (error) {
        console.error(error);
        toast.error("No se pudo eliminar la imagen");
    }
};


    useEffect(() => {
        if (room) {
            setFormData({
                name: room.name,
                capacity: room.capacity ?? 0,
                size: room.size ?? 0,
                pricePerHour: room.pricePerHour ?? "",
                description: room.description ?? "",
            });
            setImagesPreview(room.imageUrls || []);
            // Cargar instrumentos del room
            setInstruments(room.instruments || []);
        }
    }, [room]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleDeleteInstrument = async (id: string) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar instrumento?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        });
        if (!confirm.isConfirmed) return;

        try {
            await instrumentsService.deleteInstrument(id);
            setInstruments(prev => prev.filter(i => i.id !== id));
            toast.success("Instrumento eliminado");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar el instrumento");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const roomData = {
                ...formData,
                capacity: Number(formData.capacity),
                size: Number(formData.size),
                pricePerHour: Number(formData.pricePerHour),
            };
            const updatedRoom = await roomsService.updateRoom({ roomId: room.id, roomData });

            if (images) {
                const form = new FormData();
                Array.from(images).forEach(file => form.append("images", file));
                await roomsService.uploadRoomImages({ roomId: room.id, imagesFormData: form });
            }

            onUpdated(updatedRoom);
            onClose();
            toast.success("Sala actualizada correctamente");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo editar la sala.");
        } finally {
            setLoading(false);
        }
    };

    if (!room) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg overflow-y-auto max-h-[90vh]">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Editar Sala</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {/* Inputs */}
                    <div className="flex flex-col">
                        <label className="text-gray-700">Nombre</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border rounded-lg p-2 text-gray-700"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700">Capacidad</label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="border rounded-lg p-2 text-gray-700"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700">Tamaño (m²)</label>
                        <input
                            type="number"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            className="border rounded-lg p-2 text-gray-700"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700">Precio por hora</label>
                        <input
                            type="number"
                            name="pricePerHour"
                            value={formData.pricePerHour}
                            onChange={handleChange}
                            className="border rounded-lg p-2 text-gray-700"
                        />
                    </div>
                    <div className="flex flex-col col-span-2">
                        <label className="text-gray-700">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="border rounded-lg p-2 text-gray-700"
                        />
                    </div>

                    {/* Instrumentos */}
                    <div className="col-span-2 mt-2">
                        <h3 className="text-gray-700 font-semibold mb-2">Instrumentos</h3>
                        {instruments.length > 0 ? (
                            <ul className="space-y-1">
                                {instruments.map(inst => (
                                    <li
                                        key={inst.id}
                                        className="flex justify-between items-center text-gray-700 border-b py-1"
                                    >
                                        <span>{inst.name}</span>
                                        <div className="flex gap-2 items-center">
                                            <span>${inst.price}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteInstrument(inst.id)}
                                                className="text-red-600 hover:text-red-800 cursor-pointer text-sm"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 text-sm">No hay instrumentos asignados.</p>
                        )}
                    </div>

                    {/* Imágenes */}
                    {imagesPreview.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 col-span-2">
                            {imagesPreview.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img src={img} className="w-full h-24 object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(idx)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1 text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="col-span-2 text-gray-700">
                        <input type="file" multiple onChange={e => setImages(e.target.files)} />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 justify-end col-span-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ==================== Modal Agregar Instrumento ====================
interface AddInstrumentModalProps {
    roomId: string;
    onClose: () => void;
    onAdded: (instrument: InstrumentType) => void;
}

const AddInstrumentModal: FC<AddInstrumentModalProps> = ({ roomId, onClose, onAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        available: true,
        categoryName: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newInstrument = await instrumentsService.addInstrument({
                roomId,
                instrumentData: { ...formData, price: Number(formData.price) },
            });

            // Enviar al RoomsGrid para render inmediato
            onAdded(newInstrument);
            onClose();
            toast.success("Instrumento agregado correctamente");
        } catch (error) {
            console.error("Error agregando instrumento:", error);
            toast.error("No se pudo agregar el instrumento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-gray-700">
                <h2 className="text-lg font-semibold mb-4">Agregar Instrumento</h2>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} className="border rounded-lg p-2" required />
                    <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} className="border rounded-lg p-2" required />
                    <input type="number" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} className="border rounded-lg p-2" required />
                    <input type="text" name="categoryName" placeholder="Categoría" value={formData.categoryName} onChange={handleChange} className="border rounded-lg p-2" />
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                        Disponible
                    </label>
                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
                            {loading ? "Agregando..." : "Agregar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ==================== RoomsGrid ====================
const RoomsGrid: FC = () => {
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
    const [instrumentRoomId, setInstrumentRoomId] = useState<string | null>(null);

    // Mapea roomId => instrumentos
    const [instrumentsMap, setInstrumentsMap] = useState<Record<string, InstrumentType[]>>({});

      // 🔥 MOD: estado del estudio
    const [studio, setStudio] = useState<Studio | null>(null);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const roomsData = await roomsService.getRooms();
            const instrumentsData = await instrumentsService.getInstruments();

                        // 🔥 MOD: obtener estudio del dueño
            const { studio } = await getMyStudio();
            setStudio(studio);

            const map: Record<string, InstrumentType[]> = {};
            roomsData.forEach((room: RoomType) => {
                map[room.id] = instrumentsData.filter((inst: InstrumentType) => inst.room?.id === room.id);
            });

            setRooms(roomsData);
            setInstrumentsMap(map);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error al obtener salas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleDelete = async (roomId: string) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        });
        if (!result.isConfirmed) return;

        try {
            await roomsService.deleteRoom({ roomId });
            setRooms(prev => prev.filter(r => r.id !== roomId));
            const newMap = { ...instrumentsMap };
            delete newMap[roomId];
            setInstrumentsMap(newMap);
            toast.success("Sala eliminada correctamente");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar la sala");
        }
    };

    // Agrega instrumento sin recargar
    const handleInstrumentAdded = (roomId: string, instrument: InstrumentType) => {
        setInstrumentsMap(prev => ({
            ...prev,
            [roomId]: [...(prev[roomId] || []), { ...instrument, id: instrument.id || crypto.randomUUID() }],
        }));
    };

    const handleRoomUpdated = (updatedRoom: RoomType) => {
        setRooms(prev => prev.map(r => r.id === updatedRoom.id ? { ...r, ...updatedRoom } : r));
    };
    if (loading)
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-white">
                <p className="text-gray-700">Cargando salas...</p>
            </div>
        );

    if (error)
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-white">
                <p className="text-red-500">{error}</p>
            </div>
        );

    return (
        <section className="min-h-[70vh] bg-white flex flex-col items-center w-full">
            <ToastContainer />

            {/* Header */}
          <div className="bg-sky-800 flex flex-col md:flex-row md:items-center justify-between text-white py-6 px-4 md:px-8 shadow-md mb-6 w-full">
  <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
    {/* Icono + Título */}
    <div className="flex items-center justify-center gap-4 mb-4">
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
        <FaDoorOpen size={40} className="text-sky-700" />
      </div>
      <h1 className="text-4xl font-semibold">Gestión de Salas del Estudio</h1>
    </div>

    {/* Texto descriptivo */}
    <p className="text-sm font-medium text-gray-200">
      Administra las salas de tu estudio, agrega nuevos instrumentos y edita los detalles de las salas existentes.
    </p>
  </div>

  {/* Botón */}
  <div className="justify-start md:justify-end mt-4 md:mt-0">
    <Link
      href="/createRoom"
      className="inline-flex items-center gap-2 bg-black px-3 py-2 rounded-lg shadow hover:bg-gray-900 text-sm text-white cursor-pointer"
    >
      <span className="text-lg">＋</span> Agregar nueva sala
    </Link>
  </div>
</div>

            {/* 🔥 MOD: Aviso de autorización */}
            {studio && (
                <div
                    className={`w-full text-center py-3 mb-6 font-bold text-3xl rounded-lg ${
                        studio.status === "AUTHORIZED"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                    }`}
                >
                    {studio.status === "AUTHORIZED"
                        ? "Ya estás autorizado para gestionar tu estudio"
                        : "Tu estudio aún espera autorización"}
                </div>
            )}

            {/* Grid de salas */}
            <div className="w-full items-center max-w-[120vh] mb-10 py-4">
                {rooms.length === 0 ? (
                    <div className="min-h-[30vh] flex items-center justify-center">
                        <p className="text-gray-700 text-lg text-center">
                            Todavía no has creado salas para tu estudio.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className="rounded-xl border shadow-sm hover:shadow-xl transition flex flex-col"
                            >
                                {/* Imagen principal */}
                                <div className="h-48 rounded-t-xl overflow-hidden bg-gray-200">
                                    {room.imageUrls?.[0] ? (
                                        <img
                                            src={room.imageUrls[0]}
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-gray-600 text-sm font-medium text-center px-2">
                                                Sin imagen
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Información de sala */}
                                <div className="flex-1 p-4 flex flex-col gap-2">
                                    <h2 className="text-2xl text-gray-900">
                                        {room.name}
                                    </h2>
                                    <p className="text-lg text-gray-500">
                                        Capacidad:{" "}
                                        <span className="font-medium text-gray-700">
                                            {room.capacity ?? "-"} personas
                                        </span>
                                    </p>
                                    <p className="text-lg text-gray-500">
                                        Tamaño:{" "}
                                        <span className="font-medium text-gray-700">
                                            {room.size ?? "-"} m²
                                        </span>
                                    </p>
                                    <p className="text-lg text-gray-500">
                                        Precio por hora:{" "}
                                        <span className="font-medium text-gray-700">
                                            ${room.pricePerHour ?? "-"}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {room.description || "Sin descripción"}
                                    </p>

                                    {/* Instrumentos */}
                                    <div className="mt-3">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            Instrumentos
                                        </h3>
                                        {instrumentsMap[room.id] &&
                                        instrumentsMap[room.id].length > 0 ? (
                                            <ul className="space-y-1">
                                                {instrumentsMap[room.id].map((inst) => (
                                                    <li
                                                        key={inst.id}
                                                        className="flex justify-between text-sm border-b py-1"
                                                    >
                                                        <span className=" text-gray-700 font-medium">{inst.name}</span>
                                                        <span className="text-gray-700">${inst.price}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No hay instrumentos asignados.
                                            </p>
                                        )}
                                        <button
                                            onClick={() => setInstrumentRoomId(room.id)}
                                            className="mt-2 px-3 py-1 rounded-lg text-sm bg-sky-600 text-white hover:bg-sky-700 cursor-pointer"
                                        >
                                            ＋ Agregar instrumento
                                        </button>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex items-center justify-end gap-3 mt-4">
                                        <button
                                            onClick={() => setSelectedRoom(room)}
                                            className="text-sky-600 hover:text-sky-800 text-xl cursor-pointer"
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="text-red-600 hover:text-red-800 text-xl cursor-pointer"
                                            title="Eliminar"
                                        >
                                            <FaTrashArrowUp />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modales */}
            {selectedRoom && (
                <EditRoomModal
                    room={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                    onUpdated={handleRoomUpdated}
                />
            )}
            {instrumentRoomId && (
                <AddInstrumentModal
                    roomId={instrumentRoomId}
                    onClose={() => setInstrumentRoomId(null)}
                    onAdded={(inst) => handleInstrumentAdded(instrumentRoomId!, inst)}
                />
            )}
        </section>
    );
};

export default RoomsGrid;

