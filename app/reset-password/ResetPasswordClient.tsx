"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthService } from "@/services/auth.service";
import { Eye, EyeOff } from "lucide-react";

/**
 * ResetPasswordClient:
 * - usa useSearchParams() -> necesita ser Client Component
 * - valida contraseña con Yup (>=8, mayúscula, 1 carácter especial de la lista)
 * - usa AuthService.validateResetToken() y AuthService.resetPassword()
 * - muestra estados (checkingToken, loading, success, error)
 */

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
    .matches(/[~@#$%^&*_\`\{\}\[\]\\|';\/\.,<>?:"]/ , "Debe contener al menos un carácter especial")
    .required("La contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
    .required("Debes confirmar tu contraseña"),
});

const ResetPasswordClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Validacion del token r
    const check = async () => {
      setCheckingToken(true);
      setGlobalError(null);

      if (!token) {
        setGlobalError("Token no encontrado.");
        setTokenValid(false);
        setCheckingToken(false);
        return;
      }

      try {
        const res = await AuthService.validateResetToken(token);
        setTokenValid(!!res?.valid);
      } catch (err: any) {
        setGlobalError(err?.message || "Token inválido o expirado.");
        setTokenValid(false);
      } finally {
        setCheckingToken(false);
      }
    };

    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
        <p className="text-gray-600">Validando token...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
          <p className="text-red-600">{globalError || "El token es inválido o ya expiró."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-xl font-bold text-sky-900 mb-4 text-center">Restablecer contraseña</h1>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setGlobalError(null);
            setSubmitting(true);
            try {
              await AuthService.resetPassword({ token, newPassword: values.password });
              resetForm();
              router.push("/");
            } catch (err: any) {
              setGlobalError(err?.message || "Error al restablecer contraseña.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values, handleChange }) => (
            <Form className="space-y-4" noValidate>
              {globalError && <p className="text-red-600 text-sm">{globalError}</p>}

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 shadow-sm text-black pr-10 focus:outline-none focus:ring-2 focus:ring-sky-800"
                  disabled={isSubmitting}
                  aria-required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 shadow-sm text-black pr-10 focus:outline-none focus:ring-2 focus:ring-sky-800"
                  disabled={isSubmitting}
                  aria-required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                  aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-lg text-white transition ${
                  isSubmitting ? "bg-sky-600 cursor-wait" : "bg-sky-800 hover:bg-black"
                }`}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Restablecer contraseña"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPasswordClient;
