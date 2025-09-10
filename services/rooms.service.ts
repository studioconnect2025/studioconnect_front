import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/";

export const roomsService = {
  async createRoom(data:{studioId: string, roomData: any}) {
    try {
      const token = localStorage.getItem("auth"); 
      if (!token) throw new Error("Usuario no logueado");

      const response = await axios.post(`rooms/${data.studioId}`, data.roomData, {
        baseURL: API,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creando la sala:", error);
      throw error;
    }
  },
};
