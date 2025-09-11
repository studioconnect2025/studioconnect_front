export const roomsService = {
  createRoom: async ({
    token,
    roomData,
  }: {
    token: string;
    roomData: any;
  }) => {
    try {
      const response = await fetch(`http://localhost:3000/rooms`, {
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
      const accessToken = token ?? localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No hay token disponible");

      const response = await fetch(`http://localhost:3000/rooms/${roomId}/images`, {
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
      const accessToken = token ?? localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No hay token disponible");

      const response = await fetch(`http://localhost:3000/owners/me/studio/rooms`, {
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
      const accessToken = token ?? localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No hay token disponible");

      const response = await fetch(`http://localhost:3000/owners/me/studio/rooms/${roomId}`, {
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
      const accessToken = token ?? localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No hay token disponible");

      const response = await fetch(`http://localhost:3000/owners/me/studio/rooms/${roomId}`, {
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
      const accessToken = token ?? localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No hay token disponible");

      const response = await fetch(
        `http://localhost:3000/rooms/${roomId}/images/${imageIndex}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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

  // ==================== Instrumentos ====================
  addInstrument: async ({
    roomId,
    instrumentData,
    token,
  }: {
    roomId: string;
    instrumentData: {
      name: string;
      description: string;
      price: number;
      available: boolean;
      categoryName: string;
    };
    token?: string;
  }) => {
    try {
      const accessToken = token ?? localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No hay token disponible");

      const body = {
        roomId,
        ...instrumentData,
      };
      const response = await fetch(`http://localhost:3000/instruments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al agregar instrumento");
      }

      return await response.json();
    } catch (error) {
      console.error("Error agregando instrumento:", error);
      throw error;
    }
  },
};
