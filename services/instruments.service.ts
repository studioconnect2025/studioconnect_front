import { http, parseHttpError } from "@/lib/http";

export const instrumentsService = {
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
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const body = { roomId, ...instrumentData };
      const { data } = await http.post(`/instruments/create`, body, { headers });
      return data;
    } catch (error) {
      throw parseHttpError(error);
    }
  },

  getInstruments: async () => {
    try {
      const { data } = await http.get(`/instruments`);
      return data; // ya devuelve solo instrumentos del usuario
    } catch (error) {
      console.error("Error obteniendo instrumentos:", error);
      return [];
    }
  },

  deleteInstrument: async (instrumentId: string, token?: string) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await http.delete(`/instruments/${instrumentId}`, { headers });
      return true;
    } catch (error) {
      throw parseHttpError(error);
    }
  },
};
