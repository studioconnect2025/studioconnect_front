"use client";
import { useEffect, useMemo, useState } from "react";

// TIPO DE DATOS PARA EL ESTADO LOCAL DEL MODAL
export type RoomDraft = {
  id: string;
  name: string;
  capacity?: number;
  price?: number; // En el frontend usamos 'price' por simplicidad.
  photo?: string;
};

// PROPS DEL COMPONENTE DEL MODAL
type RoomsManagerModalProps = {
  open: boolean;
  onClose: () => void;
  initial?: RoomDraft[];
  // Callback para notificar al padre que los datos cambiaron y debe recargar.
  onDataUpdated: () => void;
};

// --- FUNCIÓN HELPER PARA LA LLAMADA A LA API (PATCH) ---
async function updateRoomApi(roomId: string, roomData: Partial<RoomDraft>) {
  // 1. Mapeo de datos: Ajustamos el payload a lo que el backend espera (DTO).
  const payload = {
    name: roomData.name,
    capacity: roomData.capacity,
    pricePerHour: roomData.price, // Mapeo clave: 'price' -> 'pricePerHour'
    // Añade aquí otros campos si los editas en el modal.
  };

  try {
    const response = await fetch(`/api/rooms/${roomId}`, { // Asegúrate que esta URL sea correcta.
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // 2. Autenticación: ¡IMPORTANTE! Reemplaza esto con tu lógica de token.
        'Authorization': `Bearer ${localStorage.getItem('your_auth_token')}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error del servidor al actualizar la sala.');
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateRoomApi:", error);
    throw error; // Relanzamos el error para que el componente lo atrape.
  }
}


export default function RoomsManagerModal({
  open,
  onClose,
  initial = [],
  onDataUpdated, // Usamos la nueva prop.
}: RoomsManagerModalProps) {
  const [rooms, setRooms] = useState<RoomDraft[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para feedback de carga.
  const selected = useMemo(() => rooms.find(r => r.id === selectedId) ?? null, [rooms, selectedId]);

  useEffect(() => {
    setRooms(initial);
  }, [initial]);

  const addRoom = () => {
    // TODO: Implementar llamada POST a /api/rooms para crear una nueva sala.
    // Después de crearla en el backend, se debería llamar a onDataUpdated().
    alert("Funcionalidad de agregar sala no implementada.");
    // const newRoom: RoomDraft = { id: 'temp-id', name: "Nueva sala" };
    // setRooms((prev) => [newRoom, ...prev]);
    // setSelectedId(newRoom.id);
  };

  const updateSelected = (patch: Partial<RoomDraft>) => {
    if (!selected) return;
    setRooms((prev) => prev.map(r => r.id === selected.id ? { ...r, ...patch } : r));
  };

  const removeSelected = () => {
    if (!selected) return;
    // TODO: Implementar llamada DELETE a /api/rooms/:roomId para eliminar la sala.
    // Después de borrarla, se debería llamar a onDataUpdated().
    alert("Funcionalidad de eliminar sala no implementada.");
    // const next = rooms.filter(r => r.id !== selected.id);
    // setRooms(next);
    // setSelectedId(null);
  };

  // --- LÓGICA DE GUARDADO ACTUALIZADA ---
  const handleSave = async () => {
    if (!selected) {
      onClose();
      return;
    }

    setIsLoading(true); // Inicia el estado de carga

    try {
      // 3. Llamamos a la función que contacta al backend.
      await updateRoomApi(selected.id, selected);

      // 4. Si todo va bien, notificamos al padre y cerramos.
      onDataUpdated();
      onClose();

    } catch (error) {
      // 5. Si hay un error, lo mostramos al usuario. (¡CÓDIGO CORREGIDO!)
      let errorMessage = "Ocurrió un error desconocido.";
      if (error instanceof Error) {
        // Si 'error' es una instancia de Error, podemos acceder a 'message' de forma segura.
        errorMessage = error.message;
      }
      alert(`No se pudo guardar la sala: ${errorMessage}`);
    } finally {
      setIsLoading(false); // Finaliza el estado de carga
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-gradient-to-b from-[#0A2233] to-[#061521] p-5 text-white shadow-xl backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Administrar salas</h2>
          <button onClick={onClose} className="rounded px-2 text-white/80 hover:bg-white/10" aria-label="Cerrar">✕</button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Listado */}
          <div className="md:col-span-1">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-white/80">Salas ({rooms.length})</span>
              <button onClick={addRoom} className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/20">
                + Agregar
              </button>
            </div>

            <ul className="h-96 space-y-2 overflow-y-auto pr-2">
              {rooms.map((r) => (
                <li key={r.id}>
                  <button
                    className={`w-full rounded-lg border border-white/10 px-3 py-2 text-left transition-colors hover:bg-white/10 ${selectedId === r.id ? "bg-white/20 border-white/30" : "bg-white/5"}`}
                    onClick={() => setSelectedId(r.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{r.name || "Sin nombre"}</span>
                      {(r.capacity || r.price) && (
                        <span className="text-xs text-white/70">
                          {r.capacity ? `${r.capacity} pax` : ""} {r.price ? `• $${r.price}` : ""}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Editor */}
          <div className="md:col-span-2">
            {!selected ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-white/70">
                Selecciona una sala para editar.
              </div>
            ) : (
              <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <label className="mb-1 block text-sm text-white/80">Nombre</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-transparent p-2 outline-none focus:border-white/30 focus:ring-2 focus:ring-sky-500/20"
                    value={selected.name}
                    onChange={(e) => updateSelected({ name: e.target.value })}
                    placeholder="Sala Principal"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm text-white/80">Capacidad (personas)</label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-white/10 bg-transparent p-2 outline-none focus:border-white/30 focus:ring-2 focus:ring-sky-500/20"
                      value={selected.capacity ?? ""}
                      onChange={(e) => updateSelected({ capacity: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="10"
                      min={0}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white/80">Precio (por hora)</label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-white/10 bg-transparent p-2 outline-none focus:border-white/30 focus:ring-2 focus:ring-sky-500/20"
                      value={selected.price ?? ""}
                      onChange={(e) => updateSelected({ price: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="15000"
                      min={0}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-white/80">Foto (URL)</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-transparent p-2 outline-none focus:border-white/30 focus:ring-2 focus:ring-sky-500/20"
                    value={selected.photo ?? ""}
                    onChange={(e) => updateSelected({ photo: e.target.value || undefined })}
                    placeholder="https://…"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={removeSelected}
                    className="rounded-lg border border-red-500/50 bg-transparent px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Eliminar sala
                  </button>
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

