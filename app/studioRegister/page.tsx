"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaCloudUploadAlt } from "react-icons/fa";

// Componentes UI
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold mt-6 mb-2 text-black">{children}</h2>
);

const Label = ({ children, htmlFor, required }: any) => (
  <label htmlFor={htmlFor} className="block mb-1 font-medium text-black">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const Input = (props: any) => (
  <input
    {...props}
    className="w-full border rounded-lg px-3 py-2 text-sm text-black bg-white"
  />
);

const HelpError = ({ name, errors, touched }: any) => (
  <Field name={name}>
    {() =>
      errors?.[name] && touched?.[name] ? (
        <div className="text-red-500 text-sm">{errors[name]}</div>
      ) : null
    }
  </Field>
);

const Checkbox = ({ name, value, label }: any) => (
  <label className="flex items-center gap-2 text-black">
    <Field type="checkbox" name={name} value={value} />
    {label}
  </label>
);

const ModalTerminos = ({ isOpen, onClose, children }: any) =>
  isOpen ? (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/2 text-black">
        {children}
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  ) : null;

const TextoTerminos = () => <p>Aquí van los términos y condiciones...</p>;

// Yup Schema completo
const ProfileOwnerSchema = Yup.object().shape({
  studioName: Yup.string().required("Requerido"),
  commercialId: Yup.string().required("Requerido"),
  years: Yup.string().required("Requerido"),
  studioType: Yup.string().required("Requerido"),
  specializations: Yup.array().min(
    1,
    "Selecciona al menos una especialización"
  ),
  tarifaHora: Yup.number().typeError("Debe ser un número").required("Requerido"),
  tarifaDia: Yup.number().typeError("Debe ser un número").required("Requerido"),
  openHour: Yup.string().required("Requerido"),
  closeHour: Yup.string().required("Requerido"),
  services: Yup.array(),
  equipment: Yup.array(),
  registroComercial: Yup.mixed().required("Debes subir un archivo"),
  terms: Yup.boolean().oneOf([true], "Debes aceptar los términos"),
  hourlyRate: Yup.number().typeError("Debe ser un número").required("Requerido"),
  minDuration: Yup.string().required("Requerido"),
  preBooking: Yup.string().required("Requerido"),
  cancellation: Yup.string().required("Requerido"),
  openWeek: Yup.string().required("Requerido"),
  closeWeek: Yup.string().required("Requerido"),
  openWeekend: Yup.string().required("Requerido"),
  closeWeekend: Yup.string().required("Requerido"),
  images: Yup.array()
    .min(1, "Debes subir al menos 1 imagen")
    .max(5, "Máximo 5 imágenes")
    .required("Requerido"),
});

export default function RegisterPage() {
  const [openModal, setOpenModal] = useState(false);

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

  const specializationsList = [
    "Grabación",
    "Mezcla",
    "Mastering",
    "Producción",
    "Composición",
  ];
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
    <Formik
      initialValues={initialValues}
      validationSchema={ProfileOwnerSchema}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className=" min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
            {/* Información del estudio */}
          <SectionTitle>Información del estudio</SectionTitle>
          <Label htmlFor="studioName" required>
            Nombre de estudio/sala
          </Label>
          <Input name="studioName" placeholder="SoundWaves Recording Studio" />
          <HelpError name="studioName" errors={errors} touched={touched} />

          <Label htmlFor="commercialId" required>
            Número de registro comercial
          </Label>
          <Input name="commercialId" placeholder="REG-123456" />
          <HelpError name="commercialId" errors={errors} touched={touched} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="years" required>
                Años en el negocio
              </Label>
              <Field
                as="select"
                name="years"
                className="w-full border rounded-lg px-3 py-2 text-sm text-black bg-white"
              >
                <option value="">Seleccione...</option>
                <option value="1-5 años">1-5 años</option>
                <option value="5-10 años">5-10 años</option>
                <option value="10-15 años">10-15 años</option>
                <option value="15+ años">15+ años</option>
              </Field>
              <HelpError name="years" errors={errors} touched={touched} />
            </div>
            <div>
              <Label htmlFor="studioType" required>
                Tipo de estudio
              </Label>
              <Field
                as="select"
                name="studioType"
                className="w-full border rounded-lg px-3 py-2 text-sm text-black bg-white"
              >
                <option value="">Seleccione...</option>
                <option value="Profesional">Estudio profesional</option>
                <option value="Home Studio">Home Studio</option>
                <option value="Rehearsal">Sala de ensayo</option>
              </Field>
              <HelpError name="studioType" errors={errors} touched={touched} />
            </div>
          </div>

          {/* Especializaciones */}
          <Label>Especializaciones</Label>
          <div className="flex flex-wrap gap-2">
            {specializationsList.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => {
                  const newSpecs = values.specializations.includes(spec)
                    ? values.specializations.filter((s) => s !== spec)
                    : [...values.specializations, spec];
                  setFieldValue("specializations", newSpecs);
                }}
                className={`px-3 py-1 rounded-full text-sm border ${
                  values.specializations.includes(spec)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black border-gray-400"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
          <HelpError name="specializations" errors={errors} touched={touched} />

          {/* Fotos del estudio */}
          <SectionTitle>Fotos del estudio</SectionTitle>
          <p className="text-sm text-black mb-2">
            Sube mínimo 1 y máximo 5 fotos
          </p>
          <div className="flex flex-col gap-2">
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
              className="border p-2 rounded text-black bg-white"
            />
            <div className="flex gap-2 flex-wrap mt-2">
              {values.images &&
                values.images.map((file: File, index: number) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
            </div>
            <HelpError name="images" errors={errors} touched={touched} />
          </div>

          {/* Tarifas */}
          <SectionTitle>Tarifas</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tarifaHora" required>
                Tarifa por hora $
              </Label>
              <Input name="tarifaHora" type="number" placeholder="0" />
              <HelpError name="tarifaHora" errors={errors} touched={touched} />
            </div>
            <div>
              <Label htmlFor="tarifaDia" required>
                Tarifa diaria $
              </Label>
              <Input name="tarifaDia" type="number" placeholder="0" />
              <HelpError name="tarifaDia" errors={errors} touched={touched} />
            </div>
          </div>

          {/* Disponibilidad */}
          <SectionTitle>Disponibilidad</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="openHour" required>
                Hora apertura
              </Label>
              <Input name="openHour" type="time" />
              <HelpError name="openHour" errors={errors} touched={touched} />
            </div>
            <div>
              <Label htmlFor="closeHour" required>
                Hora cierre
              </Label>
              <Input name="closeHour" type="time" />
              <HelpError name="closeHour" errors={errors} touched={touched} />
            </div>
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
              onChange={(event) =>
                setFieldValue("registroComercial", event.currentTarget.files?.[0])
              }
            />
            <label htmlFor="registroComercial" className="text-black cursor-pointer">
              <FaCloudUploadAlt size={50} className="mx-auto mb-2" />
              Suelta tu PDF aquí o haz clic para subir
            </label>
            <HelpError name="registroComercial" errors={errors} touched={touched} />
          </div>

          {/* Términos */}
          <div className="flex items-center gap-2 mt-2">
            <Field type="checkbox" name="terms" className="h-4 w-4" />
            <span className="text-black text-sm">
              Acepto los{" "}
              <button
                type="button"
                onClick={() => setOpenModal(true)}
                className="text-sky-700 underline hover:text-sky-900"
              >
                términos y condiciones
              </button>
            </span>
          </div>
          <HelpError name="terms" errors={errors} touched={touched} />

          {/* Configuración empresarial */}
          <SectionTitle>Configuración empresarial</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hourlyRate" required>
                Tarifa por hora predeterminada
              </Label>
              <Input name="hourlyRate" placeholder="$15000" />
              <HelpError name="hourlyRate" errors={errors} touched={touched} />
            </div>
            <div>
              <Label htmlFor="minDuration" required>
                Duración mínima de reserva
              </Label>
              <Field
                as="select"
                name="minDuration"
                className="w-full border rounded-lg px-3 py-2 text-sm text-black bg-white"
              >
                <option value="">Seleccione...</option>
                <option value="1 hora">1 hora</option>
                <option value="2 horas">2 horas</option>
                <option value="3 horas">3 horas</option>
              </Field>
              <HelpError name="minDuration" errors={errors} touched={touched} />
            </div>
            <div>
              <Label htmlFor="preBooking" required>
                Se requiere reserva previa
              </Label>
              <Field
                as="select"
                name="preBooking"
                className="w-full border rounded-lg px-3 py-2 text-sm text-black bg-white"
              >
                <option value="24 horas">24 horas</option>
                <option value="48 horas">48 horas</option>
              </Field>
              <HelpError name="preBooking" errors={errors} touched={touched} />
            </div>
            <div>
              <Label htmlFor="cancellation" required>
                Política de cancelación
              </Label>
              <Field
                as="select"
                name="cancellation"
                className="w-full border rounded-lg px-3 py-2 text-sm text-black bg-white"
              >
                <option value="Aviso de 24 horas">Aviso de 24 horas</option>
                <option value="Aviso de 48 horas">Aviso de 48 horas</option>
              </Field>
              <HelpError name="cancellation" errors={errors} touched={touched} />
            </div>
          </div>

          {/* Horarios semana y fin de semana */}
          <SectionTitle>Horas de funcionamiento</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Lunes - Viernes</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input name="openWeek" type="time" />
                  <HelpError name="openWeek" errors={errors} touched={touched} />
                </div>
                <span className="text-black">-</span>
                <div className="flex-1">
                  <Input name="closeWeek" type="time" />
                  <HelpError name="closeWeek" errors={errors} touched={touched} />
                </div>
              </div>
            </div>

            <div>
              <Label>Sábado - Domingo</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input name="openWeekend" type="time" />
                  <HelpError name="openWeekend" errors={errors} touched={touched} />
                </div>
                <span className="text-black">-</span>
                <div className="flex-1">
                  <Input name="closeWeekend" type="time" />
                  <HelpError name="closeWeekend" errors={errors} touched={touched} />
                </div>
              </div>
            </div>
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            className="px-4 py-2 bg-sky-800 cursor-pointer text-white rounded-md hover:bg-black mt-6"
          >
            Registrar mi estudio
          </button>

          <ModalTerminos isOpen={openModal} onClose={() => setOpenModal(false)}>
            <TextoTerminos />
          </ModalTerminos>
          </div>
        </Form>
      )}
    </Formik>
  );
}
