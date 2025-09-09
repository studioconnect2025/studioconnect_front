// services/myStudio.services.ts
import { http } from "@/lib/Http";

export type Studio = {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  rating?: number;
  reviewsCount?: number;
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

type MyStudioRaw =
  | { studio: Studio }
  | Studio; // algunos backends devuelven el objeto directo

export async function getMyStudio(): Promise<{ studio: Studio }> {
  // 1) Traigo el estudio del owner (sin /api)
  const { data } = await http.get<MyStudioRaw>("/owners/me/studio");

  // Soporto ambas formas de respuesta: { studio, rooms } o solo Studio
  const studio: Studio = (data as any)?.studio ?? (data as Studio);

  if (!studio?.id) {
    throw new Error("Respuesta inesperada: no llegó el studio con id");
  }
  return { studio};
}
