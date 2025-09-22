"use client";

import { FC, useEffect, useState, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrashArrowUp } from "react-icons/fa6";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { roomsService } from "@/services/rooms.service";
import { instrumentsService } from "@/services/instruments.service";
import type { Room as RoomType, Instrument as InstrumentType } from "@/types/Rooms";

/* ==================== helpers ==================== */
const money = (n: any) => `USD $${Number(n ?? 0).toFixed(2)}`;

/* ==================== Modal Edición Sala ==================== */
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
            setImagesPreview((prev) => prev.filter((_, i) => i !== index));
            toast.success("Imagen eliminada");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar la imagen");
        }
    };

    useEffect(() => {
        if (!room) return;
        setFormData({
            name: room.name,
            capacity: room.capacity ?? 0,
            size: room.size ?? 0,
            pricePerHour: room.pricePerHour ?? "",
            description: room.description ?? "",
        });
        setImagesPreview(room.imageUrls || []);
        setInstruments(room.instruments || []);
    }, [room]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

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
            setInstruments((prev) => prev.filter((i) => i.id !== id));
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
                pricePerHour: String(formData.pricePerHour),
            };
            const updatedRoom = await roomsService.updateRoom({ roomId: room.id, roomData });

            if (images) {
                const form = new FormData();
                Array.from(images).forEach((file) => form.append("images", file));
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-gray-700">Editar Sala</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {/* Inputs con labels claros */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-gray-700"
                            placeholder="Ej: Sala 1"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Capacidad</label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-gray-700"
                            placeholder="Ej: 5"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Tamaño (m²)</label>
                        <input
                            type="number"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-gray-700"
                            placeholder="Ej: 20"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Precio por hora (USD)</label>
                        <input
                            inputMode="decimal"
                            name="pricePerHour"
                            value={formData.pricePerHour}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-gray-700"
                            placeholder="Ej: 25.00"
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="min-h-[90px] rounded-lg border border-gray-300 p-2 text-gray-700"
                            placeholder="Detalles, equipamiento, etc."
                        />
                    </div>

                    {/* Instrumentos en el modal */}
                    <div className="col-span-2 mt-2">
                        <h3 className="mb-2 text-sm font-semibold text-gray-700">Instrumentos</h3>
                        {instruments.length > 0 ? (
                            <ul className="space-y-1">
                                {instruments.map((inst) => (
                                    <li key={inst.id} className="flex items-center justify-between border-b py-1">
                                        <span className="text-gray-700">{inst.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-700">{money(inst.price)}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteInstrument(inst.id)}
                                                className="text-sm text-red-600 hover:text-red-800"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-600">No hay instrumentos asignados.</p>
                        )}
                    </div>

                    {/* Imágenes */}
                    {imagesPreview.length > 0 && (
                        <div className="col-span-2 grid grid-cols-3 gap-2">
                            {imagesPreview.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img src={img} className="h-24 w-full rounded object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(idx)}
                                        className="absolute right-1 top-1 rounded-full bg-red-600 px-1 text-xs text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="col-span-2 text-gray-700">
                        <input type="file" multiple onChange={(e) => setImages(e.target.files)} />
                    </div>

                    {/* Botones */}
                    <div className="col-span-2 mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ==================== Modal Agregar Instrumento ==================== */
interface AddInstrumentModalProps {
    roomId: string;
    onClose: () => void;
    onAdded: (instrument: InstrumentType) => void;
}

const AddInstrumentModal: FC<AddInstrumentModalProps> = ({ roomId, onClose, onAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        available: true,
        categoryName: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken") ?? "";
            const created = await instrumentsService.addInstrument({
                roomId,
                instrumentData: {
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    price: Number(formData.price) || 0,
                    available: formData.available,
                    categoryName: formData.categoryName.trim(),
                },
                token,
            });

            // normalizo por si viene envuelto (created.instrument)
            const raw = (created as any)?.instrument ?? created;
            const normalized: InstrumentType = {
                id: raw.id ?? crypto.randomUUID(),
                name: raw.name,
                description: raw.description,
                price: Number(raw.price ?? 0),
                available: !!raw.available,
                categoryName: raw.categoryName,
                roomId: roomId,
                room: raw.room,
            };

            onAdded(normalized); // update optimista en la card
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 text-gray-700 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">Agregar Instrumento</h2>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Nombre</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2"
                            placeholder="Ej: Guitarra eléctrica"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="min-h-[80px] rounded-lg border border-gray-300 p-2"
                            placeholder="Marca / modelo / estado"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Precio (USD)</label>
                        <input
                            inputMode="decimal"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2"
                            placeholder="Ej: 10.00"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Categoría</label>
                        <input
                            name="categoryName"
                            value={formData.categoryName}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2"
                            placeholder="Cuerdas, Teclados…"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="available"
                            checked={formData.available}
                            onChange={handleChange}
                        />
                        Disponible
                    </label>

                    <div className="mt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
                        >
                            {loading ? "Agregando..." : "Agregar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ==================== RoomsGrid ==================== */
const RoomsGrid: FC = () => {
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
    const [instrumentRoomId, setInstrumentRoomId] = useState<string | null>(null);

    // roomId => instrumentos
    const [instrumentsMap, setInstrumentsMap] = useState<Record<string, InstrumentType[]>>({});

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        try {
            const roomsData = await roomsService.getRooms();
            const instrumentsData = await instrumentsService.getInstruments();

            const map: Record<string, InstrumentType[]> = {};
            roomsData.forEach((room: RoomType) => {
                map[room.id] = instrumentsData
                    .filter((inst: InstrumentType) => inst.room?.id === room.id)
                    .map((x: any) => ({
                        ...x,
                        price: Number(x.price ?? 0),
                    }));
            });

            setRooms(roomsData);
            setInstrumentsMap(map);
        } catch (err: any) {
            console.error(err);
            setError(err?.message || "Error al obtener salas");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

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
            setRooms((prev) => prev.filter((r) => r.id !== roomId));
            setInstrumentsMap((prev) => {
                const copy = { ...prev };
                delete copy[roomId];
                return copy;
            });
            toast.success("Sala eliminada correctamente");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar la sala");
        }
    };

    // Agrega instrumento y lo ves sin recargar: optimista + refetch
    const handleInstrumentAdded = async (roomId: string, instrument: InstrumentType) => {
        // update optimista
        setInstrumentsMap((prev) => ({
            ...prev,
            [roomId]: [...(prev[roomId] || []), { ...instrument, price: Number(instrument.price ?? 0) }],
        }));
        // sync con backend
        await fetchRooms();
    };

    const handleRoomUpdated = (updatedRoom: RoomType) => {
        setRooms((prev) => prev.map((r) => (r.id === updatedRoom.id ? { ...r, ...updatedRoom } : r)));
    };

    if (loading)
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-white">
                <p className="text-gray-700">Cargando salas...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-white">
                <p className="text-red-500">{error}</p>
            </div>
        );

    return (
        <section className="flex min-h-[70vh] w-full flex-col items-center bg-white">
            <ToastContainer />
            {/* Header */}
            <div className="mb-6 w-full bg-sky-800 px-4 py-6 text-white shadow-md md:flex md:items-center md:justify-between md:px-8">
                <div className="mb-4 max-w-xl md:mb-0">
                    <h1 className="text-xl font-semibold md:text-2xl">Gestión de Salas del Estudio</h1>
                    <p className="mt-1 text-sm text-sky-100">
                        Administra tus salas, agregá instrumentos y editá sus detalles.
                    </p>
                </div>
                <div className="flex justify-start md:justify-end">
                    <Link
                        href="/createRoom"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm text-white shadow hover:bg-gray-900"
                    >
                        <span className="text-lg">＋</span> Agregar nueva sala
                    </Link>
                </div>
            </div>

            {/* Grid de salas */}
            <div className="mb-10 w-full max-w-[120vh] items-center py-4">
                {rooms.length === 0 ? (
                    <div className="flex min-h-[30vh] items-center justify-center">
                        <p className="text-center text-lg text-gray-700">Todavía no has creado salas.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {rooms.map((room) => (
                            <div key={room.id} className="flex flex-col rounded-xl border shadow-sm transition hover:shadow-xl">
                                {/* Imagen */}
                                <div className="h-48 overflow-hidden rounded-t-xl bg-gray-200">
                                    {room.imageUrls?.[0] ? (
                                        <img src={room.imageUrls[0]} alt={room.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <span className="px-2 text-center text-sm font-medium text-gray-600">Sin imagen</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-1 flex-col gap-2 p-4">
                                    <h2 className="text-2xl text-gray-900">{room.name}</h2>
                                    <p className="text-lg text-gray-500">
                                        Capacidad: <span className="font-medium text-gray-700">{room.capacity ?? "-"} personas</span>
                                    </p>
                                    <p className="text-lg text-gray-500">
                                        Tamaño: <span className="font-medium text-gray-700">{room.size ?? "-"} m²</span>
                                    </p>
                                    <p className="text-lg text-gray-500">
                                        Precio por hora: <span className="font-medium text-gray-700">{money(room.pricePerHour)}</span>
                                    </p>
                                    <p className="text-sm text-gray-600">{room.description || "Sin descripción"}</p>

                                    {/* Instrumentos */}
                                    <div className="mt-3">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800">Instrumentos</h3>
                                        {instrumentsMap[room.id] && instrumentsMap[room.id].length > 0 ? (
                                            <ul className="space-y-1">
                                                {instrumentsMap[room.id].map((inst) => (
                                                    <li key={inst.id} className="flex justify-between border-b py-1 text-sm">
                                                        <span className="font-medium text-gray-700">{inst.name}</span>
                                                        <span className="text-gray-700">{money(inst.price)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">No hay instrumentos asignados.</p>
                                        )}
                                        <button
                                            onClick={() => setInstrumentRoomId(room.id)}
                                            className="mt-2 cursor-pointer rounded-lg bg-sky-600 px-3 py-1 text-sm text-white hover:bg-sky-700"
                                        >
                                            ＋ Agregar instrumento
                                        </button>
                                    </div>

                                    {/* Acciones */}
                                    <div className="mt-4 flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => setSelectedRoom(room)}
                                            className="cursor-pointer text-xl text-sky-600 hover:text-sky-800"
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="cursor-pointer text-xl text-red-600 hover:text-red-800"
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
                <EditRoomModal room={selectedRoom} onClose={() => setSelectedRoom(null)} onUpdated={handleRoomUpdated} />
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
