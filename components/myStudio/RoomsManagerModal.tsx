"use client";
import { useEffect, useMemo, useState } from "react";

export type RoomDraft = {
  id: string;
  name: string;
  capacity?: number;
  price?: number;
  photo?: string; // URL opcional
};

type RoomsManagerModalProps = {
  open: boolean;
  onClose: () => void;
  initial?: RoomDraft[];         // estado inicial desde el padre
  onChange?: (rooms: RoomDraft[]) => void; // devuelve el array final
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function RoomsManagerModal({
  open,
  onClose,
  initial = [],
  onChange,
}: RoomsManagerModalProps) {
  const [rooms, setRooms] = useState<RoomDraft[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => rooms.find(r => r.id === selectedId) ?? null, [rooms, selectedId]);

  useEffect(() => {
    setRooms(initial);
  }, [initial]);

  const addRoom = () => {
    const r: RoomDraft = { id: uid(), name: "Nueva sala" };
    setRooms((prev) => [r, ...prev]);
    setSelectedId(r.id);
  };

  const updateSelected = (patch: Partial<RoomDraft>) => {
    if (!selected) return;
    setRooms((prev) => prev.map(r => r.id === selected.id ? { ...r, ...patch } : r));
  };

  const removeSelected = () => {
    if (!selected) return;
    const next = rooms.filter(r => r.id !== selected.id);
    setRooms(next);
    setSelectedId(null);
  };

  const handleSave = () => {
    onChange?.(rooms);
    onClose();
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

            <ul className="space-y-2">
              {rooms.map((r) => (
                <li key={r.id}>
                  <button
                    className={`w-full rounded-lg border border-white/10 px-3 py-2 text-left hover:bg-white/10 ${selectedId === r.id ? "bg-white/10" : ""}`}
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
              <div className="flex h-full items-center justify-center rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
                Seleccioná una sala para editar.
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <label className="mb-1 block text-sm text-white/80">Nombre</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/0 p-2 outline-none"
                    value={selected.name}
                    onChange={(e) => updateSelected({ name: e.target.value })}
                    placeholder="Sala Principal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm text-white/80">Capacidad (personas)</label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-white/10 bg-white/0 p-2 outline-none"
                      value={selected.capacity ?? ""}
                      onChange={(e) => updateSelected({ capacity: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="10"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white/80">Precio (por hora)</label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-white/10 bg-white/0 p-2 outline-none"
                      value={selected.price ?? ""}
                      onChange={(e) => updateSelected({ price: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="15000"
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-white/80">Foto (URL)</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/0 p-2 outline-none"
                    value={selected.photo ?? ""}
                    onChange={(e) => updateSelected({ photo: e.target.value || undefined })}
                    placeholder="https://…"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={removeSelected}
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                  >
                    Eliminar sala
                  </button>
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-[#C93C3C]/90 px-4 py-2 text-sm hover:bg-[#C93C3C]"
                  >
                    Guardar cambios
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
