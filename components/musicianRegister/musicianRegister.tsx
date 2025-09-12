"use client";

import React, { ReactNode, useState } from "react";
import { Formik, Form, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import { registerMusician } from "@/services/register.services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiMusicAiLine } from "react-icons/ri";

const brand = {
  primary: "#015E88",
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
      {children}
    </h3>
  );
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function HelpError({ name }: { name: string }) {
  return (
    <ErrorMessage
      name={name}
      component="div"
      className="text-xs text-red-600 mt-1"
    />
  );
}

const Input = ({
  name,
  type = "text",
  placeholder,
  togglePassword,
}: {
  name: string;
  type?: string;
  placeholder?: string;
  togglePassword?: boolean;
}) => {
  const [show, setShow] = useState(false);
  const inputType = togglePassword && show ? "text" : type;
  const [field] = useField(name);

  return (
    <div className="relative">
      <input
        {...field}
        id={name}
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
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.584 10.59A3 3 0 0012 15a3 3 0 001.414-.374M9.88 4.64A9.53 9.53 0 0112 4.5c5.523 0 10 4.5 10 7.5-.44 1.163-1.285 2.37-2.42 3.41M6.32 6.32C4.28 7.77 3 9.65 3 12c0 .67.15 1.32.43 1.93"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 12s3.5-7.5 10-7.5S22 12 22 12s-3.5 7.5-10 7.5S2 12 2 12z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}
      <HelpError name={name} />
    </div>
  );
};

// Yup Schema
const MusicianSchema = Yup.object().shape({
  nombre: Yup.string().required("Requerido"),
  apellido: Yup.string().required("Requerido"),
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string()
    .required("Requerido")
    .min(6, "Debe tener al menos 6 caracteres"),
  confirmPassword: Yup.string()
    .required("Requerido")
    .min(6, "Debe tener al menos 6 caracteres")
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir"),
  numeroDeTelefono: Yup.string()
    .required("Requerido")
    .matches(
      /^(\+?\d{1,4}[-\s]?)?\d{7,15}$/,
      "Teléfono inválido (7-15 dígitos, puede incluir +, espacios o guiones)"
    ),
  ciudad: Yup.string().required("Requerido"),
  provincia: Yup.string().required("Requerido"),
  calle: Yup.string().required("Requerido"),
  codigoPostal: Yup.string().required("Requerido"),
});

export default function MusicianRegisterForm() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-sky-800 text-white py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <RiMusicAiLine size={60} className="text-sky-700" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Registra tu cuenta de usuario músico
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            Únete a StudioConnect y comienza a reservar increíbles estudios de grabación!.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-100 py-6">
        <div className="w-full max-w-2xl bg-white ml-4 rounded-xl shadow-lg p-6">
          <Formik
            initialValues={{
              nombre: "",
              apellido: "",
              email: "",
              password: "",
              confirmPassword: "",
              numeroDeTelefono: "",
              ciudad: "",
              provincia: "",
              calle: "",
              codigoPostal: "",
            }}
            validationSchema={MusicianSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const payload = {
                  email: values.email,
                  password: values.password,
                  confirmPassword: values.confirmPassword,
                  profile: {
                    nombre: values.nombre,
                    apellido: values.apellido,
                    numeroDeTelefono: values.numeroDeTelefono,
                    ubicacion: {
                      ciudad: values.ciudad,
                      provincia: values.provincia,
                      calle: values.calle,
                      codigoPostal: values.codigoPostal,
                    },
                  },
                };
                await registerMusician(payload);
                toast.success("Registro completado correctamente!");
                resetForm();
                setTimeout(() => {
                  window.location.href = "/";
                }, 1500);
              } catch (err: any) {
                toast.error(err?.response?.data?.message ?? "Error al registrar");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {() => (
              <Form className="space-y-3">
                <SectionTitle>Información personal</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre" required>Nombre</Label>
                    <Input name="nombre" placeholder="Juan" />
                  </div>
                  <div>
                    <Label htmlFor="apellido" required>Apellido</Label>
                    <Input name="apellido" placeholder="Pérez" />
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
                  <Label htmlFor="numeroDeTelefono" required>Teléfono</Label>
                  <Input name="numeroDeTelefono" placeholder="+5491123456789" />
                </div>

                <SectionTitle>Ubicación</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ciudad" required>Ciudad</Label>
                    <Input name="ciudad" placeholder="Buenos Aires" />
                  </div>
                  <div>
                    <Label htmlFor="provincia" required>Provincia</Label>
                    <Input name="provincia" placeholder="Provincia" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calle" required>Calle</Label>
                    <Input name="calle" placeholder="Av. Siempre Viva 742" />
                  </div>
                  <div>
                    <Label htmlFor="codigoPostal" required>Código Postal</Label>
                    <Input name="codigoPostal" placeholder="CP100" />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-lg text-white font-medium shadow-md hover:opacity-90"
                    style={{ backgroundColor: brand.primary }}
                  >
                    Registrarme
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
