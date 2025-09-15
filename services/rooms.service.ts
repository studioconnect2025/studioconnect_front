// services/rooms.service.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE) {
  // fallar ruidoso en vez de mandar a localhost
  throw new Error("NEXT_PUBLIC_API_URL no definida");
}
const buildURL = (path: string) => new URL(path, API_BASE).toString();

export const roomsService = {
  createRoom: async ({ token, roomData }: { token: string; roomData: any }) => {
    try {
      const response = await fetch(buildURL("/rooms"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(roomData),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error("Error creando la sala:", error);
      throw error;
    }
  },

  uploadRoomImages: async ({
    token,
    roomId,
    imagesFormData,
  }: {
    token?: string;
    roomId: string;
    imagesFormData: FormData;
  }) => {
    try {
      const accessToken =
        token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);
      if (!accessToken) throw new Error("No hay token disponible");

      const response = await fetch(buildURL(`/rooms/${roomId}/images`), {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: imagesFormData,
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error("Error subiendo imágenes de la sala:", error);
      throw error;
    }
  },

  getRooms: async (token?: string) => {
    try {
      const accessToken =
        token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);
      if (!accessToken) throw new Error("No hay token disponible");

      const response = await fetch(buildURL("/owners/me/studio/rooms"), {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error("Error obteniendo salas:", error);
      throw error;
    }
  },

  deleteRoom: async ({ token, roomId }: { token?: string; roomId: string }) => {
    try {
      const accessToken =
        token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);
      if (!accessToken) throw new Error("No hay token disponible");

      const response = await fetch(buildURL(`/owners/me/studio/rooms/${roomId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error("Error eliminando la sala:", error);
      throw error;
    }
  },

  updateRoom: async ({
    token,
    roomId,
    roomData,
  }: {
    token?: string;
    roomId: string;
    roomData: any;
  }) => {
    try {
      const accessToken =
        token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);
      if (!accessToken) throw new Error("No hay token disponible");

      const response = await fetch(buildURL(`/owners/me/studio/rooms/${roomId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify(roomData),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error("Error actualizando la sala:", error);
      throw error;
    }
  },

  deleteRoomImage: async ({
    roomId,
    imageIndex,
    token,
  }: {
    roomId: string;
    imageIndex: number;
    token?: string;
  }) => {
    try {
      const accessToken =
        token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);
      if (!accessToken) throw new Error("No hay token disponible");

      const response = await fetch(buildURL(`/rooms/${roomId}/images/${imageIndex}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error("Error eliminando la imagen de la sala:", error);
      throw error;
    }
  },

  getMyRooms: async (token?: string) => {
    return await roomsService.getRooms(token);
  },

  getRoomsByStudioId: async ({
    studioId,
    token,
  }: {
    studioId: string;
    token?: string;
  }) => {
    try {
      const accessToken =
        token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);

      const url = buildURL(`/rooms?studioId=${encodeURIComponent(studioId)}`);
      const res = await fetch(url, {
        method: "GET",
        headers: { ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), Accept: "application/json" },
        cache: "no-store",
      });

      if (res.status === 404) return [];
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      return Array.isArray(data?.rooms) ? data.rooms : Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error obteniendo salas del estudio:", error);
      throw error;
    }
  },
} as const;

export const getStudioRooms = async (studioId: string, token?: string) =>
  roomsService.getRoomsByStudioId({ studioId, token });
