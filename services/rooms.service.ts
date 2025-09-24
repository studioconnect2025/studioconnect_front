import { http } from "@/lib/http";

export const roomsService = {
  /**
   * Obtiene las salas del estudio del dueño autenticado.
   * GET /owners/me/studio/rooms
   */
  getMyRooms: async (token?: string) => {
    const accessToken =
      token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);
    if (!accessToken) throw new Error("No hay token disponible");

    const response = await http.get("/owners/me/studio/rooms", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    return response.data;
  },

  /**
   * Obtiene las salas de un estudio específico (público o autenticado).
   * GET /rooms/studio/:studioId
   */
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

      const response = await http.get(`/rooms/studio/${studioId}`, {
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

  /**
   * Crea una nueva sala en el estudio del dueño.
   * POST /rooms
   */
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

  /**
   * Actualiza una sala específica.
   * PUT /owners/me/studio/rooms/:roomId
   */
  updateRoom: async ({
    token,
    roomId,
    roomData,
  }: {
    token?: string;
    roomId: string;
    roomData: any;
  }) => {
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
  },

  /**
   * Elimina una sala del dueño.
   * DELETE /owners/me/studio/rooms/:roomId
   */
  deleteRoom: async ({ token, roomId }: { token?: string; roomId: string }) => {
    const accessToken =
      token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);
    if (!accessToken) throw new Error("No hay token disponible");

    const response = await http.delete(`/owners/me/studio/rooms/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    return response.data;
  },

  /**
   * Sube imágenes a una sala.
   * POST /rooms/:roomId/images
   */
  uploadRoomImages: async ({
    token,
    roomId,
    imagesFormData,
  }: {
    token?: string;
    roomId: string;
    imagesFormData: FormData;
  }) => {
    const accessToken =
      token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);
    if (!accessToken) throw new Error("No hay token disponible");

    const response = await http.post(`/rooms/${roomId}/images`, imagesFormData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Elimina una imagen de una sala.
   * DELETE /rooms/:roomId/images/:imageIndex
   */
  deleteRoomImage: async ({
    roomId,
    imageIndex,
    token,
  }: {
    roomId: string;
    imageIndex: number;
    token?: string;
  }) => {
    const accessToken =
      token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);
    if (!accessToken) throw new Error("No hay token disponible");

    const response = await http.delete(`/rooms/${roomId}/images/${imageIndex}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    return response.data;
  },
} as const;

// Alias para obtener salas de un estudio
export const getStudioRooms = async (studioId: string, token?: string) =>
  roomsService.getRoomsByStudioId({ studioId, token });
