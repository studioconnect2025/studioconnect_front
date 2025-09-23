import { http } from "@/lib/http";

/**
 * Enums
 */
export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED", // cancelada por el dueño
  CANCELED = "CANCELED", // cancelada por el músico
  COMPLETADO = "COMPLETADO",
  CANCELADA = "CANCELADA", // para backend legacy
}


export enum BookingAction {
  ACTIVE = "ACTIVA",
  CANCELED = "CANCELADA",
  REPROGRAMMED = "REPROGRAMADA",
}

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
  studio: string;
  room: string;
  roomId?: string;
  userId?: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  action?: BookingAction; // opcional para acción del músico
  isPaid?: boolean;
  instruments?: InstrumentBooking[];
}

export interface BookingPayload {
  studioId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  instrumentIds?: string[];
}

/**
 * BookingService
 */
export const BookingService = {
  async createBooking(payload: BookingPayload) {
    try {
      const { data } = await http.post("/bookings", payload);
      return data;
    } catch (error: any) {
      console.error("Error creando la reserva:", error.response || error);
      throw error;
    }
  },

  async getMyBookings(): Promise<Booking[]> {
    try {
      const { data } = await http.get<Booking[]>("/bookings/musician/my-bookings");
      return data;
    } catch (error: any) {
      console.error("Error trayendo reservas:", error.response || error);
      throw error;
    }
  },

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
        undefined,
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

  async payBooking(payload: { bookingId: string; instrumentIds?: string[] }) {
    try {
      const { data } = await http.post("/payments/booking", payload);
      return data;
    } catch (error: any) {
      console.error("Error iniciando pago de reserva:", error.response || error);
      throw error;
    }
  },

  async confirmPayment(paymentIntentId: string) {
    try {
      const { data } = await http.get(`/payments/confirm/${paymentIntentId}`);
      return data;
    } catch (error: any) {
      console.error("Error confirmando pago:", error.response || error);
      throw error;
    }
  },

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
