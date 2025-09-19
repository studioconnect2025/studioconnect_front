// src/services/membership.service.ts
import { PaymentsService, MembershipPlan, MembershipPaymentResponse, ConfirmPaymentResponse } from "./payments.service";

/**
 * MembershipService
 * Wrapper para manejar el flujo de pagos de membresías de dueños de estudio.
 * Los dueños deben elegir un plan (MONTHLY | ANNUAL) para activar su estudio.
 */
export const MembershipService = {
  /**
   * Inicia el pago de una membresía.
   * @param plan Tipo de plan: "MONTHLY" o "ANNUAL"
   * @returns clientSecret, amount, paymentIntentId
   */
  async pay(plan: MembershipPlan): Promise<MembershipPaymentResponse> {
    return PaymentsService.payMembership({ plan });
  },

  /**
   * Confirma un pago de membresía en backend.
   * @param paymentIntentId ID del PaymentIntent generado por Stripe
   * @returns estado del PaymentIntent
   */
  async confirm(paymentIntentId: string): Promise<ConfirmPaymentResponse> {
    return PaymentsService.confirmPayment(paymentIntentId);
  },
};
