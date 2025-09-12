// app/payments/history/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Payment {
  id: string;
  type: "MEMBERSHIP" | "BOOKING";
  amount: number;
  currency: string;
  status: "SUCCEEDED" | "PENDING" | "FAILED";
  createdAt: string;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setPayments(data);
      } catch (error) {
        console.error("Error cargando historial", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <p>Cargando historial...</p>;
  if (payments.length === 0) return <p>No tienes pagos registrados.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mis Pagos</h1>
      <ul className="space-y-4">
        {payments.map((p) => (
          <li key={p.id} className="p-4 border rounded-xl shadow-sm flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {p.type === "MEMBERSHIP" ? "Membresía" : "Reserva"}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(p.createdAt).toLocaleDateString("es-AR")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">
                {p.amount / 100} {p.currency.toUpperCase()}
              </p>
              <p
                className={`text-sm ${
                  p.status === "SUCCEEDED"
                    ? "text-green-600"
                    : p.status === "PENDING"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {p.status === "SUCCEEDED"
                  ? "Pagado"
                  : p.status === "PENDING"
                  ? "Pendiente"
                  : "Fallido"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
