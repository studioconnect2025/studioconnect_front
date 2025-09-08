"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ReactNode, useState } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { OwnerService } from "@/services/owner.services";

const brand = {
  primary: "#015E88",
  light: "#F5F7FA",
};

type SectionTitleProps = {
  children: React.ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="rounded-lg">
      <h2 className="text-xl font-bold text-gray-700">{children}</h2>
    </div>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {children}
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
}: {
  name: string;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <Field
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg bg-white text-gray-800 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <HelpError name={name} />
  </div>
);

const ProfileOwnerSchema = Yup.object().shape({});

type FormValues = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  direccion: string;
  pais: string;
  localidad: string;
  studioName: string;
  commercialId: string;
  years: string;
  studioType: string;
  specializations: string[];
  hourlyRate: string | number;
  minDuration: string;
  preBooking: string;
  cancellation: string;
  openWeek: string;
  closeWeek: string;
  openWeekend: string;
  closeWeekend: string;
  tarifaHora: string;
  tarifaDia: string;
  registroComercial: string;
  openHour: string;
  closeHour: string;
  terms: boolean;
  services: string[];
  equipment: string[];
};

export default function ProfileOwnerForm() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const initialValues: FormValues = {
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    direccion: "",
    pais: "",
    localidad: "",
    studioName: "",
    commercialId: "",
    years: "",
    studioType: "",
    specializations: [],
    hourlyRate: "",
    minDuration: "",
    preBooking: "",
    cancellation: "",
    openWeek: "",
    closeWeek: "",
    openWeekend: "",
    closeWeekend: "",
    tarifaHora: "",
    tarifaDia: "",
    registroComercial: "",
    openHour: "",
    closeHour: "",
    services: [],
    equipment: [],
    terms: false,
  };

  return (
    <div>
      <div className="bg-sky-800 text-white py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Perfil del propietario del estudio
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            EDICIÓN DE PERFIL
          </p>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
          <Formik<FormValues>
            initialValues={initialValues}
            validationSchema={ProfileOwnerSchema}
            onSubmit={async (values, { resetForm }) => {
              try {
                const updated = await OwnerService.updateMyStudio(values.id!, {
                  ...values,
                  hourlyRate: values.hourlyRate ? Number(values.hourlyRate) : undefined,
                });
                console.log("Perfil actualizado:", updated);
                setSuccessMessage(true);
                resetForm();
                setTimeout(() => setSuccessMessage(false), 4000);
              } catch (error) {
                console.error("Error al guardar:", error);
              }
            }}
          >
            {({ values, isSubmitting, isValid, dirty }) => (
              <Form className="space-y-6">
                {successMessage && (
                  <div className="p-3 text-green-800 bg-green-100 border border-green-300 rounded-lg text-center">
                    REGISTRO CON ÉXITO
                  </div>
                )}

                <SectionTitle>Información básica</SectionTitle>
                <div className="items-center gap-4 mb-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 ml-3">
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">
                        <FaUserLarge size={40} />
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      className="w-full py-2 px-4 rounded-lg text-white font-medium shadow-md hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: brand.primary }}
                    >
                      Cambiar foto
                      <input type="file" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input name="firstName" placeholder="Sarah" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input name="lastName" placeholder="Mitchell" />
                  </div>
                </div>

                <Label htmlFor="phone">Teléfono</Label>
                <Input name="phone" placeholder="+54 11 1234 5678" />

                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input name="direccion" placeholder="Av. Siempre Viva 123" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pais">País</Label>
                    <Input name="pais" placeholder="Argentina" />
                  </div>
                  <div>
                    <Label htmlFor="localidad">Localidad</Label>
                    <Input name="localidad" placeholder="Miramar" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografía empresarial</Label>
                  <Field
                    as="textarea"
                    id="bio"
                    name="bio"
                    rows={3}
                    placeholder="Propietario y operador de SoundWaves Studio..."
                    className="w-full border border-gray-300 rounded-lg bg-white text-gray-800 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <HelpError name="bio" />
                </div>

                <SectionTitle>Zona de peligro</SectionTitle>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Borrar cuenta</span>
                    <p className="text-blue-500">
                      Eliminar permanentemente su cuenta y todos los datos
                    </p>
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      Borrar cuenta
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium shadow-md hover:opacity-90 ${
                      !isValid || !dirty ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{ backgroundColor: brand.primary }}
                  >
                    Guardar perfil
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
