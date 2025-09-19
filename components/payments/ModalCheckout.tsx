"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

type ModalCheckoutProps = {
  open: boolean;
  onClose: () => void;
  plan: "monthly" | "yearly";
};

// Opciones visuales para CardElement
const CARD_OPTIONS = {
  style: {
    base: {
      color: "#0f172a",
      fontSize: "16px",
      fontFamily: "inherit",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

function CheckoutForm({ clientSecret, onClose }: { clientSecret: string; onClose: () => void; }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMsg("No se pudo acceder al elemento de la tarjeta.");
      setLoading(false);
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      const { error, paymentIntent } = result as any;

      if (error) {
        setErrorMsg(error.message || "Error procesando el pago");
      } else if (paymentIntent?.status === "succeeded") {
        // Guardamos flag local para indicar que se pagó la membresía.
        // El backend igualmente actualizará (webhook) pero este flag permite UX inmediata.
        try {
          localStorage.setItem("membershipJustPaid", "1");
          localStorage.setItem("membershipPaymentIntent", paymentIntent.id || "");
        } catch (err) {
          // si storage fallara, no rompemos la app
          console.warn("No se pudo guardar membershipJustPaid en localStorage", err);
        }

        // cerramos modal y redirigimos al perfil (misma página para músico/owner)
        onClose();
        router.push("/musicianProfile");
      } else {
        setErrorMsg("Estado de pago inesperado. Intenta nuevamente.");
      }
    } catch (err: any) {
      console.error("Error confirmando pago:", err);
      setErrorMsg(err?.message || "Error inesperado al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="border rounded-xl p-3 bg-gray-50">
        <CardElement options={CARD_OPTIONS} />
      </div>
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <Button type="submit" disabled={loading || !stripe} className="w-full">
        {loading ? "Procesando..." : "Pagar"}
      </Button>
    </form>
  );
}

export default function ModalCheckout({ open, onClose, plan }: ModalCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchPaymentIntent = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (!token) {
          setErrorMsg("No hay sesión activa. Iniciá sesión para pagar.");
          return;
        }

        const formattedPlan = plan === "monthly" ? "MONTHLY" : "YEARLY";

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}payments/membership`,
          { plan: formattedPlan },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error("Error creando PaymentIntent:", err);
        setErrorMsg(err?.response?.data?.message || "No se pudo iniciar el pago. Intenta nuevamente.");
      }
    };

    fetchPaymentIntent();
  }, [open, plan]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl shadow-lg p-6 max-w-md">
        <DialogTitle className="text-lg font-semibold text-gray-800">
          Pagar Membresía ({plan === "monthly" ? "Mensual" : "Anual"})
        </DialogTitle>
        <DialogDescription className="text-gray-600 mb-4">
          Ingresá los datos de tu tarjeta para completar el pago.
        </DialogDescription>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        {!clientSecret && !errorMsg && (
          <p className="text-gray-500">Cargando pasarela de pago...</p>
        )}

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} onClose={onClose} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}
