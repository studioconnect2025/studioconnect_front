const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const roomsService = {
  createRoom: async ({
    token,
    roomData,
  }: {
    token: string;
    roomData: any;
  }) => {
    try {
      const response = await fetch(`${API}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

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

      const response = await fetch(`${API}/rooms/${roomId}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: imagesFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

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

      const response = await fetch(`${API}/owners/me/studio/rooms`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

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

      const response = await fetch(`${API}/owners/me/studio/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

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

      const response = await fetch(`${API}/owners/me/studio/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

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

      const response = await fetch(`${API}/rooms/${roomId}/images/${imageIndex}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

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

      const url = `${API}/rooms?studioId=${encodeURIComponent(studioId)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (res.status === 404) {
        return [];
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
      return Array.isArray(data?.rooms) ? data.rooms : Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error obteniendo salas del estudio:", error);
      throw error;
    }
  },

  addInstrument: async ({
    roomId,
    instrumentData,
    token,
  }: {
    roomId: string;
    instrumentData: any;
    token?: string;
  }) => {
    try {
      const accessToken =
        token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : undefined);
      if (!accessToken) throw new Error("No hay token disponible");

      const res = await fetch(`${API}/rooms/${roomId}/instruments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(instrumentData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      return await res.json();
    } catch (error) {
      console.error("Error agregando instrumento:", error);
      throw error;
    }
  },
} as const;

export const getStudioRooms = async (studioId: string, token?: string) =>
  roomsService.getRoomsByStudioId({ studioId, token });
