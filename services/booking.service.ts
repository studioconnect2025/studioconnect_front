// src/services/booking.service.ts
import { http } from "@/lib/http";
import { PaymentsService, BookingPaymentResponse, ConfirmPaymentResponse } from "./payments.service";

export interface Booking {
  id: string;
  roomId: string;        // 🔹 actualizado: ahora la reserva tiene roomId
  userId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export const BookingService = {
  /**
   * Crear una reserva sobre una sala específica
   */
  async create(payload: {
    roomId: string;             // 🔹 ahora sobre la sala, no el estudio
    startTime: string;
    endTime: string;
    instrumentIds?: string[];
  }) {
    const { data } = await http.post("/bookings", payload);
    return data;
  },

  /**
   * Obtener todas las reservas de un usuario
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data } = await http.get<Booking[]>(`/bookings/user/${userId}`);
    return data;
  },

  /**
   * Pagar una reserva
   */
  async payBooking(payload: { bookingId: string; instrumentIds?: string[] }) {
    const { data } = await http.post("/payments/booking", payload);
    return data;
  },

  /**
   * Confirmar pago de una reserva
   */
  async confirmPayment(paymentIntentId: string) {
    const { data } = await http.get(`/payments/confirm/${paymentIntentId}`);
    return data;
  },

  /**
   * Capturar un pago de reserva (solo dueño estudio)
   */
  async capturePayment(paymentIntentId: string) {
    const { data } = await http.post(`/payments/capture/${paymentIntentId}`);
    return data;
  },
};
