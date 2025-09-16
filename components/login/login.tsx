"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore, useAuthError } from "@/stores/AuthStore";
import { useRouter } from "next/navigation";
import { validateEmail, validatePassword } from "@/utils/validators/login";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface LoginPageProps {
  onClose?: () => void;
}

export default function LoginPage({ onClose }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  const login = useAuthStore((s) => s.login);
  const clearError = useAuthStore((s) => s.clearError);
  const error = useAuthError();
  const router = useRouter();

  // Validaciones
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  const isValid = !emailErr && !passErr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setTouchedEmail(true);
      setTouchedPassword(true);
      return;
    }
    await login({ email, password });

    const state = useAuthStore.getState();
    if (state.isAuthenticated) {
      setSuccessMsg("Login exitoso");
      setTimeout(() => {
        router.push("/");
        onClose?.(); 
      }, 1000);
    }
  };

  const emailAria =
    touchedEmail && emailErr
      ? { "aria-invalid": true as const, "aria-describedby": "email-error" }
      : {};
  const passwordAria =
    touchedPassword && passErr
      ? { "aria-invalid": true as const, "aria-describedby": "password-error" }
      : {};

  return (
    <div className=" bg-white flex  items-center justify-center px-4">
      <div className="w-full">
        <div className="rounded-t-xl bg-black text-white text-center py-3">
          <h1 className="text-lg font-bold">Inicio de sesión</h1>
        </div>

        <div className="rounded-b-xl bg-white shadow-md p-6">
          {error && (
            <p
              className="mb-3 text-center text-red-600 text-sm"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}

          {successMsg && (
            <p
              className="mb-3 text-center text-green-600 text-sm"
              aria-live="polite"
            >
              {successMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) clearError();
                  }}
                  onBlur={() => setTouchedEmail(true)}
                  placeholder="Introduce tu correo electrónico"
                  required
                  {...emailAria}
                  className={`block w-full rounded-md border px-3 py-2 shadow-sm text-black focus:border-sky-600 focus:ring-sky-600 sm:text-sm ${
                    touchedEmail && emailErr
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {touchedEmail && emailErr && (
                <p id="email-error" className="mt-1 text-xs text-red-600">
                  {emailErr}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  onBlur={() => setTouchedPassword(true)}
                  placeholder="Introduce tu contraseña"
                  required
                  {...passwordAria}
                  className={`block w-full rounded-md border px-3 py-2 shadow-sm text-black focus:border-sky-600 focus:ring-sky-600 sm:text-sm ${
                    touchedPassword && passErr
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                   {showPassword ? <HiEyeOff size={25} /> : <HiEye size={25} />}
                </button>
              </div>
              {touchedPassword && passErr && (
                <p id="password-error" className="mt-1 text-xs text-red-600">
                  {passErr}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
  <label className="inline-flex items-center gap-2">
    <input
      type="checkbox"
      checked={remember}
      onChange={(e) => setRemember(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
    />
    <span className="text-sm text-gray-600">Recordarme</span>
  </label>

  <Link
    href="/forgot-password"
    onClick={() => {
      onClose?.(); // ✅ Cierra el modal al navegar
    }}
    className="text-sm text-sky-700 hover:underline"
  >
    ¿Olvidaste tu contraseña?
  </Link>
</div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid}
              aria-disabled={!isValid}
              className={`w-full py-2 px-4 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-700 ${
                isValid
                  ? "bg-sky-700 hover:bg-sky-800"
                  : "bg-sky-300 cursor-not-allowed"
              }`}
            >
              Iniciar sesión
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">
                  O continuar con
                </span>
              </div>
            </div>

            {/* Google SSO */}
            <button
              type="button"
              onClick={() => {
                const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").replace(/\/$/, "");
                const redirect = `${window.location.origin}/auth/sso`;
                window.location.href = `${api}/auth/google/login?redirect_uri=${encodeURIComponent(redirect)}`;
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            >
              <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
              Continuar con Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              href="/joinStudioConnect"
              className="text-sky-700 hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
