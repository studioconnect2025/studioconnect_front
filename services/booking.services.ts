// services/booking.services.ts
import { http } from "@/lib/http";

export interface InstrumentBooking {
  id: string;
  name: string;
  price: number;
}

export interface Booking {
  id: string;
  room: string;
  studio: string;
  startTime: string;
  endTime: string;
  totalPrice: string;
  status: string; // PENDIENTE, COMPLETADO...
  isPaid: boolean;
  instruments: InstrumentBooking[];
}

export interface BookingPayload {
  studioId: string;
  roomId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  instrumentIds: string[];
}

export const BookingService = {
  // Crear una nueva reserva
  createBooking: async (payload: BookingPayload) => {
    try {
      const res = await http.post("/bookings", payload);
      return res.data;
    } catch (error: any) {
      console.error("Error creando la reserva:", error.response || error);
      throw error;
    }
  },

  // Obtener todas mis reservas (músico)
  getMyBookings: async (): Promise<Booking[]> => {
    try {
      const res = await http.get("/bookings/musician/my-bookings");
      return res.data;
    } catch (error: any) {
      console.error("Error trayendo reservas:", error.response || error);
      throw error;
    }
  },

cancelBooking: async (bookingId: string) => {
  try {
    const token = localStorage.getItem("token"); 
    const res = await http.patch(
      `/bookings/musician/${bookingId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error("Error cancelando la reserva:", error.response || error);
    throw error;
  }
},

};
