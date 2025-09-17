import { http } from "@/lib/http";

export const instrumentsService = {
  createInstrument: async (instrument: {
    name: string;
    description: string;
    price: number;
    available: boolean;
    categoryName: string;
    roomId: string;
  }) => {
    try {
      const response = await http.post("/instruments/create", instrument);
      return response.data; 
    } catch (error: any) {
      console.error("Error en instrumentsService.createInstrument:", error);
      throw new Error("No se pudo crear el instrumento");
    }
  },
}