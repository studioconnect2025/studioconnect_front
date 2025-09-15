"use client";

import { FC, useEffect, useState } from "react";
import { FaCircle, FaEdit } from "react-icons/fa";
import { FaTrashArrowUp } from "react-icons/fa6";
import Link from "next/link";
import { roomsService } from "../../services/rooms.service";
import type {
    Room as RoomType,
    Instrument as InstrumentType,
} from "../../types/Rooms";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [loading, setLoading] = useState(false);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);

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
        }
    }, [room]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            await roomsService.deleteRoomImage({
                roomId: room.id,
                imageIndex: index,
            });
            setImagesPreview((prev) => prev.filter((_, i) => i !== index));
            toast.success("Imagen eliminada");
        } catch (error) {
            console.error("Error eliminando imagen:", error);
            toast.error("No se pudo eliminar la imagen");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!room) return;
        setLoading(true);
        try {
            const roomData = {
                ...formData,
                capacity: Number(formData.capacity) || 0,
                size: Number(formData.size) || 0,
                pricePerHour: Number(formData.pricePerHour) || 0,
            };

            const updatedRoom = await roomsService.updateRoom({
                roomId: room.id,
                roomData,
            });

            if (images) {
                const form = new FormData();
                Array.from(images).forEach((file) => form.append("images", file));
                await roomsService.uploadRoomImages({
                    roomId: room.id,
                    imagesFormData: form,
                });
            }

            onUpdated(updatedRoom);
            onClose();
            toast.success("Sala actualizada correctamente");
        } catch (error) {
            console.error("Error editando sala:", error);
            toast.error("No se pudo editar la sala. Revisa los datos ingresados.");
        } finally {
            setLoading(false);
        }
    };

    if (!room) return null;

    return (
        <div className="fixed inset-0 text-gray-700 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg overflow-y-auto max-h-[90vh]">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Editar Sala</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="mb-1 font-medium">Nombre</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className="border rounded-lg p-2 text-gray-700" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="capacity" className="mb-1 font-medium">Capacidad</label>
                        <input id="capacity" type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="border rounded-lg p-2 text-gray-700" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="size" className="mb-1 font-medium">Tamaño (m²)</label>
                        <input id="size" type="number" name="size" value={formData.size} onChange={handleChange} className="border rounded-lg p-2 text-gray-700" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="pricePerHour" className="mb-1 font-medium">Precio por hora</label>
                        <input id="pricePerHour" type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} className="border rounded-lg p-2 text-gray-700" />
                    </div>
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="description" className="mb-1 font-medium">Descripción</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="border rounded-lg p-2 text-gray-700" />
                    </div>
                    {imagesPreview.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 col-span-2">
                            {imagesPreview.map((img, index) => (
                                <div key={index} className="relative">
                                    <img src={img} alt="preview" className="w-full h-24 object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1 text-xs cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="col-span-2 cursor-pointer">
                        <input type="file" multiple onChange={(e) => setImages(e.target.files)} />
                    </div>
                    <div className="flex gap-2 justify-end mt-4 col-span-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 cursor-pointer">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 cursor-pointer rounded-lg bg-sky-600 text-white hover:bg-sky-700">
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const instrumentPayload = {
                ...formData,
                price: Number(formData.price),
            };

            // Mantengo tu flujo existente: POST vía roomsService y recibo el instrumento creado
            const newInstrument = await roomsService.addInstrument({
                roomId,
                instrumentData: instrumentPayload,
            });

            onAdded(newInstrument ?? { ...instrumentPayload, id: `temp-${Date.now()}` });
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
        <div className="fixed inset-0 text-gray-700 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Agregar Instrumento</h2>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} className="border rounded-lg p-2 text-gray-700" required />
                    <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} className="border rounded-lg p-2 text-gray-700" required />
                    <input type="number" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} className="border rounded-lg p-2 text-gray-700" required />
                    <input type="text" name="categoryName" placeholder="Categoría" value={formData.categoryName} onChange={handleChange} className="border rounded-lg p-2 text-gray-700" />
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                        Disponible
                    </label>
                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">
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

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await roomsService.getRooms();
                setRooms(data);
            } catch (err: any) {
                setError(err.message || "Error desconocido al obtener salas");
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const handleDelete = async (roomId: string) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!result.isConfirmed) return;

        try {
            await roomsService.deleteRoom({ roomId });
            setRooms((prev) => prev.filter((room) => room.id !== roomId));
            toast.success("Sala eliminada correctamente");
        } catch (error) {
            console.error("Error eliminando sala:", error);
            toast.error("No se pudo eliminar la sala");
        }
    };

    const handleInstrumentAdded = (roomId: string, instrument: InstrumentType) => {
        const instrumentWithKey = {
            ...instrument,
            id: instrument.id || `temp-${Date.now()}-${Math.random()}`,
        };

        setRooms((prev) =>
            prev.map((r) =>
                r.id === roomId
                    ? { ...r, instruments: [...(r.instruments || []), instrumentWithKey] }
                    : r
            )
        );
    };

    if (loading)
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-white">
                <p className="text-center mt-10 text-gray-700">Cargando salas...</p>
            </div>
        );

    if (error)
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-white">
                <p className="text-center mt-10 text-red-500">{error}</p>
            </div>
        );

    return (
        <section className="min-h-[70vh] bg-white flex flex-col items-center w-full">
            <ToastContainer />
            {/* Header */}
            <div className="bg-sky-800 flex flex-col md:flex-row md:items-center justify-between text-white py-6 px-4 md:px-8 shadow-md mb-6 w-full">
                <div className="mb-4 md:mb-0 max-w-xl">
                    <h1 className="text-xl md:text-2xl font-semibold">Gestión de Salas del Estudio</h1>
                    <p className="text-sm text-sky-100 mt-1">
                        Administra las salas de tu estudio, agrega nuevos instrumentos y edita los detalles de las salas existentes.
                    </p>
                </div>
                <div className="flex justify-start md:justify-end">
                    <Link
                        href="/createRoom"
                        className="inline-flex items-center gap-2 bg-black px-3 cursor-pointer py-2 rounded-lg shadow hover:bg-gray-900 transition text-sm text-white"
                    >
                        <span className="text-lg">＋</span> Agregar nueva sala
                    </Link>
                </div>
            </div>

            {/* Grid de Salas */}
            <div className="w-full items-center max-w-[120vh] mb-10 py-4">
                {rooms.length === 0 ? (
                    <div className="min-h-[30vh] flex items-center justify-center">
                        <p className="text-gray-700 text-lg text-center">Todavía no has creado salas para tu estudio.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {rooms.map((room) => (
                            <div key={room.id} className="rounded-xl border shadow-sm hover:shadow-xl transition flex flex-col">
                                <div className="h-48 rounded-t-xl overflow-hidden bg-gray-200">
                                    {room.imageUrls?.[0] ? (
                                        <img src={room.imageUrls[0]} alt={room.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-gray-600 text-sm font-medium text-center px-2">Sin imagen</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 p-4 flex flex-col gap-2">
                                    <h2 className="text-2xl  text-gray-900">{room.name}</h2>
                                    <p className="text-lg text-gray-500">
                                        Capacidad:{" "}
                                        <span className="font-medium text-gray-700">{room.capacity ?? "-"} personas</span>
                                    </p>
                                    <p className="text-lg text-gray-500">
                                        Tamaño: <span className="font-medium text-gray-700">{room.size ?? "-"} m²</span>
                                    </p>
                                    <p className="text-lg text-gray-500">
                                        Tarifa:{" "}
                                        <span className="font-medium text-gray-700">
                                            {room.pricePerHour ? `$${Number(room.pricePerHour).toLocaleString()}/hora` : "-"}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        Instrumentos: {room.instruments?.length ?? 0}
                                    </p>

                                    {room.instruments && room.instruments.length > 0 && (
                                        <div>
                                            <p className="text-xl mb-3 font-medium text-gray-700">Instrumentos</p>
                                            <ul className="flex space-x-3">
                                                {room.instruments.map((inst) => (
                                                    <li key={inst.id} className="flex items-center gap-2 text-gray-700">
                                                        <FaCircle size={13} className="text-sky-700" /> {inst.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 border-t flex justify-between gap-2">
                                    <button
                                        onClick={() => setSelectedRoom(room)}
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm rounded-md border bg-sky-50 text-sky-700 hover:bg-sky-100"
                                    >
                                        <FaEdit size={14} /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(room.id)}
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm rounded-md border bg-red-50 text-red-600 hover:bg-red-100"
                                    >
                                        <FaTrashArrowUp size={14} /> Eliminar
                                    </button>
                                    <button
                                        onClick={() => setInstrumentRoomId(room.id)}
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm rounded-md border bg-green-50 text-green-700 hover:bg-green-100"
                                    >
                                        ＋ Instrumento
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedRoom && (
                <EditRoomModal
                    room={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                    onUpdated={(updated) =>
                        setRooms((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)))
                    }
                />
            )}

            {instrumentRoomId && (
                <AddInstrumentModal
                    roomId={instrumentRoomId}
                    onClose={() => setInstrumentRoomId(null)}
                    onAdded={(instrument) => handleInstrumentAdded(instrumentRoomId, instrument)}
                />
            )}
        </section>
    );
};

export default RoomsGrid;
