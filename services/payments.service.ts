// src/services/payments.service.ts
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
   * Confirmar estado de un pago (por paymentIntentId)
   * Contrato clásico: GET /payments/confirm/:paymentIntentId
   */
  async confirmPayment(paymentIntentId: string): Promise<ConfirmPaymentResponse> {
    const { data } = await http.get<ConfirmPaymentResponse>(`/payments/confirm/${paymentIntentId}`);
    return data;
  },

  /**
   * Capturar un pago (solo el dueño del estudio)
   */
  async capture(paymentIntentId: string): Promise<ConfirmPaymentResponse> {
    const { data } = await http.get<ConfirmPaymentResponse>(`/payments/confirm/${paymentIntentId}`);
    return data;
  },

  /**
   * Confirmar pago de una reserva (best-effort según variantes de backend)
   * Úsalo desde el checkout: confirmBookingPayment(paymentIntentId, bookingId)
   */
 async confirmBookingPayment(paymentIntentId: string, bookingId: string): Promise<ConfirmPaymentResponse> {
    const tries = [
      // 1) endpoint específico de bookings (si existe)
      () => http.post<ConfirmPaymentResponse>("/payments/booking/confirm", { paymentIntentId, bookingId }), 
      // 2) POST genérico con body
      () => http.post<ConfirmPaymentResponse>("/payments/confirm", { paymentIntentId, bookingId }),
      // 3) GET con path param (contrato clásico)
      () => http.get<ConfirmPaymentResponse>(`/payments/confirm/${paymentIntentId}`),
      // 4) Fallback: capturar (algunos back confirman capturando)
      () => http.post<ConfirmPaymentResponse>(`/payments/capture/${paymentIntentId}`),
    ] as const;

    let lastErr: any = null;
    for (const run of tries) {
      try {
        const { data } = await run();
        return data;
      } catch (e: any) {
        lastErr = e;
      }
    }

    const status = lastErr?.response?.status;
    const payload = lastErr?.response?.data;
    const msg = payload?.message || payload?.error || lastErr?.message || "Error confirmando pago";
    const err = new Error(`Confirmación de pago fallida (${status ?? "?"}): ${msg}`);
    (err as any).status = status;
    (err as any).response = payload;
    throw err;
  },
};
