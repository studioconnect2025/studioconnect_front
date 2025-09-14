"use client";

import React, { ReactNode, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaBuilding } from "react-icons/fa";
import { registerStudioOwner } from "@/services/register.services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const brand = { primary: "#015E88" };

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-3 mt-6">{children}</h3>
  );
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function HelpError({ name }: { name: string }) {
  return <ErrorMessage name={name} component="div" className="text-xs text-red-600 mt-1" />;
}

const Input = ({ name, type = "text", placeholder, togglePassword }: { name: string; type?: string; placeholder?: string; togglePassword?: boolean }) => {
  const [show, setShow] = useState(false);
  const inputType = togglePassword && show ? "text" : type;

  return (
    <div className="relative">
      <Field
        id={name}
        name={name}
        type={inputType}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {togglePassword && (
        <button
          type="button"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {show ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.584 10.59A3 3 0 0012 15a3 3 0 001.414-.374M9.88 4.64A9.53 9.53 0 0112 4.5c5.523 0 10 4.5 10 7.5-.44 1.163-1.285 2.37-2.42 3.41M6.32 6.32C4.28 7.77 3 9.65 3 12c0 .67.15 1.32.43 1.93" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7.5 10-7.5S22 12 22 12s-3.5 7.5-10 7.5S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}
      <HelpError name={name} />
    </div>
  );
};

// Yup Schema para Owner (sin ubicación)
const StudioSchema = Yup.object().shape({
  firstName: Yup.string().required("Requerido"),
  lastName: Yup.string().required("Requerido"),
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string().required("Requerido").min(6, "Debe tener al menos 6 caracteres"),
  confirmPassword: Yup.string()
    .required("Requerido")
    .min(6, "Debe tener al menos 6 caracteres")
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir"),
  phoneNumber: Yup.string()
    .required("Requerido")
    .matches(/^(\+?\d{1,4}[-\s]?)?\d{7,15}$/, "Teléfono inválido"),
});

export default function StudioConnectStudioForm() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-sky-800 text-white py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <FaBuilding size={30} className="text-sky-700" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">Registrate como Owner de estudio</h1>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            Únete a nuestra red de estudios de grabación profesionales y conéctate con músicos de todo el mundo.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-100 py-4 px-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
              phoneNumber: "",
            }}
            validationSchema={StudioSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              console.log("Formulario enviado con valores:", values);
              try {
                const payload = {
                  email: values.email,
                  password: values.password,
                  confirmPassword: values.confirmPassword,
                  profile: {
                    nombre: values.firstName,
                    apellido: values.lastName,
                    numeroDeTelefono: values.phoneNumber,
                  },
                };

                await registerStudioOwner(payload);
                toast.success("Registro completado correctamente!");
                resetForm();
                setTimeout(() => { window.location.href = "/"; }, 1500);
              } catch (err: any) {
                console.error("Error en registro:", err.response?.data ?? err);
                toast.error(err?.response?.data?.message ?? "Error al registrar");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <SectionTitle>Información del Propietario</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" required>Nombre</Label>
                    <Input name="firstName" placeholder="Juan" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" required>Apellido</Label>
                    <Input name="lastName" placeholder="Pérez" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" required>Email</Label>
                  <Input name="email" type="email" placeholder="correo@ejemplo.com" />
                </div>

                <div>
                  <Label htmlFor="password" required>Contraseña</Label>
                  <Input name="password" type="password" placeholder="********" togglePassword />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" required>Confirmar Contraseña</Label>
                  <Input name="confirmPassword" type="password" placeholder="********" togglePassword />
                </div>

                <div>
                  <Label htmlFor="phoneNumber" required>Teléfono</Label>
                  <Input name="phoneNumber" placeholder="+549111111111" />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 rounded-lg text-white font-medium shadow-md hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: brand.primary }}
                  >
                    {isSubmitting ? "Registrando..." : "Registrarme"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
