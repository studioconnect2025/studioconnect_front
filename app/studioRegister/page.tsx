"use client";

import React, { ReactNode, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCloudUploadAlt, FaStore } from "react-icons/fa";
import ModalTerminos from "@/components/legal/ModalTerminos";
import TextoTerminos from "@/components/legal/TextoTerminos";
import { useRouter } from "next/navigation";

const brand = {
  primary: "#015E88",
  light: "#F5F7FA",
};

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-3 mt-6">
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
    <ErrorMessage name={name} component="div" className="text-xs text-red-600 mt-1" />
  );
}

// Input con integración a Formik
const Input = ({ name, type = "text", placeholder }: { name: string; type?: string; placeholder?: string }) => (
  <Field
    id={name}
    name={name}
    type={type}
    placeholder={placeholder}
    className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
);

// Checkbox
const Checkbox = ({ name, value, label }: any) => (
  <label className="flex items-center gap-2 text-gray-800">
    <Field type="checkbox" name={name} value={value} className="h-4 w-4" />
    <span className="text-sm">{label}</span>
  </label>
);

// Yup Schema
const numberTransform = (schema: any) =>
  schema.transform((value: any, originalValue: any) => {
    if (originalValue === "" || originalValue === null || originalValue === undefined) return undefined;
    const parsed = Number(originalValue);
    return Number.isNaN(parsed) ? originalValue : parsed;
  });

const ProfileOwnerSchema = Yup.object().shape({
  studioName: Yup.string().required("Requerido"),
  commercialId: Yup.string().required("Requerido"),
  years: Yup.string().required("Requerido"),
  studioType: Yup.string().required("Requerido"),
  specializations: Yup.array().min(1, "Selecciona al menos una especialización"),
  tarifaHora: numberTransform(Yup.number()).typeError("Debe ser un número").required("Requerido"),
  tarifaDia: numberTransform(Yup.number()).typeError("Debe ser un número").required("Requerido"),
  openHour: Yup.string().required("Requerido"),
  closeHour: Yup.string().required("Requerido"),
  services: Yup.array(),
  equipment: Yup.array(),
  registroComercial: Yup.mixed().required("Debes subir un archivo"),
  terms: Yup.boolean().oneOf([true], "Debes aceptar los términos"),
  hourlyRate: numberTransform(Yup.number()).typeError("Debe ser un número").required("Requerido"),
  minDuration: Yup.string().required("Requerido"),
  preBooking: Yup.string().required("Requerido"),
  cancellation: Yup.string().required("Requerido"),
  openWeek: Yup.string().required("Requerido"),
  closeWeek: Yup.string().required("Requerido"),
  openWeekend: Yup.string().required("Requerido"),
  closeWeekend: Yup.string().required("Requerido"),
  images: Yup.array().min(1, "Debes subir al menos 1 imagen").max(5, "Máximo 5 imágenes").required("Requerido"),
});

export default function RegisterPage() {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const initialValues = {
    studioName: "",
    commercialId: "",
    years: "",
    studioType: "",
    specializations: [] as string[],
    tarifaHora: "",
    tarifaDia: "",
    openHour: "",
    closeHour: "",
    services: [] as string[],
    equipment: [] as string[],
    registroComercial: null as File | null,
    terms: false,
    hourlyRate: "",
    minDuration: "",
    preBooking: "24 horas",
    cancellation: "Aviso de 24 horas",
    openWeek: "",
    closeWeek: "",
    openWeekend: "",
    closeWeekend: "",
    images: [] as File[],
  };

  const specializationsList = ["Grabación", "Mezcla", "Mastering", "Producción", "Composición"];
  const servicesList = [
    { value: "sala ensayo", label: "Sala de ensayo" },
    { value: "sala grabacion", label: "Sala de grabación" },
    { value: "sala estar", label: "Sala de estar" },
    { value: "cafeteria", label: "Cafetería" },
    { value: "estacionamiento", label: "Estacionamiento" },
  ];
  const equipmentList = [
    { value: "bateria", label: "Batería" },
    { value: "guitarra", label: "Guitarra" },
    { value: "bajo", label: "Bajo" },
    { value: "microfonos", label: "Micrófonos" },
    { value: "consola", label: "Consola" },
  ];

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const formData = new FormData();
      formData.append("studioName", values.studioName || "");
      formData.append("commercialId", values.commercialId || "");
      formData.append("years", values.years || "");
      formData.append("studioType", values.studioType || "");
      formData.append("tarifaHora", String(values.tarifaHora || ""));
      formData.append("tarifaDia", String(values.tarifaDia || ""));
      formData.append("openHour", values.openHour || "");
      formData.append("closeHour", values.closeHour || "");
      formData.append("hourlyRate", String(values.hourlyRate || ""));
      formData.append("minDuration", values.minDuration || "");
      formData.append("preBooking", values.preBooking || "");
      formData.append("cancellation", values.cancellation || "");
      formData.append("openWeek", values.openWeek || "");
      formData.append("closeWeek", values.closeWeek || "");
      formData.append("openWeekend", values.openWeekend || "");
      formData.append("closeWeekend", values.closeWeekend || "");
      formData.append("terms", values.terms ? "true" : "false");
      (values.specializations || []).forEach((s: any) => formData.append("specializations[]", s));
      (values.services || []).forEach((s: any) => formData.append("services[]", s));
      (values.equipment || []).forEach((e: any) => formData.append("equipment[]", e));
      if (values.registroComercial) formData.append("registroComercial", values.registroComercial);
      (values.images || []).forEach((file: File) => formData.append("images", file));

      const res = await fetch("/api/studios", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        setMessage({ type: 'error', text: 'Error al registrar estudio. Por favor, inténtalo de nuevo.' });
      } else {
        const data = await res.json();
        console.log("Registro correcto:", data);
        setMessage({ type: 'success', text: '¡Estudio registrado correctamente!' });
        setTimeout(() => {
          router.push('/studioDashboard');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error al registrar estudio. Por favor, inténtalo de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-sky-800 text-white py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <FaStore size={30} className="text-sky-700" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">Registro de estudio</h1>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            Únete a nuestra red de estudios de grabación profesionales y conéctate con músicos de todo el mundo.
          </p>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
          {message && (
            <div className={`p-3 mb-4 rounded-lg text-sm text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <Formik initialValues={initialValues} validationSchema={ProfileOwnerSchema} onSubmit={handleSubmit}>
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                <SectionTitle>Información del estudio</SectionTitle>

                <div>
                  <Label htmlFor="studioName" required>Nombre de estudio/sala</Label>
                  <Input name="studioName" placeholder="SoundWaves Recording Studio" />
                  <HelpError name="studioName" />
                </div>

                <div>
                  <Label htmlFor="commercialId" required>Número de registro comercial</Label>
                  <Input name="commercialId" placeholder="REG-123456" />
                  <HelpError name="commercialId" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="commercialId" required>Años en el negocio</Label>
                    <Field as="select" name="years" className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Seleccione...</option>
                      <option value="1-5 años">1-5 años</option>
                      <option value="5-10 años">5-10 años</option>
                      <option value="10-15 años">10-15 años</option>
                      <option value="15+ años">15+ años</option>
                    </Field>
                    <HelpError name="years" />
                  </div>

                  <div>
                    <Label htmlFor="studioType" required>
                      Tipo de estudio
                    </Label>
                    <Field as="select" name="studioType" className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Seleccione...</option>
                      <option value="Profesional">Estudio profesional</option>
                      <option value="Home Studio">Home Studio</option>
                      <option value="Rehearsal">Sala de ensayo</option>
                    </Field>
                    <HelpError name="studioType" />
                  </div>
                </div>

                {/* Especializaciones */}
                <Label htmlFor="specializations" required>
                      Especializaciones
                </Label>
                <div className="flex flex-wrap gap-2">
                  {specializationsList.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => {
                        const newSpecs = values.specializations.includes(spec)
                          ? values.specializations.filter((s: any) => s !== spec)
                          : [...values.specializations, spec];
                        setFieldValue("specializations", newSpecs);
                      }}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        values.specializations.includes(spec) ? "bg-blue-600 text-white" : "bg-white text-black border-gray-400"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
                <HelpError name="specializations" />

                {/* Fotos del estudio */}
                <SectionTitle>Fotos del estudio</SectionTitle>
                <Label htmlFor="specializations" required>
                      Sube un maximo de 5 fotos
                </Label>
                <div >
                  <input 
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => {
                      const files = event.currentTarget.files;
                      if (files) {
                        const newFiles = Array.from(files).slice(0, 5);
                        setFieldValue("images", newFiles);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <div className="flex gap-2 flex-wrap mt-2">
                    {values.images &&
                      values.images.map((file: File, index: number) => (
                        <img key={index} src={URL.createObjectURL(file)} alt={`preview-${index}`} className="w-24 h-24 object-cover rounded" />
                      ))}
                  </div>
                  <HelpError name="images" />
                </div>

                {/* Servicios */}
                <SectionTitle>Servicios</SectionTitle>
                <div className="flex flex-wrap gap-4">
                  {servicesList.map((s) => (
                    <Checkbox key={s.value} name="services" value={s.value} label={s.label} />
                  ))}
                </div>

                {/* Equipamiento */}
                <SectionTitle>Equipamiento</SectionTitle>
                <div className="flex flex-wrap gap-4">
                  {equipmentList.map((eq) => (
                    <Checkbox key={eq.value} name="equipment" value={eq.value} label={eq.label} />
                  ))}
                </div>

                
                {/* Registro Comercial */}
                <SectionTitle>Registro Comercial</SectionTitle>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                  <input
                    id="registroComercial"
                    name="registroComercial"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(event) => setFieldValue("registroComercial", event.currentTarget.files?.[0])}
                  />
                  <label htmlFor="registroComercial" className="text-gray-800 cursor-pointer">
                    <FaCloudUploadAlt size={50} className="mx-auto mb-2" />
                    Suelta tu PDF aquí o haz clic para subir
                  </label>
                  <HelpError name="registroComercial" />
                </div>

                {/* Términos */}
                <div className="flex items-center gap-2 mt-2">
                  <Field type="checkbox" name="terms" className="h-4 w-4" />
                  <span className="text-gray-800 text-sm">
                    Acepto los {" "}
                    <button type="button" onClick={() => setOpenModal(true)} className="text-sky-700 underline hover:text-sky-900">
                      términos y condiciones
                    </button>
                  </span>
                </div>
                <HelpError name="terms" />

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 rounded-lg text-white font-medium shadow-md hover:opacity-90"
                    style={{ backgroundColor: brand.primary }}
                  >
                    {isSubmitting ? "Registrando..." : "Registrar mi estudio"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Modal */}
      <ModalTerminos isOpen={openModal} onClose={() => setOpenModal(false)}>
        <TextoTerminos />
      </ModalTerminos>
    </div>
  );
}
