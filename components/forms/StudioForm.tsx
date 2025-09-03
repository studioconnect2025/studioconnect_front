"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ReactNode } from "react";

const brand = {
  primary: "#015E88",
  light: "#F5F7FA",
};

// ----------------------
// Componentes auxiliares
// ----------------------

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

// VALIDACIONES CON YUP


const StudioSchema = Yup.object().shape({
  ownerName: Yup.string().required("Requerido"),
  ownerLastName: Yup.string().required("Requerido"),
  email: Yup.string().email("Email inválido").required("Requerido"),
  phone: Yup.string().required("Requerido"),
  studioName: Yup.string().required("Requerido"),
  address: Yup.string().required("Requerido"),
  city: Yup.string().required("Requerido"),
  openHour: Yup.string().required("Requerido"),
  closeHour: Yup.string().required("Requerido"),
  terms: Yup.boolean().oneOf([true], "Debes aceptar los términos"),
});

// SE HIZO FORMULARIO CON FORIMIK

export default function StudioConnectStudioForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h2
          className="text-xl font-bold text-center mb-6"
          style={{ color: brand.primary }}
        >
          Registro de Estudio/Sala
        </h2>

        <Formik
          initialValues={{
            ownerName: "",
            ownerLastName: "",
            email: "",
            phone: "",
            studioName: "",
            address: "",
            city: "",
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
          {() => (
            <Form className="space-y-6">
              {/* Info propietario */}
              <SectionTitle>Información del Propietario</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerName" required>
                    Nombre
                  </Label>
                  <Input name="ownerName" placeholder="Juan" />
                </div>
                <div>
                  <Label htmlFor="ownerLastName" required>
                    Apellido
                  </Label>
                  <Input name="ownerLastName" placeholder="Pérez" />
                </div>
              </div>
              <div>
                <Label htmlFor="email" required>
                  Email
                </Label>
                <Input name="email" type="email" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <Label htmlFor="phone" required>
                  Teléfono
                </Label>
                <Input name="phone" placeholder="+54 11 1234 5678" />
              </div>

              {/* Info estudio */}
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
                <Label htmlFor="city" required>
                  Ciudad
                </Label>
                <Input name="city" placeholder="Buenos Aires" />
              </div>

              {/* Horarios */}
              <SectionTitle>Disponibilidad</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="openHour" required>
                    Hora apertura
                  </Label>
                  <Input name="openHour" type="time" />
                </div>
                <div>
                  <Label htmlFor="closeHour" required>
                    Hora cierre
                  </Label>
                  <Input name="closeHour" type="time" />
                </div>
              </div>

              {/* Servicios */}
              <SectionTitle>Servicios</SectionTitle>
              <div className="flex flex-wrap gap-4">
                <Checkbox name="services" value="sala ensayo" label="Sala de ensayo" />
                <Checkbox name="services" value="sala grabacion" label="Sala de grabación" />
                <Checkbox name="services" value="sala estar" label="Sala de estar" />
                <Checkbox name="services" value="cafeteria" label="Cafetería" />
                <Checkbox name="services" value="estacionamiento" label="Estacionamiento" />
              </div>

              {/* Equipamiento */}
              <SectionTitle>Equipamiento</SectionTitle>
              <div className="flex flex-wrap gap-4">
                <Checkbox name="equipment" value="bateria" label="Batería" />
                <Checkbox name="equipment" value="guitarra" label="Guitarra" />
                <Checkbox name="equipment" value="bajo" label="Bajo" />
                <Checkbox name="equipment" value="microfonos" label="Micrófonos" />
                <Checkbox name="equipment" value="consola" label="Consola" />
              </div>

              {/* Términos */}
              <div className="flex items-center gap-2">
                <Field type="checkbox" name="terms" className="h-4 w-4" />
                <span className="text-sm text-gray-700">
                  Acepto los términos y condiciones
                </span>
              </div>
              <HelpError name="terms" />

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg text-white font-medium shadow-md hover:opacity-90"
                  style={{ backgroundColor: brand.primary }}
                >
                  Registrar estudio
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
