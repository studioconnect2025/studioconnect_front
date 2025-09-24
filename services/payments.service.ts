import { http } from "@/lib/http";

export interface BookingPaymentResponse {
  clientSecret: string;
  bookingId: string;
  totalPrice: number;
  paymentIntentId: string;
}

export interface MembershipPaymentResponse {
  clientSecret: string;
  amount: number;
  paymentIntentId: string;
}

export interface ConfirmPaymentResponse {
  status: string;
  paymentIntentId: string;
}

export type MembershipPlan = "MENSUAL" | "ANUAL";

export const PaymentsService = {
  /**
   * Crear pago de membresía
   */
  async payMembership(payload: { plan: MembershipPlan }): Promise<MembershipPaymentResponse> {
    const { data } = await http.post<MembershipPaymentResponse>("/payments/membership", payload);
    return data;
  },

  /**
   * Crear pago de reserva (booking)
   */
  async payBooking(payload: { bookingId: string; instrumentIds?: string[] }): Promise<BookingPaymentResponse> {
    const { data } = await http.post<BookingPaymentResponse>("/payments/booking", payload);
    return data;
  },

  /**
   * Confirmar estado de un pago
   */
  async confirmPayment(paymentIntentId: string): Promise<ConfirmPaymentResponse> {
    const { data } = await http.get<ConfirmPaymentResponse>(`/payments/confirm/${paymentIntentId}`);
    return data;
  },

  /**
   * Capturar un pago (solo el dueño del estudio puede hacerlo).
   */
  async capture(paymentIntentId: string): Promise<ConfirmPaymentResponse> {
    const { data } = await http.post<ConfirmPaymentResponse>(`/payments/capture/${paymentIntentId}`);
    return data;
  },
};
