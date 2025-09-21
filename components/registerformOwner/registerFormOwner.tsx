"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Formik, Form, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { registerStudioOwner } from "@/services/register.services";

const Select = dynamic(() => import("react-select"), { ssr: false });

/* ============================= Helpers UI ============================ */
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
      {children}
    </h3>
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
          {show ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
        </button>
      )}
      <HelpError name={name} />
    </div>
  );
};

/* ============================= Select ============================ */
const customSelectStyles = {
  control: (provided: any) => ({ ...provided, backgroundColor: "white", borderColor: "#d1d5db", borderRadius: "0.5rem", padding: "2px", minHeight: "40px", boxShadow: "none", "&:hover": { borderColor: "#3b82f6" } }),
  singleValue: (provided: any) => ({ ...provided, color: "#0c4a6e" }),
  menu: (provided: any) => ({ ...provided, zIndex: 50 }),
  option: (provided: any, state: any) => ({ ...provided, color: state.isSelected ? "#0c4a6e" : "#1f2937", backgroundColor: state.isFocused ? "#e0f2fe" : state.isSelected ? "#bae6fd" : "white" }),
  placeholder: (provided: any) => ({ ...provided, color: "#6b7280" }),
};

const FormikReactSelect = ({ name, options, placeholder, disabled, onChangeCustom }: { name: string; options: { id: string; nombre: string }[]; placeholder?: string; disabled?: boolean; onChangeCustom?: (val: { id: string; nombre: string }) => void }) => {
  const [field, , helpers] = useField(name);
  const selectOptions = options.map((o) => ({ value: o.id, label: o.nombre }));

  return (
    <div className="mb-1 text-gray-700">
      <Select
        instanceId={name}
        value={selectOptions.find((o) => o.label === field.value) || null}
        onChange={(selected) => {
          if (selected) {
            helpers.setValue((selected as any).label);
            onChangeCustom?.({ id: (selected as any).value, nombre: (selected as any).label });
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

/* ============================= Validación Yup ============================ */
const OwnerSchema = Yup.object().shape({
  nombre: Yup.string().required("Campo requerido"),
  apellido: Yup.string().required("Campo requerido"),
  email: Yup.string().email("Email inválido").required("Campo requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Campo requerido"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Las contraseñas no coinciden").required("Campo requerido"),
  numeroDeTelefono: Yup.string().required("Campo requerido"),
  pais: Yup.string().required("Campo requerido"),
  provincia: Yup.string().required("Campo requerido"),
  ciudad: Yup.string().required("Campo requerido"),
  calle: Yup.string().required("Campo requerido"),
  codigoPostal: Yup.string().required("Campo requerido"),
});

/* ============================= API externa ============================ */
type Provincia = { nombre: string };
type Localidad = { nombre: string };

async function fetchProvincias(pais: string): Promise<Provincia[]> {
  if (pais !== "Argentina") return [];
  const res = await fetch("https://apis.datos.gob.ar/georef/api/provincias");
  const data = await res.json();
  return data.provincias;
}

async function fetchLocalidades(pais: string, provincia: string): Promise<Localidad[]> {
  if (pais !== "Argentina") return [];
  const res = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia}&max=1000`);
  const data = await res.json();
  return data.localidades;
}

/* ============================= Componente principal ============================ */
export default function OwnerRegisterForm({ defaultValues }: { defaultValues?: { nombre?: string; apellido?: string; email?: string } }) {
  const [paises] = useState(["Argentina"]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState("Argentina");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<string>("");
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvincias(paisSeleccionado).then(setProvincias);
    setProvinciaSeleccionada("");
    setLocalidades([]);
  }, [paisSeleccionado]);

  useEffect(() => {
    if (!provinciaSeleccionada) return;
    setLoadingLocalidades(true);
    fetchLocalidades(paisSeleccionado, provinciaSeleccionada)
      .then(setLocalidades)
      .finally(() => setLoadingLocalidades(false));
  }, [provinciaSeleccionada, paisSeleccionado]);

  const initialValues = {
    nombre: defaultValues?.nombre ?? "",
    apellido: defaultValues?.apellido ?? "",
    email: defaultValues?.email ?? "",
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
      <div className="flex items-center justify-center bg-gray-100 py-6">
        <div className="w-full max-w-2xl bg-white ml-4 rounded-xl shadow-lg p-6">
          <Formik initialValues={initialValues} validationSchema={OwnerSchema} onSubmit={async (values, { setSubmitting, resetForm }) => {
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
              await registerStudioOwner(payload);
              toast.success("Registro completado correctamente!");
              resetForm();
              setTimeout(() => (window.location.href = "/"), 1500);
            } catch (err: any) {
              toast.error(err?.response?.data?.message ?? "Error al registrar");
            } finally {
              setSubmitting(false);
              setLoading(false);
            }
          }}>
            {({ setFieldValue, isSubmitting }) => (
              <Form className="space-y-3">
                <SectionTitle>Información personal</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="nombre" required>Nombre</Label><Input name="nombre" placeholder="Juan" /></div>
                  <div><Label htmlFor="apellido" required>Apellido</Label><Input name="apellido" placeholder="Pérez" /></div>
                </div>
                <div><Label htmlFor="email" required>Email</Label><Input name="email" type="email" placeholder="correo@ejemplo.com" /></div>
                <div>
                  <Label htmlFor="password" required>Contraseña</Label>
                  <Input name="password" type="password" placeholder="********" togglePassword />
                  <p className="text-xs text-gray-500 mt-1">Debe contener al menos 6 caracteres, mayúscula, número y carácter especial</p>
                </div>
                <div><Label htmlFor="confirmPassword" required>Confirmar Contraseña</Label><Input name="confirmPassword" type="password" placeholder="********" togglePassword /></div>
                <div>
                  <Label htmlFor="numeroDeTelefono" required>Teléfono</Label>
                  <Input name="numeroDeTelefono" placeholder="+5491123456789" />
                  <p className="text-xs text-gray-500 mt-1">Debe contener un +</p>
                </div>

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
                      {paises.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="provincia" required>Provincia</Label>
                    <FormikReactSelect
                      name="provincia"
                      options={provincias.map((p) => ({ id: p.nombre, nombre: p.nombre }))}
                      placeholder="Seleccione provincia"
                      onChangeCustom={(prov) => { setProvinciaSeleccionada(prov.id); setFieldValue("provincia", prov.nombre); setFieldValue("ciudad", ""); }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ciudad" required>Localidad</Label>
                  {loadingLocalidades ? <div className="text-gray-500 p-2 border rounded">Cargando...</div> : (
                    <FormikReactSelect
                      name="ciudad"
                      options={localidades.map((l) => ({ id: l.nombre, nombre: l.nombre }))}
                      placeholder="Seleccione localidad"
                      disabled={!provinciaSeleccionada}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="calle" required>Calle</Label><Input name="calle" placeholder="Av. Siempre Viva 742" /></div>
                  <div><Label htmlFor="codigoPostal" required>Código Postal</Label><Input name="codigoPostal" placeholder="1000" /></div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium shadow-md hover:opacity-90 flex justify-center items-center ${loading || isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                    style={{ backgroundColor: "#015E88" }}
                    disabled={loading || isSubmitting}
                  >
                    {(loading || isSubmitting) && (
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
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
