"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentsService, MembershipPlan } from "@/services/payments.service";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Props {
  plan: MembershipPlan;
}

export default function MembershipCheckoutButton({ plan }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const { clientSecret } = await PaymentsService.payMembership({ plan });

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe no se pudo inicializar");

      const { error } = await stripe.confirmCardPayment(clientSecret);
      if (error) {
        console.error(error);
        alert("Error en el pago: " + error.message);
      } else {
        alert("Pago procesado, confirmando con backend...");
        // Podés redirigir a /membership o refrescar estado
      }
    } catch (err: any) {
      console.error(err);
      alert("Error al iniciar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleCheckout}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Procesando..." : `Pagar ${plan === "MENSUAL" ? "Mensual" : "Anual"}`}
    </button>
  );
}
