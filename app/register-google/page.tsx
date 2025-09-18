"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RegisterGooglePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reg_token = searchParams.get("reg_token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (role: string) => {
    if (!reg_token) {
      setError("Token de registro no encontrado.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${reg_token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "No se pudo completar el registro");
      }

      const data = await response.json();
      console.log("✅ Registro completado:", data);

      // data debería contener los datos del usuario (name, email, etc.)
      const { nombre, apellido, email } = data.user || {};

      if (role === "Músico") {
        router.push(
          `/register/musician?nombre=${encodeURIComponent(
            nombre || ""
          )}&apellido=${encodeURIComponent(apellido || "")}&email=${encodeURIComponent(
            email || ""
          )}`
        );
      } else if (role === "Dueño de Estudio") {
        router.push(
          `/register/studio-owner?firstName=${encodeURIComponent(
            nombre || ""
          )}&lastName=${encodeURIComponent(
            apellido || ""
          )}&email=${encodeURIComponent(email || "")}`
        );
      }
    } catch (err: any) {
      console.error("❌ Error en el registro:", err);
      setError(err.message || "Error inesperado en el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-xl font-bold mb-4">Completa tu registro</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <button
          onClick={() => handleRegister("Músico")}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 mb-4 disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Soy Músico"}
        </button>
        <button
          onClick={() => handleRegister("Dueño de Estudio")}
          disabled={loading}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Soy Dueño de Estudio"}
        </button>
      </div>
    </div>
  );
}
