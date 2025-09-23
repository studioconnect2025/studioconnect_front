"use client";
import { useEffect, useRef, useState } from "react";
import ModalShell from "@/components/common/ModalShell";
import { FaClock, FaImages, FaPlus, FaTags, FaTimes } from "react-icons/fa";

// --- TIPOS DE DATOS ---
type StudioInit = {
  name?: string;
  city?: string;
  province?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  services?: string[];
  photos?: string[];
  openingTime?: string;
  closingTime?: string;
};

type NewFile = { file: File; preview: string };

// --- COMPONENTE PRINCIPAL ---
export default function EditStudioModal({
  open,
  onClose,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  initial: StudioInit;
  onSaved: (updated: any) => void;
}) {
  // Estado para los datos del formulario (nombre, ciudad, etc.)
  const [data, setData] = useState<StudioInit>({});
  
  // Estado para los servicios (chips)
  const [chips, setChips] = useState<string[]>([]);
  const [chipInput, setChipInput] = useState("");

  // === LA CLAVE DE LA CORRECCIÓN: ESTADOS SEPARADOS PARA FOTOS ===
  // 1. Estado para los NUEVOS archivos que el usuario selecciona (File y su preview 'blob:')
  const [newFiles, setNewFiles] = useState<NewFile[]>([]);
  // 2. Estado para las URLs de las fotos que YA EXISTEN en el servidor ('https://...')
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  
  const dropRef = useRef<HTMLDivElement>(null);

  // --- EFECTO PARA REINICIAR EL ESTADO DEL MODAL ---
  // Se ejecuta cada vez que el modal se abre o los datos iniciales cambian
  useEffect(() => {
    if (open) {
      setData(initial || {});
      setChips(initial?.services ?? []);
      setNewFiles([]); // Limpia los archivos nuevos
      setExistingImageUrls(initial?.photos ?? []); // Carga las fotos existentes
      setChipInput("");
    }
  }, [open, initial]);

  // --- MANEJADORES DE ESTADO (SIN CAMBIOS GRANDES) ---
  const set = (k: keyof StudioInit) => (e: any) =>
    setData((s) => ({ ...s, [k]: e?.target?.value }));

  const addChip = () => {
    const v = chipInput.trim();
    if (!v || chips.includes(v)) return;
    setChips((c) => [...c, v]);
    setChipInput("");
  };

  const removeChip = (i: number) =>
    setChips((c) => c.filter((_, idx) => idx !== i));

  const onPickFiles = (list: FileList | null) => {
    if (!list || !list.length) return;
    const arr: NewFile[] = [];
    Array.from(list).forEach((f) => {
      if (f.type.startsWith("image/")) {
        // Creamos el objeto con el archivo y su URL de previsualización
        arr.push({ file: f, preview: URL.createObjectURL(f) });
      }
    });
    setNewFiles((prev) => [...prev, ...arr]);
  };

  // --- FUNCIONES SEPARADAS PARA ELIMINAR FOTOS ---
  // Función para eliminar un archivo NUEVO de la lista de previsualización
  const removeNewFile = (indexToRemove: number) => {
    setNewFiles((currentFiles) => {
      const fileToRemove = currentFiles[indexToRemove];
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview); // Importante: liberar memoria
      }
      return currentFiles.filter((_, index) => index !== indexToRemove);
    });
  };

  // Función para eliminar una foto EXISTENTE de la lista de URLs
  const removeExistingUrl = (indexToRemove: number) => {
    setExistingImageUrls((currentUrls) =>
      currentUrls.filter((_, index) => index !== indexToRemove)
    );
  };
  
  // Lógica para drag and drop
  useEffect(() => {
    const node = dropRef.current;
    if (!node) return;
    const over = (e: DragEvent) => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = "copy"; };
    const drop = (e: DragEvent) => { e.preventDefault(); onPickFiles(e.dataTransfer?.files || null); };
    node.addEventListener("dragover", over);
    node.addEventListener("drop", drop);
    return () => {
      node.removeEventListener("dragover", over);
      node.removeEventListener("drop", drop);
    };
  }, []);

  // === FUNCIÓN onSave: LA PARTE MÁS IMPORTANTE ===
  const onSave = () => {
    // Se construye un payload limpio y bien definido:
    // - 'photos' solo contiene las URLs de las fotos existentes que se conservaron.
    // - 'photoFiles' solo contiene los nuevos archivos (File objects) para subir.
    // Con esto, NUNCA se envía una URL 'blob:' al servicio.
    onSaved({
      ...data,
      services: chips,
      photos: existingImageUrls,
      photoFiles: newFiles.map((f) => f.file),
    });
    onClose();
  };

  const footer = (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button onClick={onClose} className="h-10 px-4 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
        Cancelar
      </button>
      <button onClick={onSave} className="h-10 px-5 rounded-lg bg-sky-700 text-white hover:bg-sky-800">
        Guardar cambios
      </button>
    </div>
  );

  return (
    <ModalShell open={open} onClose={onClose} title="Editar datos del estudio" footer={footer}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs text-slate-600 mb-1">Nombre</label>
          <input
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm"
            value={data.name || ""}
            onChange={set("name")}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 mb-1">Ciudad</label>
          <input
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm"
            value={data.city || ""}
            onChange={set("city")}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 mb-1">Provincia</label>
          <input
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm"
            value={data.province || ""}
            onChange={set("province")}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 mb-1">Dirección</label>
          <input
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm"
            value={data.address || ""}
            onChange={set("address")}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 mb-1">Teléfono</label>
          <input
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm"
            value={data.phone || ""}
            onChange={set("phone")}
            placeholder="+54 9..."
          />
        </div>
        <div>
          <label className="block text-xs text-slate-600 mb-1">Email</label>
          <input
            type="email"
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm"
            value={data.email || ""}
            onChange={set("email")}
            placeholder="info@studio.com"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-xs text-slate-600 mb-1">Descripción</label>
        <textarea
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={data.description || ""}
          onChange={set("description")}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-slate-600 mb-2 flex items-center gap-2">
            <FaTags className="text-sky-700" /> Servicios
          </label>
          <div className="flex flex-wrap gap-2 rounded-lg border border-slate-300 p-2">
            {chips.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
              >
                {c}
                <button
                  onClick={() => removeChip(i)}
                  className="h-4 w-4 grid place-items-center rounded-full hover:bg-slate-200"
                  aria-label="Quitar"
                >
                  <FaTimes className="text-[10px]" />
                </button>
              </span>
            ))}
            <input
              value={chipInput}
              onChange={(e) => setChipInput(e.target.value)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === ",") &&
                (e.preventDefault(), addChip())
              }
              placeholder="Escribí y Enter…"
              className="flex-1 min-w-[120px] outline-none text-sm px-2 py-1"
            />
            <button
              onClick={addChip}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
            >
              <FaPlus /> Agregar
            </button>
          </div>
        </div>

        <div>
          <label className=" text-xs text-slate-600 mb-2 flex items-center gap-2">
            <FaImages className="text-sky-700" /> Fotos
          </label>

          <div
            ref={dropRef}
            className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-4 text-sm text-slate-600 hover:bg-slate-50"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>Arrastrá imágenes aquí o elegí desde tu equipo</div>
              <label className="inline-flex items-center gap-2 rounded-md bg-sky-700 px-3 py-2 text-white text-xs hover:bg-sky-800 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => onPickFiles(e.target.files)}
                />
                <FaPlus /> Elegir archivos
              </label>
            </div>

            {(newFiles.length > 0 || existingImageUrls.length > 0) && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {/* Renderizar fotos existentes */}
                {existingImageUrls.map((url, index) => (
                  <div key={`existing-${index}`} className="relative rounded-lg overflow-hidden border border-slate-200 bg-white">
                    <img src={url} alt="Foto existente" className="h-24 w-full object-cover" />
                    <button onClick={() => removeExistingUrl(index)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white grid place-items-center" aria-label="Quitar"><FaTimes size={10} /></button>
                  </div>
                ))}
                {/* Renderizar previsualizaciones de fotos nuevas */}
                {newFiles.map((fileObj, index) => (
                  <div key={`new-${index}`} className="relative rounded-lg overflow-hidden border border-slate-200 bg-white">
                    <img src={fileObj.preview} alt="Vista previa" className="h-24 w-full object-cover" />
                    <button onClick={() => removeNewFile(index)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white grid place-items-center" aria-label="Quitar"><FaTimes size={10} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-slate-600 mb-1 flex items-center gap-2">
            <FaClock className="text-sky-700" /> Horario de apertura
          </label>
          <input
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm"
            value={data.openingTime || ""}
            onChange={set("openingTime")}
            placeholder="09:00"
          />
        </div>
        <div>
          <label className="text-xs text-slate-600 mb-1 flex items-center gap-2">
            <FaClock className="text-sky-700" /> Horario de cierre
          </label>
          <input
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm"
            value={data.closingTime || ""}
            onChange={set("closingTime")}
            placeholder="18:00"
          />
        </div>
      </div>
    </ModalShell>
  );
}