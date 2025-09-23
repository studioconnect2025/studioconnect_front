"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getMyStudio,
  updateMyStudio,
  deleteStudioPhoto, // 1. Importar la nueva función
  type Studio,
} from "@/services/myStudio.services";
import { roomsService } from "@/services/rooms.service";
import EditStudioModal from "@/components/myStudio/EditStudioModal";
import RoomsSection from "@/components/myStudio/RoomsSection";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa"; // 2. Importar el ícono para el botón
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function isImageLikeUrl(s: string) {
  if (typeof s !== "string") return false;
  if (s.startsWith("data:image/")) return true;
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i.test(s);
}

function collectImageUrlsDeep(input: any, acc: Set<string>) {
  if (!input) return;
  if (typeof input === "string") {
    if (isImageLikeUrl(input)) acc.add(input);
    return;
  }
  if (Array.isArray(input)) {
    for (const it of input) collectImageUrlsDeep(it, acc);
    return;
  }
  if (typeof input === "object") {
    for (const [k, v] of Object.entries(input)) {
      if (
        ["url", "secure_url", "image", "imageUrl", "src", "path", "photo", "photoUrl", "cover", "coverPhoto", "banner", "thumbnail", "thumb"].includes(k) &&
        typeof v === "string" &&
        isImageLikeUrl(v)
      ) {
        acc.add(v);
      }
      collectImageUrlsDeep(v, acc);
    }
  }
}

export default function MyStudioClient() {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { studio } = await getMyStudio();
        setStudio(studio);

        const embedded =
          (studio as any)?.rooms ??
          (studio as any)?.studioRooms ??
          (studio as any)?.ownerRooms ??
          (studio as any)?.data?.rooms ??
          [];

        if (Array.isArray(embedded) && embedded.length) {
          setRooms(embedded);
        } else {
          const fetched = await roomsService.getMyRooms();
          const normalized = Array.isArray((fetched as any)?.rooms)
            ? (fetched as any).rooms
            : Array.isArray(fetched)
            ? (fetched as any)
            : [];
          setRooms(normalized);
        }
      } catch (e: any) {
        setErr(e?.response?.data?.message ?? "Error al cargar el estudio");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const deepCollected = useMemo(() => {
    const s = new Set<string>();
    if (studio) collectImageUrlsDeep(studio, s);
    if (rooms?.length) for (const r of rooms) collectImageUrlsDeep(r, s);
    return Array.from(s).slice(0, 5);
  }, [studio, rooms]);

  const galleryPhotos: string[] = useMemo(() => {
    const explicit = (((studio as any)?.photos ?? []) as string[]).filter(Boolean);
    return explicit.length ? explicit : deepCollected;
  }, [studio, deepCollected]);

  const [photoIdx, setPhotoIdx] = useState(0);
  const total = Math.max(galleryPhotos.length, 1);
  const prevPhoto = () => setPhotoIdx((i) => (i - 1 + total) % total);
  const nextPhoto = () => setPhotoIdx((i) => (i + 1) % total);

  useEffect(() => {
    if (photoIdx >= galleryPhotos.length) setPhotoIdx(0);
  }, [galleryPhotos.length, photoIdx]);

  // 3. Función para manejar la eliminación de fotos
  const handleDeletePhoto = async (indexToDelete: number) => {
    if (!studio?.id) return;

    // Obtenemos la URL de la foto que se quiere eliminar
    const photoUrlToDelete = galleryPhotos[indexToDelete];

    // --- LÓGICA CORREGIDA ---
    // Si es una URL de vista previa (blob), solo actualizamos el estado local.
    if (photoUrlToDelete.startsWith('blob:')) {
      setStudio(prevStudio => {
        if (!prevStudio) return null;
        
        // Creamos una nueva copia del array de fotos
        const updatedPhotos = [...(prevStudio.photos || [])];
        
        // Buscamos y eliminamos la URL blob del array
        const photoIndexInState = updatedPhotos.findIndex(p => p === photoUrlToDelete);
        if (photoIndexInState > -1) {
          updatedPhotos.splice(photoIndexInState, 1);
        }

        return { ...prevStudio, photos: updatedPhotos };
      });
      alert("Vista previa eliminada.");
      return; // Detenemos la ejecución aquí, no hay nada más que hacer.
    }

    // Si es una foto real (http/https), procedemos con la llamada a la API.
    if (!confirm("¿Estás seguro de que quieres eliminar esta foto del servidor?")) {
      return;
    }

    try {
      await deleteStudioPhoto(studio.id, indexToDelete);

      setStudio(prevStudio => {
        if (!prevStudio) return null;
        const updatedPhotos = [...(prevStudio.photos || [])];
        updatedPhotos.splice(indexToDelete, 1);
        return { ...prevStudio, photos: updatedPhotos };
      });
      
      alert("Foto eliminada correctamente.");
      if (photoIdx >= galleryPhotos.length - 1) {
        setPhotoIdx(0);
      }

    } catch (error) {
      console.error("Error al eliminar la foto:", error);
      alert("No se pudo eliminar la foto. Inténtalo de nuevo.");
    }
  };

  if (loading) return <div className="bg-white rounded-lg border p-6">Cargando…</div>;
  if (err) return <div className="bg-red-50 text-red-700 rounded-lg border border-red-200 p-6">{err}</div>;
  if (!studio) return <div className="bg-white rounded-lg border p-6">No se encontró tu estudio.</div>;

  const location = [studio.city, studio.province].filter(Boolean).join(", ");
  const fullAddress = [studio.address, location].filter(Boolean).join(", ");

  return (
    <div className="bg-white text-slate-900">
      <div className="w-full bg-sky-800">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 md:py-4">
          <h1 className="text-center text-white text-xl md:text-2xl font-semibold">Mi Estudio</h1>
          <p className="mt-1 text-center text-white/80 text-xs md:text-sm">Gestiona la información y configuración de tu estudio</p>
        </div>
      </div>

      <div className="py-6 md:py-8 space-y-6 md:space-y-8">
        <section className="mx-auto max-w-4xl px-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="relative h-56 md:h-64">
              {galleryPhotos.length ? (
                <>
                  <img src={galleryPhotos[photoIdx]} alt="Foto del estudio" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-600/30" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-500" />
              )}

              <button
                onClick={prevPhoto}
                className="absolute right-20 top-4 grid place-items-center h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
                aria-label="Foto anterior"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-10 top-4 grid place-items-center h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
                aria-label="Foto siguiente"
              >
                <FiChevronRight />
              </button>

              <span className="absolute right-4 bottom-3 rounded-full bg-black/40 text-white text-xs px-2 py-1">
                {Math.min(photoIdx + 1, total)} / {total}
              </span>

              <div className="absolute left-6 bottom-5 text-white">
                <h4 className="text-lg md:text-xl font-semibold">{studio.name ?? "—"}</h4>
                <p className="mt-1 text-sm text-white/90 flex items-center gap-2">
                  <FaMapMarkerAlt className="opacity-80" />
                  <span>{fullAddress || "—"}</span>
                </p>
              </div>
            </div>

            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-slate-600">Galería de Fotos</span>
              </div>

              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {galleryPhotos.length
                  ? galleryPhotos.map((u, i) => (
                      <div key={u + i} className="relative flex-shrink-0">
                        <button
                          onClick={() => setPhotoIdx(i)}
                          className={`h-10 w-28 rounded-md border ${i === photoIdx ? "border-sky-500 ring-1 ring-sky-300" : "border-slate-200"} overflow-hidden`}
                          aria-label={`Foto ${i + 1}`}
                        >
                          <img src={u} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                        </button>
                        
                        {/* 4. Botón de eliminar */}
                        <button
                          onClick={() => handleDeletePhoto(i)}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white grid place-items-center hover:bg-red-700 transition-colors"
                          aria-label="Eliminar foto"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ))
                  : Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-10 w-28 rounded-md border border-slate-200 bg-slate-100 grid place-items-center text-[12px] text-slate-600">
                        {`Foto ${i + 1}`}
                      </div>
                    ))}
                {galleryPhotos.length < 5 && (
                  <button
                    onClick={() => setOpenEdit(true)}
                    aria-label="Agregar fotos"
                    title="Agregar fotos"
                    className="h-10 w-10 rounded-md border border-slate-200 bg-slate-100 grid place-items-center text-slate-600 hover:bg-slate-50"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-900 font-semibold">Información del Estudio</h3>
              <button onClick={() => setOpenEdit(true)} className="text-sky-700 hover:text-sky-900 text-sm font-medium">
                Editar
              </button>
            </div>

            {studio.description && (
              <div className="mb-4">
                <label className="block text-xs text-slate-500 mb-1">Descripción</label>
                <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                  {studio.description}
                </p>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Dirección</label>
                <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2 text-sm">{fullAddress || "—"}</div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Teléfono</label>
                <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2 text-sm">{(studio as any)?.phone || "—"}</div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Horario de Apertura</label>
                <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2 text-sm">{(studio as any)?.openingTime ?? "—"}</div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Horario de Cierre</label>
                <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2 text-sm">{(studio as any)?.closingTime ?? "—"}</div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Servicios</label>
                <div className="flex flex-wrap gap-2">
                  {(studio.services ?? []).length ? (
                    (studio.services as string[]).map((s, i) => (
                      <span key={i} className="rounded-md bg-slate-50 border border-slate-200 px-3 py-[6px] text-xs text-slate-700">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-slate-900 font-semibold">Salas disponibles</h3>
              <Link
                href="/studioRooms"
                className="inline-flex items-center justify-center h-8 px-4 rounded-md !bg-sky-700 hover:!bg-sky-800 !text-white text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300"
              >
                Administrar
              </Link>
            </div>
            <div className="p-4">
              <RoomsSection rooms={rooms} />
            </div>
          </div>
        </section>
      </div>

      <EditStudioModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        initial={{
          name: studio.name,
          city: studio.city,
          province: studio.province,
          address: studio.address,
          description: studio.description,
          services: studio.services ?? [],
          openingTime: (studio as any).openingTime,
          closingTime: (studio as any).closingTime,
          photos: (studio as any).photos ?? [],
          phone: (studio as any).phone,
          email: (studio as any).email,
        }}
        onSaved={async (updatedData) => {
           try {
            if (!studio?.id) {
              alert("No se pudo encontrar el ID del estudio para actualizar.");
              return;
            }
            const updatedStudioFromServer = await updateMyStudio(studio.id, updatedData);

            setStudio((prev) => ({
              ...prev,
              ...updatedStudioFromServer,
            }));
            
            setPhotoIdx(0);
            setOpenEdit(false);

          } catch (error) {
            console.error("Error al actualizar el estudio:", error);
            alert("Hubo un error al guardar los cambios. Inténtalo de nuevo.");
          }
        }}
      />
    </div>
  );
}