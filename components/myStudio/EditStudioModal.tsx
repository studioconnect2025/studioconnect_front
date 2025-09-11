"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // ← agregado
import { FiSettings } from "react-icons/fi";
import ChipsInput from "./ChipsInput";
import { updateMyStudio, type UpdateStudioPayload } from "@/services/myStudio.services";

type EditStudioModalProps = {
  open: boolean;
  onClose: () => void;
  initial?: (Partial<UpdateStudioPayload> & Record<string, any> & { name?: string });
  onSaved?: (updated: any) => void;
};

export default function EditStudioModal({
  open,
  onClose,
  initial,
  onSaved,
}: EditStudioModalProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // ← para evitar mismatch SSR
  const [form, setForm] = useState<UpdateStudioPayload>({
    name: "",
    city: "",
    province: "",
    address: "",
    phoneNumber: "",
    email: "",
    description: "",
    services: [],
    photos: [],
  });

  useEffect(() => setMounted(true), []); // ← portal listo en cliente

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name ?? "",
        city: initial.city ?? "",
        province: initial.province ?? "",
        address: initial.address ?? "",
        phoneNumber: initial.phoneNumber ?? "",
        email: initial.email ?? "",
        description: initial.description ?? "",
        services: initial.services ?? [],
        photos: initial.photos ?? [],
      });
    }
  }, [initial]);

  const handleChange = (key: keyof UpdateStudioPayload, val: any) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const toHHMM = (val: any, fallback: string) => {
    const s = String(val ?? "").trim();
    const m = s.match(/^(\d{1,2}):(\d{2})$/);
    if (m) {
      const hh = String(Math.min(23, parseInt(m[1], 10))).padStart(2, "0");
      const mm = String(Math.min(59, parseInt(m[2], 10))).padStart(2, "0");
      return `${hh}:${mm}`;
    }
    return fallback;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const allowed: (keyof UpdateStudioPayload)[] = [
        "name",
        "city",
        "province",
        "address",
        "description",
        "services",
        "photos",
        "phoneNumber",
        "email",
      ];

      const base = Object.fromEntries(
        Object.entries(form).filter(([k, v]) => {
          if (!allowed.includes(k as keyof UpdateStudioPayload)) return false;
          if (Array.isArray(v)) return v.length > 0;
          return v !== "" && v !== undefined && v !== null;
        })
      ) as UpdateStudioPayload;

      const openingTime = toHHMM((initial as any)?.openingTime, "09:00");
      const closingTime = toHHMM((initial as any)?.closingTime, "18:00");

      const payload: UpdateStudioPayload & { openingTime: string; closingTime: string } = {
        ...base,
        openingTime,
        closingTime,
      };

      const updated = await updateMyStudio(payload);
      onSaved?.(updated);
      onClose();
    } catch (e: any) {
      console.error(e?.response?.data ?? e);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !mounted) return null;

  const modal = (
    // Overlay sin blur para no desenfocar el fondo
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Panel azul translúcido, más ALTO, con scroll interno; evita cerrar al click interno */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl min-h-[80vh] md:min-h-[80vh]
                   overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl
                   bg-gradient-to-b from-[#0F3B57]/90 via-[#0B2746]/90 to-[#071E32]/90
                   backdrop-blur-xl text-white flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-[#03597E]/25 p-2 ring-1 ring-[#03597E]/30">
              <FiSettings className="h-5 w-5 text-[#7fd1ff]" />
            </span>
            <h2 className="text-base font-semibold tracking-tight">Editar datos del estudio</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md px-2 text-white/70 hover:bg-white/10"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body (crece y scrollea) */}
        <div className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-2 flex-1 overflow-y-auto">
          <div>
            <label className="mb-1 block text-sm text-white/80">Nombre</label>
            <input
              className="w-full rounded-lg border border-white/15 bg-white/5 p-2 text-white placeholder-white/40 outline-none
                         focus:ring-2 focus:ring-[#03597E]/50 focus:border-[#03597E]/40"
              value={form.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Mi Estudio"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Ciudad</label>
            <input
              className="w-full rounded-lg border border-white/15 bg-white/5 p-2 text-white placeholder-white/40 outline-none
                         focus:ring-2 focus:ring-[#03597E]/50 focus:border-[#03597E]/40"
              value={form.city ?? ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Bogotá"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Provincia</label>
            <input
              className="w-full rounded-lg border border-white/15 bg-white/5 p-2 text-white placeholder-white/40 outline-none
                         focus:ring-2 focus:ring-[#03597E]/50 focus:border-[#03597E]/40"
              value={form.province ?? ""}
              onChange={(e) => handleChange("province", e.target.value)}
              placeholder="Cundinamarca"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Dirección</label>
            <input
              className="w-full rounded-lg border border-white/15 bg-white/5 p-2 text-white placeholder-white/40 outline-none
                         focus:ring-2 focus:ring-[#03597E]/50 focus:border-[#03597E]/40"
              value={form.address ?? ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Calle Falsa 123"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Teléfono</label>
            <input
              className="w-full rounded-lg border border-white/15 bg-white/5 p-2 text-white placeholder-white/40 outline-none
                         focus:ring-2 focus:ring-[#03597E]/50 focus:border-[#03597E]/40"
              value={form.phoneNumber ?? ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="+54 9..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Email</label>
            <input
              className="w-full rounded-lg border border-white/15 bg-white/5 p-2 text-white placeholder-white/40 outline-none
                         focus:ring-2 focus:ring-[#03597E]/50 focus:border-[#03597E]/40"
              value={form.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="info@studio.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-white/80">Descripción</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-white/15 bg-white/5 p-2 text-white placeholder-white/40 outline-none
                         focus:ring-2 focus:ring-[#03597E]/50 focus:border-[#03597E]/40"
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Breve descripción del estudio…"
            />
          </div>

          <div className="md:col-span-2">
            <ChipsInput
              label="Servicios (chips)"
              value={form.services ?? []}
              onChange={(arr) => handleChange("services", arr)}
              placeholder="Ej.: Grabación, Mezcla, Ensayo…"
              variant="dark"
            />
          </div>

          <div className="md:col-span-2">
            <ChipsInput
              label="Fotos (URLs)"
              value={form.photos ?? []}
              onChange={(arr) => handleChange("photos", arr)}
              placeholder="Pegá URL y Enter…"
              variant="dark"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-white/10 bg-[#0B2746]/60 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-[#03597E] px-4 py-2 text-sm text-white hover:bg-[#024d6f]"
            disabled={loading}
          >
            {loading ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );

  // ← Render fuera del contenedor que recorta (evita el “corte”)
  return createPortal(modal, document.body);
}
