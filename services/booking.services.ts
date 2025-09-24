// app/services/BookingService.ts

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
    updatedAt?: string;
  canceledAt?: string | null;
}

export interface BookingPayload {
  studioId: string;
  roomId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
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

  /**
   * Obtener todas mis reservas (músico)
   */
  // ✅ Solución: `getMyBookings` recibe el token como argumento
  async getMyBookings(token: string): Promise<Booking[]> {
    try {
      const { data } = await http.get<Booking[]>("/bookings/musician/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error: any) {
      console.error("Error trayendo reservas:", error.response || error);
      throw error;
    }
  },

  /**
   * Obtener los detalles de una reserva específica
   * 🟢 NUEVA FUNCIÓN AGREGADA 🟢
   */
  // ✅ Solución: `getBookingDetails` recibe el token como argumento
  async getBookingDetails(bookingId: string, token: string): Promise<Booking> {
    try {
      const { data } = await http.get<Booking>(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error: any) {
      console.error("Error obteniendo detalles de la reserva:", error.response?.data || error);
      throw error;
    }
  },

  /**
   * Obtener reservas de un usuario específico (ej. dueño)
   */
  // ✅ Solución: `getUserBookings` recibe el token como argumento
  async getUserBookings(userId: string, token: string): Promise<Booking[]> {
    try {
      const { data } = await http.get<Booking[]>(`/bookings/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error: any) {
      console.error("Error trayendo reservas de usuario:", error.response || error);
      throw error;
    }
  },

  /**
   * Cancelar una reserva (músico)
   */
  // ✅ Solución: `cancelBooking` recibe el token como argumento
  async cancelBooking(bookingId: string, token: string) {
    try {
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


  /**
   * Iniciar pago de una reserva
   */
  // ✅ Solución: `payBooking` recibe el token como argumento
  async payBooking(payload: { bookingId: string; instrumentIds?: string[] }, token: string) {
    try {
      const { data } = await http.post("/payments/booking", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
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


  /**
   * Capturar pago (solo dueño del estudio)
   */
  // ✅ Solución: `capturePayment` recibe el token como argumento
  async capturePayment(paymentIntentId: string, token: string) {
    try {
      const { data } = await http.post(`/payments/capture/${paymentIntentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error: any) {
      console.error("Error capturando pago:", error.response || error);
      throw error;
    }
  },
};