"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { Eye, EyeOff } from "lucide-react";


export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setError("Token no encontrado");
        setLoading(false);
        return;
      }
      try {
        const { valid } = await AuthService.validateResetToken(token);
        setTokenValid(valid);
      } catch (err: any) {
        setError(err?.message || "Token inválido o expirado");
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // OJO: el backend espera { token, newPassword }
      await AuthService.resetPassword({ token: token || "", newPassword: password });

      setSuccessMsg("✅ Contraseña restablecida exitosamente");
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setError(err?.message || "Error al restablecer contraseña");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Validando token...</p>;
  }

  if (!tokenValid) {
    return (
      <p className="text-center text-red-600">
        {error || "El token es inválido o ya expiró"}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-cyan-900 p-6 rounded-xl shadow-md">
        <h1 className="text-lg text-blue-100 font-bold mb-4">Restablecer contraseña</h1>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {successMsg && <p className="text-green-600 text-sm mb-2">{successMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nueva contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 shadow-sm text-black pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 shadow-sm text-black pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-sky-50 text-black hover:bg-cyan-600"
          >
            Restablecer
          </button>
        </form>
      </div>
    </div>
  );
}
