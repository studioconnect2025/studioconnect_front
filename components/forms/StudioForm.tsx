"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ReactNode, useState } from "react";
import { FaBuilding, FaCloudUploadAlt } from "react-icons/fa";
import { Link } from "lucide-react";
import ModalTerminos from "@/components/legal/ModalTerminos";
import TextoTerminos from "@/components/legal/TextoTerminos";

const brand = {
  primary: "#015E88",
  light: "#F5F7FA",
};

function SectionTitle({ children }: { children: ReactNode }) {
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
      className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <HelpError name={name} />
  </div>
);

const Checkbox = ({
  name,
  value,
  label,
}: {
  name: string;
  value: string;
  label: string;
}) => (
  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
    <Field type="checkbox" name={name} value={value} className="h-4 w-4" />
    {label}
  </label>
);

// VALIDACION CON YUP!

const StudioSchema = Yup.object().shape({
  firstName: Yup.string().required("Requerido"),
  lastName: Yup.string().required("Requerido"),
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string()
      .required("Requerido")
      .min(8, "Debe tener al menos 8 caracteres")
      .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Debe contener un caracter especial"),
  phoneNumber: Yup.string().required("Requerido"),
  studioName: Yup.string().required("Requerido"),
  address: Yup.string().required("Requerido"),
  city: Yup.string().required("Requerido"),
  province: Yup.string().required("Requerido"),
  description: Yup.string().required("Requerido"),
});

// Formulario con FOMIK

export default function StudioConnectStudioForm() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <div className="bg-sky-800 text-white py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <FaBuilding size={30} className="text-sky-700" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Registra tu estudio
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            Únete a nuestra red de estudios de grabación profesionales y
            conéctate con músicos de todo el mundo.
          </p>
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              phoneNumber: "",
              studioName: "",
              address: "",
              city: "",
              province: "",
              description: "",
              tarifaHora: "",
              tarifaDia: "",
              registroComercial: null,
              openHour: "",
              closeHour: "",
              services: [] as string[],
              equipment: [] as string[],
              terms: false,
            }}
            validationSchema={StudioSchema}
            onSubmit={(values) => {
              console.log("StudioConnect – form payload:", values);
              alert("Formulario enviado! Revisa la consola.");
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">
                <SectionTitle>Información del Propietario</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" required>
                      Nombre
                    </Label>
                    <Input name="firstName" placeholder="Juan" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" required>
                      Apellido
                    </Label>
                    <Input name="lastName" placeholder="Pérez" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" required>
                    Email
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password" required>
                    Contraseña
                  </Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="********"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber" required>
                    Teléfono
                  </Label>
                  <Input name="phoneNumber" placeholder="+54 11 1234 5678" />
                </div>

                <SectionTitle>Información del Estudio</SectionTitle>
                <div>
                  <Label htmlFor="studioName" required>
                    Nombre del estudio
                  </Label>
                  <Input name="studioName" placeholder="Studio Connect" />
                </div>
                <div>
                  <Label htmlFor="address" required>
                    Dirección
                  </Label>
                  <Input name="address" placeholder="Av. Siempre Viva 123" />
                </div>
                
                <div>
                  <Label htmlFor="province" required>
                    Provincia
                  </Label>
                  <Input name="province" placeholder="Buenos Aires" />
                </div>
                <div>
                  <Label htmlFor="city" required>
                    Ciudad
                  </Label>
                  <Input name="city" placeholder="Capital Federal" />
                </div>


                <div>
                  <Label htmlFor="description" required>
                    Descripción del estudio
                  </Label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    placeholder="Contanos sobre tu sala o estudio..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <HelpError name="description" />
                </div>
                

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-lg text-white font-medium shadow-md hover:opacity-90"
                    style={{ backgroundColor: brand.primary }}
                  >
                    Registrar tu estudio
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
