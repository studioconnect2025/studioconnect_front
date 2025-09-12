"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

type ModalCheckoutProps = {
  open: boolean;
  onClose: () => void;
  plan: "monthly" | "yearly";
};

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setErrorMsg(error.message || "Error procesando el pago");
    } else if (paymentIntent?.status === "succeeded") {
      alert("✅ Pago exitoso");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CardElement className="p-2 border rounded-md" />
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Procesando..." : "Pagar"}
      </button>
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
        const token =
          localStorage.getItem("accessToken") || localStorage.getItem("token");

        if (!token) {
          setErrorMsg("No hay sesión activa. Iniciá sesión para pagar.");
          return;
        }

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}payments/membership`,
          { plan },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error("Error creando PaymentIntent:", err);
        setErrorMsg("No se pudo iniciar el pago. Intenta nuevamente.");
      }
    };

    fetchPaymentIntent();
  }, [open, plan]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Pagar Membresía ({plan === "monthly" ? "Mensual" : "Anual"})</DialogTitle>
        <DialogDescription>
          Ingresá los datos de tu tarjeta para completar el pago.
        </DialogDescription>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        {!clientSecret && !errorMsg && <p>Cargando pasarela de pago...</p>}

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}
