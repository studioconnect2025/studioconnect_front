import { http } from "@/lib/http";

export type Studio = {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  lat?: number | null;
  lng?: number | null;
  country?: string;
  rating?: number;
  reviewsCount?: number;
  services?: string[];
  status?: string;
  // Añade los campos que faltaban para que coincida con el front
  phone?: string;
  email?: string;
  openingTime?: string;
  closingTime?: string;
  photos?: string[];
};

export type Room = {
  id: string;
  name: string;
  type?: string;
  sizeM2?: number;
  minDuration?: string;
  hourlyRate?: number;
  tags?: string[];
  available?: boolean;
  photo?: string;
};

type MyStudioRaw = { studio: Studio } | Studio;

// Este tipo representa los datos que vienen del formulario del modal
export type UpdateStudioPayload = {
  name?: string;
  city?: string;
  province?: string;
  address?: string;
  phone?: string; // El formulario usa 'phone'
  email?: string;
  description?: string;
  services?: string[];
  photos?: string[]; // URLs de fotos existentes
  photoFiles?: File[]; // Nuevos archivos de fotos
  openingTime?: string;
  closingTime?: string;
};

export async function getMyStudio(): Promise<{ studio: Studio }> {
  const { data } = await http.get<MyStudioRaw>("/owners/me/studio");
  const studio: Studio = (data as any)?.studio ?? (data as Studio);

  if (!studio?.id) {
    throw new Error("Respuesta inesperada: no llegó el studio con id");
  }
  return { studio };
}

export async function updateMyStudio(studioId: string, payload: UpdateStudioPayload) {
  const formData = new FormData();

  // 1. Agrega todos los campos de texto del payload al FormData
  Object.keys(payload).forEach(key => {
    // Ignoramos los arrays de fotos/archivos y servicios, que se manejan por separado
    if (key !== 'photos' && key !== 'photoFiles' && key !== 'services') {
      const value = (payload as any)[key];
      // Solo añadimos el campo si tiene un valor para no enviar 'undefined' o 'null'
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }
  });

  // 2. Agrega el array de servicios
  if (payload.services && Array.isArray(payload.services)) {
    payload.services.forEach((s: string) => formData.append('services', s));
  }

  // 3. Agrega las URLs de las fotos existentes que se conservaron
  if (payload.photos && Array.isArray(payload.photos)) {
    payload.photos.forEach((url: string) => formData.append('photos[]', url));
  }
  
  // 4. Agrega los archivos (File objects) de las fotos nuevas.
  if (payload.photoFiles && Array.isArray(payload.photoFiles)) {
    payload.photoFiles.forEach((file: File) => {
      // La clave 'photos' es para los archivos que procesará el FileFieldsInterceptor del backend
      formData.append('photos', file);
    });
  }

  // --- 🕵️‍♂️ CÓDIGO PARA ESPIAR LOS DATOS ---
  console.log("======= Contenido del FormData ANTES de enviar =======");
  for (let [key, value] of formData.entries()) {
    // Si 'value' es un archivo, la consola mostrará sus detalles. Si es texto, mostrará el string.
    console.log(`Clave: "${key}", Valor:`, value);
  }
  console.log("======================================================");
  // --- FIN DEL CÓDIGO PARA ESPIAR ---

  // 5. Envía la petición PATCH con el FormData correctamente construido
  const { data } = await http.patch(`/studios/me/${studioId}`, formData);
  return data;
}

export async function deleteStudioPhoto(studioId: string, photoIndex: number) {
  // Construimos la URL como la espera el backend: /studios/me/:studioId/photos/:photoIndex
  const url = `/studios/me/${studioId}/photos/${photoIndex}`;

  // Usamos el método http.delete
  const { data } = await http.delete(url);
  return data;
}


export async function getMyRooms(): Promise<Room[]> {
  const { data } = await http.get("/owners/me/studio/rooms");
  if (Array.isArray(data)) return data as Room[];
  if (Array.isArray((data as any)?.rooms)) return (data as any).rooms as Room[];
  return [];
}