"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthService } from "@/services/auth.service";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Debe ser un correo válido")
    .matches(/@.*\.com$/i, "El correo debe terminar en .com")
    .required("El correo es obligatorio"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent("closeLoginModal"));
    } catch (e) {
      /* noop */
    }
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-xl font-bold text-sky-900 mb-4 text-center">
          Recuperar contraseña
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-2" role="alert">
            {error}
          </p>
        )}
        {successMsg && (
          <p className="text-green-600 text-sm mb-2" role="status">
            {successMsg}
          </p>
        )}

        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={async (values, { resetForm }) => {
            setError(null);
            setSuccessMsg(null);
            setLoading(true);
            try {
              await AuthService.forgotPassword(values.email);
              setSuccessMsg(
                "📩 Si el email existe, recibirás un enlace de recuperación en tu correo."
              );
              resetForm();
              try {
                window.dispatchEvent(new CustomEvent("closeLoginModal"));
              } catch (e) {}
              setTimeout(() => router.push("/"), 1600);
            } catch (err: any) {
              setError(err?.message || "Error al solicitar recuperación. Intenta nuevamente.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4" aria-describedby="forgot-desc">
              <p id="forgot-desc" className="text-sm text-gray-600">
                Introduce el correo asociado a tu cuenta. Te enviaremos un enlace para restablecer tu contraseña.
              </p>

              <div>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  className="w-full rounded-lg border px-3 py-2 shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-800"
                  disabled={loading || isSubmitting}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={loading || isSubmitting}
                className={`w-full py-2 px-4 rounded-lg text-white transition ${
                  loading || isSubmitting ? "bg-sky-600 cursor-wait" : "bg-sky-800 hover:bg-black"
                }`}
                aria-busy={loading || isSubmitting}
              >
                {loading || isSubmitting ? "Enviando..." : "Enviar enlace"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
