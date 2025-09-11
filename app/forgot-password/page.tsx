"use client";

import { useState } from "react";
import { AuthService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      await AuthService.forgotPassword(email);
      setSuccessMsg("📩 Si el email existe, recibirás un enlace de recuperación");
    } catch (err: any) {
      setError(err?.message || "Error al solicitar recuperación");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-lg font-bold mb-4">Recuperar contraseña</h1>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {successMsg && <p className="text-green-600 text-sm mb-2">{successMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Introduce tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 shadow-sm text-black"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-sky-700 text-white hover:bg-sky-800"
          >
            Enviar enlace
          </button>
        </form>
      </div>
    </div>
  );
}
