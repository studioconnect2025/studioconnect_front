import { http } from "@/lib/http";

export const roomsService = {
  createRoom: async ({ token, roomData }: { token: string; roomData: any }) => {
    try {
      const response = await http.post("/rooms", roomData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      return response.data;
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

      const response = await http.post(`/rooms/${roomId}/images`, imagesFormData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
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

      const response = await http.get("/owners/me/studio/rooms", {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      });
      return response.data;
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

      const response = await http.delete(`/owners/me/studio/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      });
      return response.data;
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

      const response = await http.put(`/owners/me/studio/rooms/${roomId}`, roomData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
      return response.data;
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

      const response = await http.delete(`/rooms/${roomId}/images/${imageIndex}`, {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      });
      return response.data;
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

      const response = await http.get(`/rooms`, {
        params: { studioId },
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          Accept: "application/json",
        },
      });

      const data = response.data;
      return Array.isArray(data?.rooms) ? data.rooms : Array.isArray(data) ? data : [];
    } catch (error: any) {
      if (error?.response?.status === 404) return [];
      console.error("Error obteniendo salas del estudio:", error);
      throw error;
    }
  },
} as const;

export const getStudioRooms = async (studioId: string, token?: string) =>
  roomsService.getRoomsByStudioId({ studioId, token });
