"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { registerStudioOwner } from "@/services/register.services";

/* =============================
   Types
============================= */
type Provincia = { nombre: string };
type Localidad = { nombre: string };

export type OwnerRegisterFormValues = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  numeroDeTelefono: string;
  pais: string;
  provincia: string;
  ciudad: string;
  calle: string;
  codigoPostal: string;
};

type DefaultValues = {
  nombre: string;
  apellido: string;
  email: string;
};

type OwnerRegisterFormProps = {
  defaultValues?: DefaultValues;
};

/* =============================
   Validación Yup
============================= */
const OwnerSchema = Yup.object().shape({
  nombre: Yup.string().required("Campo requerido"),
  apellido: Yup.string().required("Campo requerido"),
  email: Yup.string().email("Email inválido").required("Campo requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Campo requerido"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Campo requerido"),
  numeroDeTelefono: Yup.string().required("Campo requerido"),
  pais: Yup.string().required("Campo requerido"),
  provincia: Yup.string().required("Campo requerido"),
  ciudad: Yup.string().required("Campo requerido"),
  calle: Yup.string().required("Campo requerido"),
  codigoPostal: Yup.string().required("Campo requerido"),
});

/* =============================
   API externa (Argentina)
============================= */
async function fetchProvincias(pais: string): Promise<Provincia[]> {
  if (pais !== "Argentina") return [];
  const res = await fetch("https://apis.datos.gob.ar/georef/api/provincias");
  const data = await res.json();
  return data.provincias;
}

async function fetchLocalidades(pais: string, provincia: string): Promise<Localidad[]> {
  if (pais !== "Argentina") return [];
  const res = await fetch(
    `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia}&max=1000`
  );
  const data = await res.json();
  return data.localidades;
}

/* =============================
   Componente principal
============================= */
export default function OwnerRegisterForm({ defaultValues }: OwnerRegisterFormProps) {
  const [paises] = useState(["Argentina"]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState("Argentina");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<string>("");
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);

  /* Efecto para provincias */
  useEffect(() => {
    fetchProvincias(paisSeleccionado).then(setProvincias);
    setProvinciaSeleccionada("");
    setLocalidades([]);
  }, [paisSeleccionado]);

  /* Efecto para localidades */
  useEffect(() => {
    if (!provinciaSeleccionada) return;
    setLoadingLocalidades(true);
    fetchLocalidades(paisSeleccionado, provinciaSeleccionada)
      .then(setLocalidades)
      .finally(() => setLoadingLocalidades(false));
  }, [provinciaSeleccionada, paisSeleccionado]);

  return (
    <Formik<OwnerRegisterFormValues>
      initialValues={{
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
      }}
      validationSchema={OwnerSchema}
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
        }
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full space-y-4">
          <h1 className="text-xl font-bold text-center">Registro de Estudio</h1>

          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block font-medium">Nombre</label>
            <Field name="nombre" className="border p-2 rounded w-full" />
            <ErrorMessage name="nombre" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Apellido */}
          <div>
            <label htmlFor="apellido" className="block font-medium">Apellido</label>
            <Field name="apellido" className="border p-2 rounded w-full" />
            <ErrorMessage name="apellido" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-medium">Email</label>
            <Field type="email" name="email" className="border p-2 rounded w-full" />
            <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-medium">Contraseña</label>
            <Field type="password" name="password" className="border p-2 rounded w-full" />
            <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block font-medium">Confirmar contraseña</label>
            <Field type="password" name="confirmPassword" className="border p-2 rounded w-full" />
            <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="numeroDeTelefono" className="block font-medium">Número de teléfono</label>
            <Field name="numeroDeTelefono" className="border p-2 rounded w-full" />
            <ErrorMessage name="numeroDeTelefono" component="p" className="text-red-500 text-sm" />
          </div>

          {/* País */}
          <div>
            <label htmlFor="pais" className="block font-medium">País</label>
            <Field
              as="select"
              name="pais"
              className="border p-2 rounded w-full"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setPaisSeleccionado(e.target.value);
                setFieldValue("pais", e.target.value);
              }}
            >
              {paises.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Field>
            <ErrorMessage name="pais" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Provincia */}
          <div>
            <label htmlFor="provincia" className="block font-medium">Provincia</label>
            <Field
              as="select"
              name="provincia"
              className="border p-2 rounded w-full"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setProvinciaSeleccionada(e.target.value);
                setFieldValue("provincia", e.target.value);
              }}
            >
              <option value="">Seleccionar</option>
              {provincias.map((prov) => (
                <option key={prov.nombre} value={prov.nombre}>{prov.nombre}</option>
              ))}
            </Field>
            <ErrorMessage name="provincia" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Ciudad */}
          <div>
            <label htmlFor="ciudad" className="block font-medium">Ciudad</label>
            <Field as="select" name="ciudad" className="border p-2 rounded w-full">
              <option value="">{loadingLocalidades ? "Cargando..." : "Seleccionar"}</option>
              {localidades.map((loc) => (
                <option key={loc.nombre} value={loc.nombre}>{loc.nombre}</option>
              ))}
            </Field>
            <ErrorMessage name="ciudad" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Calle */}
          <div>
            <label htmlFor="calle" className="block font-medium">Calle</label>
            <Field name="calle" className="border p-2 rounded w-full" />
            <ErrorMessage name="calle" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Código Postal */}
          <div>
            <label htmlFor="codigoPostal" className="block font-medium">Código Postal</label>
            <Field name="codigoPostal" className="border p-2 rounded w-full" />
            <ErrorMessage name="codigoPostal" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
