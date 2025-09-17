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

export type MembershipPlan = "MONTHLY" | "ANNUAL";

export const PaymentsService = {
  async payMembership(payload: { plan: MembershipPlan }) {
    const { data } = await http.post("/payments/membership", payload);
    // espera: { clientSecret: string, amount: number }
    return data;
  },

  async payBooking(payload: { bookingId: string; instrumentIds?: string[] }) {
    const { data } = await http.post("/payments/booking", payload);
    return data;
  },

  async confirmPayment(paymentIntentId: string) {
    const { data } = await http.get(`/payments/confirm/${paymentIntentId}`);
    return data;
  },
  
};
