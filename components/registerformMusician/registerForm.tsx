"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { Formik, Form, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import { registerMusician } from "@/services/register.services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiMusicAiLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import dynamic from "next/dynamic";
import {
    Provincia,
    Localidad,
    fetchProvincias,
    fetchLocalidades,
} from "@/locationApis/locationApis";

const Select = dynamic(() => import("react-select"), { ssr: false });

const brand = {
  primary: "#015E88",
};

// =================== Helpers UI ===================
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

// =================== Input Component ===================
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
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      )}
      <HelpError name={name} />
    </div>
  );
};

// =================== React Select Styles ===================
const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: "#d1d5db",
    borderRadius: "0.5rem",
    padding: "2px",
    minHeight: "40px",
    boxShadow: "none",
    "&:hover": { borderColor: "#3b82f6" },
  }),
  singleValue: (provided: any) => ({ ...provided, color: "#0c4a6e" }),
  menu: (provided: any) => ({ ...provided, zIndex: 50 }),
  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected ? "#0c4a6e" : "#1f2937",
    backgroundColor: state.isFocused
      ? "#e0f2fe"
      : state.isSelected
      ? "#bae6fd"
      : "white",
  }),
  placeholder: (provided: any) => ({ ...provided, color: "#6b7280" }),
};

// =================== Formik React Select ===================
const FormikReactSelect = ({
  name,
  options,
  placeholder,
  disabled,
  onChangeCustom,
}: {
  name: string;
  options: { id: string; nombre: string }[];
  placeholder?: string;
  disabled?: boolean;
  onChangeCustom?: (val: { id: string; nombre: string }) => void;
}) => {
  const [field, , helpers] = useField(name);
  const selectOptions = options.map((o) => ({
    value: o.id,
    label: o.nombre,
  }));

  return (
    <div className="mb-1 text-gray-700">
      <Select
        instanceId={name}
        value={
          selectOptions.find((o) => o.label === field.value) || null
        }
        onChange={(selected) => {
          if (selected) {
            helpers.setValue((selected as any).label);
            onChangeCustom &&
              onChangeCustom({
                id: (selected as any).value,
                nombre: (selected as any).label,
              });
          } else helpers.setValue("");
        }}
        options={selectOptions}
        placeholder={placeholder}
        isDisabled={disabled}
        styles={customSelectStyles}
        className="text-sm"
      />
      <HelpError name={name} />
    </div>
  );
};

// =================== Yup Schema ===================
const MusicianSchema = Yup.object().shape({
  nombre: Yup.string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras")
    .min(2, "Mínimo 2 caracteres")
    .required("Requerido"),

  apellido: Yup.string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras")
    .min(2, "Mínimo 2 caracteres")
    .required("Requerido"),

  email: Yup.string().email("Email inválido").required("Requerido"),

  password: Yup.string()
    .required("Requerido")
    .min(6, "Debe tener al menos 6 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .matches(/\d{1,}/, "Debe contener al menos 1 números")
    .matches(/[^A-Za-z0-9]/, "Debe contener al menos un caracter especial"),

  confirmPassword: Yup.string()
    .required("Requerido")
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir"),

  numeroDeTelefono: Yup.string()
    .required("Requerido")
    .matches(
      /^\+\d{7,15}$/,
      "Teléfono inválido. Debe comenzar con + y tener 7-15 dígitos"
    ),

  pais: Yup.string().required("Requerido"),
  provincia: Yup.string().required("Debe seleccionar una provincia"),
  ciudad: Yup.string().required("Debe seleccionar una ciudad"),

  calle: Yup.string()
    .min(3, "Mínimo 3 caracteres")
    .matches(
      /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,-]+$/,
      "La calle contiene caracteres inválidos"
    )
    .required("Requerido"),

  codigoPostal: Yup.string()
    .matches(/^\d{4,6}$/, "Debe tener 4 a 6 dígitos")
    .required("Requerido"),
});

// =================== Types ===================
type DefaultValues = { 
  nombre?: string; 
  apellido?: string; 
  email?: string; 
} | undefined;


// =================== Main Component ===================
export default function RegisterForm({ defaultValues }: { defaultValues?: DefaultValues }) {
  const [loading, setLoading] = useState(false);
  const [paises] = useState(["Argentina"]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState("Argentina");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<string>("");
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);

  // Fetch provincias when country changes
  useEffect(() => {
    fetchProvincias(paisSeleccionado).then(setProvincias);
    setProvinciaSeleccionada("");
    setLocalidades([]);
  }, [paisSeleccionado]);

  // Fetch localidades when province changes
  useEffect(() => {
    if (!provinciaSeleccionada) return;
    setLoadingLocalidades(true);
    fetchLocalidades(paisSeleccionado, provinciaSeleccionada)
      .then(setLocalidades)
      .finally(() => setLoadingLocalidades(false));
  }, [provinciaSeleccionada, paisSeleccionado]);

  const initialValues = {
    nombre: defaultValues?.nombre || "",
    apellido: defaultValues?.apellido || "",
    email: defaultValues?.email || "",
    password: "",
    confirmPassword: "",
    numeroDeTelefono: "",
    pais: paisSeleccionado,
    ciudad: "",
    provincia: "",
    calle: "",
    codigoPostal: "",
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Section */}
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

      {/* Form Section */}
      <div className="flex items-center justify-center bg-gray-100 py-6">
        <div className="w-full max-w-2xl bg-white ml-4 rounded-xl shadow-lg p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={MusicianSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              console.log("Valores del formulario al hacer submit:", values);
              setLoading(true);
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
                      pais: values.pais,
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
                setLoading(false);
              }
            }}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="space-y-3">
                {/* Información personal */}
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
                  <p className="text-xs text-gray-500 mt-1">
                    Debe contener al menos 6 caracteres, mayúscula, número y carácter especial
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" required>Confirmar Contraseña</Label>
                  <Input name="confirmPassword" type="password" placeholder="********" togglePassword />
                </div>

                <div>
                  <Label htmlFor="numeroDeTelefono" required>Teléfono</Label>
                  <Input name="numeroDeTelefono" placeholder="+5491123456789" />
                  <p className="text-xs text-gray-500 mt-1">
                    Debe contener un +
                  </p>
                </div>

                {/* Ubicación */}
                <SectionTitle>Ubicación</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pais" required>País</Label>
                    <select
                      name="pais"
                      value={paisSeleccionado}
                      onChange={(e) => {
                        const pais = e.target.value;
                        setPaisSeleccionado(pais);
                        setProvinciaSeleccionada("");
                        setLocalidades([]);
                        setFieldValue("pais", pais);
                        setFieldValue("provincia", "");
                        setFieldValue("ciudad", "");
                      }}
                      className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {paises.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="provincia" required>Provincia</Label>
                    <FormikReactSelect
                      name="provincia"
                      options={provincias}
                      placeholder="Seleccione provincia"
                      onChangeCustom={(prov) => {
                        setProvinciaSeleccionada(prov.id);
                        setFieldValue("provincia", prov.nombre);
                        setFieldValue("ciudad", "");
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ciudad" required>Localidad</Label>
                  {loadingLocalidades ? (
                    <div className="text-gray-500 p-2 border rounded">
                      Cargando...
                    </div>
                  ) : (
                    <FormikReactSelect
                      name="ciudad"
                      options={localidades}
                      placeholder="Seleccione localidad"
                      disabled={!provinciaSeleccionada}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calle" required>Calle</Label>
                    <Input name="calle" placeholder="Av. Siempre Viva 742" />
                  </div>
                  <div>
                    <Label htmlFor="codigoPostal" required>Código Postal</Label>
                    <Input name="codigoPostal" placeholder="1000" />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium shadow-md hover:opacity-90 flex justify-center items-center ${
                      loading || isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                    style={{ backgroundColor: brand.primary }}
                    disabled={loading || isSubmitting}
                  >
                    {(loading || isSubmitting) && (
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    )}
                    {loading || isSubmitting ? "Registrando..." : "Registrarme"}
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