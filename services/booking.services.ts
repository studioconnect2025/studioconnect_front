import { http } from "@/lib/http";

/**
 * Interfaces
 */
export interface InstrumentBooking {
  id: string;
  name: string;
  price: number;
}

export interface Booking {
  id: string;
  studio: string;            // estudio asociado
  room: string;              // nombre de la sala
  roomId?: string;           // 🔹 opcional: algunos endpoints devuelven roomId
  userId?: string;           // 🔹 opcional: solo para dueño
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETADO" | "PENDIENTE";
  isPaid?: boolean;
  instruments?: InstrumentBooking[];
}

export interface BookingPayload {
  studioId: string;
  roomId: string;
  startTime: string;     // ISO string
  endTime: string;       // ISO string
  instrumentIds?: string[];
}

/**
 * BookingService
 */
export const BookingService = {
  /**
   * Crear una nueva reserva
   */
  async createBooking(payload: BookingPayload) {
    try {
      const { data } = await http.post("/bookings", payload);
      return data;
    } catch (error: any) {
      console.error("Error creando la reserva:", error.response || error);
      throw error;
    }
  },

  /**
   * Obtener todas mis reservas (músico)
   */
  async getMyBookings(): Promise<Booking[]> {
    try {
      const { data } = await http.get<Booking[]>("/bookings/musician/my-bookings");
      return data;
    } catch (error: any) {
      console.error("Error trayendo reservas:", error.response || error);
      throw error;
    }
  },

  /**
   * Obtener reservas de un usuario específico (ej. dueño)
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const { data } = await http.get<Booking[]>(`/bookings/user/${userId}`);
      return data;
    } catch (error: any) {
      console.error("Error trayendo reservas de usuario:", error.response || error);
      throw error;
    }
  },

  /**
   * Cancelar una reserva (músico)
   */
  async cancelBooking(bookingId: string) {
    try {
      const token = localStorage.getItem("token");
      const { data } = await http.patch(
        `/bookings/musician/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (error: any) {
      console.error("Error cancelando la reserva:", error.response || error);
      throw error;
    }
  },

  /**
   * Iniciar pago de una reserva
   */
  async payBooking(payload: { bookingId: string; instrumentIds?: string[] }) {
    try {
      const { data } = await http.post("/payments/booking", payload);
      return data;
    } catch (error: any) {
      console.error("Error iniciando pago de reserva:", error.response || error);
      throw error;
    }
  },

  /**
   * Confirmar un pago (Stripe webhook / client confirmación)
   */
  async confirmPayment(paymentIntentId: string) {
    try {
      const { data } = await http.get(`/payments/confirm/${paymentIntentId}`);
      return data;
    } catch (error: any) {
      console.error("Error confirmando pago:", error.response || error);
      throw error;
    }
  },

  /**
   * Capturar pago (solo dueño del estudio)
   */
  async capturePayment(paymentIntentId: string) {
    try {
      const { data } = await http.post(`/payments/capture/${paymentIntentId}`);
      return data;
    } catch (error: any) {
      console.error("Error capturando pago:", error.response || error);
      throw error;
    }
  },
};
