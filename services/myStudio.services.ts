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
  services?: string[]; // ← agregado: habilita services en el Studio
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
  | Studio;

export type UpdateStudioPayload = {
  name?: string;
  city?: string;
  province?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  description?: string;
  services?: string[];
  photos?: string[];
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

export async function updateMyStudio(payload: UpdateStudioPayload) {
  const { data } = await http.put("/owners/me/studio", payload);
  return data;
}

export async function getMyRooms(): Promise<Room[]> {
  const { data } = await http.get("/owners/me/studio/rooms");
  if (Array.isArray(data)) return data as Room[];
  if (Array.isArray((data as any)?.rooms)) return (data as any).rooms as Room[];
  return [];
}
