// src/components/payments/ClientBookingCheckout.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import Button from "@/components/ui/Button";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type ClientBookingCheckoutProps = {
    bookingId: string;
    instrumentIds?: string[];
    token: string; // ✅ Correcto: la prop 'token' está aquí
};

const CARD_OPTIONS = {
    style: {
        base: {
            color: "#0f172a",
            fontSize: "16px",
            fontFamily: "inherit",
            "::placeholder": { color: "#9ca3af" },
        },
        invalid: { color: "#ef4444" },
    },
};

function CheckoutForm({
    clientSecret,
    bookingId,
}: {
    clientSecret: string;
    bookingId: string;
}) {
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
                payment_method: { card: cardElement },
            });

            const { error, paymentIntent } = result as any;

            if (error) {
                setErrorMsg(error.message || "Error procesando el pago");
            } else if (paymentIntent?.status === "succeeded") {
                router.push("/myBookings?payment_success=true");
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
            <Button
                type="submit"
                disabled={loading || !stripe}
                className="w-full"
            >
                {loading ? "Procesando..." : "Pagar reserva"}
            </Button>
        </form>
    );
}

export default function ClientBookingCheckout({
    bookingId,
    instrumentIds,
    token, // ✅ Recibe el token de las props
}: ClientBookingCheckoutProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentIntent = async () => {
            try {
                // ✅ SOLUCIÓN: Usar el token que se recibe como prop en lugar de localStorage
                if (!token) {
                    setErrorMsg(
                        "No hay sesión activa. Iniciá sesión para pagar."
                    );
                    return;
                }

                // Se envía la información directamente al backend.
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}payments/booking`,
                    { bookingId, instrumentIds },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (!data || !data.clientSecret) {
                    setErrorMsg(
                        "La pasarela no devolvió clientSecret. Contactá soporte."
                    );
                    return;
                }

                setClientSecret(data.clientSecret);
            } catch (err: any) {
                console.error("Error creando PaymentIntent:", err);
                setErrorMsg(
                    err?.response?.data?.message ||
                        "No se pudo iniciar el pago. Intenta nuevamente."
                );
            }
        };

        fetchPaymentIntent();
    }, [bookingId, instrumentIds, token]); // ✅ Dependencia añadida para 'token'

    return (
        <div className="w-screen p-6 bg-white shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Pagar Reserva
            </h2>
            <p className="text-gray-600 mb-4">
                Ingresá los datos de tu tarjeta para completar el pago.
            </p>

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            {!clientSecret && !errorMsg && (
                <p className="text-gray-500">Cargando pasarela de pago...</p>
            )}

            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm
                        clientSecret={clientSecret}
                        bookingId={bookingId}
                    />
                </Elements>
            )}
        </div>
    );
}
