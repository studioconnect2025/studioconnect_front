"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "@/components/ui/Input";
import { useState } from "react";

// Validación Yup
const studioSchema = Yup.object().shape({
  nombrePropietario: Yup.string().required("El nombre es obligatorio"),
  nombreEstudio: Yup.string().required("El nombre del estudio es obligatorio"),
  descripcion: Yup.string().required("La descripción es obligatoria"),
  tarifaHora: Yup.number().min(0, "Debe ser mayor o igual a 0"),
  tarifaDia: Yup.number().min(0, "Debe ser mayor o igual a 0"),
  horarioDesde: Yup.string().required("Campo obligatorio"),
  horarioHasta: Yup.string().required("Campo obligatorio"),
  registroComercial: Yup.mixed().required("El comprobante es obligatorio"),
  aceptaTerminos: Yup.boolean().oneOf([true], "Debes aceptar los términos"),
});

export default function StudioForm() {
  const [archivo, setArchivo] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setArchivo(event.target.files[0]);
    }
  };

  return (
    <Formik
      initialValues={{
        nombrePropietario: "",
        nombreEstudio: "",
        descripcion: "",
        tarifaHora: 0,
        tarifaDia: 0,
        horarioDesde: "",
        horarioHasta: "",
        registroComercial: null,
        aceptaTerminos: false,
      }}
      validationSchema={studioSchema}
      onSubmit={(values) => {
        console.log("Datos enviados:", values);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-6 bg-white p-6 rounded-2xl shadow-md">

          <Input name="nombrePropietario" label="Nombre del propietario" />

          <Input name="nombreEstudio" label="Nombre del estudio" />

          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción del estudio/sala
            </label>
            <Field
              as="textarea"
              name="descripcion"
              className="w-full border rounded-lg p-2 h-28 focus:ring focus:ring-blue-300"
              placeholder="Describe tu estudio o sala..."
            />
            <ErrorMessage
              name="descripcion"
              component="p"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Tarifas */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="tarifaHora"
              label="Tarifa por hora ($)"
              type="number"
            />
            <Input
              name="tarifaDia"
              label="Tarifa diaria ($)"
              type="number"
            />
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <Input name="horarioDesde" label="Horario desde" type="time" />
            <Input name="horarioHasta" label="Horario hasta" type="time" />
          </div>

          {/* Upload comprobante */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Comprobante de registro comercial
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id="registroComercial"
                name="registroComercial"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  handleFileChange(e);
                  setFieldValue("registroComercial", e.target.files?.[0] || null);
                }}
                className="hidden"
              />
              <label
                htmlFor="registroComercial"
                className="cursor-pointer text-blue-600 hover:underline"
              >
                {archivo ? archivo.name : "Sueltá tu PDF aquí o haz clic para subir"}
              </label>
            </div>
            <ErrorMessage
              name="registroComercial"
              component="p"
              className="text-red-500 text-sm mt-1"
            />
          </div>


          <div className="flex items-center gap-2">
            <Field type="checkbox" name="aceptaTerminos" />
            <label className="text-sm">
              Estoy de acuerdo con los{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Términos de servicio
              </a>{" "}
              y la{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Política de privacidad
              </a>
            </label>
          </div>
          <ErrorMessage
            name="aceptaTerminos"
            component="p"
            className="text-red-500 text-sm"
          />

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Registrar Estudio/Sala
          </button>
        </Form>
      )}
    </Formik>
  );
}
