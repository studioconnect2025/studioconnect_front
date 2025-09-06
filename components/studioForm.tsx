"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaCloudUploadAlt } from "react-icons/fa";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold mt-6 mb-2">{children}</h2>
);
const Label = ({ children, htmlFor, required }: { children: React.ReactNode; htmlFor?: string; required?: boolean }) => (
  <label htmlFor={htmlFor} className="block mb-1 font-medium">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);
const Input = (props: any) => (
  <input {...props} className="w-full border rounded-lg px-3 py-2 text-sm text-gray-800" />
);
const HelpError = ({ name, errors, touched }: any) => (
  <Field name={name}>
    {() => errors?.[name] && touched?.[name] ? (
      <div className="text-red-500 text-sm">{errors[name]}</div>
    ) : null}
  </Field>
);
const Checkbox = ({ name, value, label }: any) => (
  <label className="flex items-center gap-2">
    <Field type="checkbox" name={name} value={value} />
    {label}
  </label>
);
const ModalTerminos = ({ isOpen, onClose, children }: any) => (
  isOpen ? (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/2">
        {children}
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  ) : null
);
const TextoTerminos = () => <p>Aquí van los términos y condiciones...</p>;

// Validación Yup
const ProfileOwnerSchema = Yup.object().shape({
  firstName: Yup.string().required("Requerido"),
  lastName: Yup.string().required("Requerido"),
  email: Yup.string().email("Email inválido").required("Requerido"),
  phone: Yup.string().required("Requerido"),
  bio: Yup.string().required("Requerido"),
  studioName: Yup.string().required("Requerido"),
  commercialId: Yup.string().required("Requerido"),
  years: Yup.string().required("Requerido"),
  studioType: Yup.string().required("Requerido"),
  hourlyRate: Yup.number().typeError("Debe ser un número").required("Requerido"),
  minDuration: Yup.string().required("Requerido"),
  preBooking: Yup.string().required("Requerido"),
  cancellation: Yup.string().required("Requerido"),
  openWeek: Yup.string().required("Requerido"),
  closeWeek: Yup.string().required("Requerido"),
  openWeekend: Yup.string().required("Requerido"),
  closeWeekend: Yup.string().required("Requerido"),
  tarifaHora: Yup.number().typeError("Debe ser un número").required("Requerido"),
  tarifaDia: Yup.number().typeError("Debe ser un número").required("Requerido"),
  registroComercial: Yup.mixed().required("Debes subir un archivo"),
  openHour: Yup.string().required("Requerido"),
  closeHour: Yup.string().required("Requerido"),
  terms: Yup.boolean().oneOf([true], "Debes aceptar los términos"),
});

export const StudioForm = () => {
  const [openModal, setOpenModal] = useState(false);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
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

  return (
    <Formik initialValues={initialValues} validationSchema={ProfileOwnerSchema} onSubmit={(values) => console.log(values)}>
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="space-y-6">
          <SectionTitle>Información del estudio</SectionTitle>

          <Label htmlFor="studioName" required>Nombre de estudio/sala</Label>
          <Input name="studioName" placeholder="SoundWaves Recording Studio" />
          <HelpError name="studioName" errors={errors} touched={touched} />

          <Label htmlFor="commercialId" required>Número de registro comercial</Label>
          <Input name="commercialId" placeholder="REG-123456" />
          <HelpError name="commercialId" errors={errors} touched={touched} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="years" required>Años en el negocio</Label>
              <Field as="select" name="years" className="w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white">
                <option value="">Seleccione...</option>
                <option value="1-5 años">1-5 años</option>
                <option value="5-10 años">5-10 años</option>
                <option value="10-15 años">10-15 años</option>
                <option value="15+ años">15+ años</option>
              </Field>
              <HelpError name="years" errors={errors} touched={touched} />
            </div>
            <div>
              <Label htmlFor="studioType" required>Tipo de estudio</Label>
              <Field as="select" name="studioType" className="w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white">
                <option value="">Seleccione...</option>
                <option value="Profesional">Estudio profesional</option>
                <option value="Home Studio">Home Studio</option>
                <option value="Rehearsal">Sala de ensayo</option>
              </Field>
              <HelpError name="studioType" errors={errors} touched={touched} />
            </div>
          </div>

          <Label>Especializaciones</Label>
          <div className="flex flex-wrap gap-2">
            {specializationsList.map(spec => (
              <button
                key={spec}
                type="button"
                onClick={() => {
                  const newSpecs = values.specializations.includes(spec)
                    ? values.specializations.filter(s => s !== spec)
                    : [...values.specializations, spec];
                  setFieldValue("specializations", newSpecs);
                }}
                className={`px-3 py-1 rounded-full text-sm border ${
                  values.specializations.includes(spec) ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                }`}
              >
                {spec}
              </button>
            ))}
            <button type="button" className="px-3 py-1 rounded-full text-sm border bg-gray-50">+ Add</button>
          </div>
          <HelpError name="specializations" errors={errors} touched={touched} />

          {/* Aquí podrías continuar agregando Tarifas, Disponibilidad, Servicios, Equipamiento, Registro Comercial, Términos, Configuración empresarial y Horarios usando el mismo patrón */}

          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Guardar
          </button>

          <ModalTerminos isOpen={openModal} onClose={() => setOpenModal(false)}>
            <TextoTerminos />
          </ModalTerminos>
        </Form>
      )}
    </Formik>
  );
};
