"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ReactNode, useState } from "react";
import { FaBuilding, FaCloudUploadAlt } from "react-icons/fa";
import ModalTerminos from "@/components/legal/ModalTerminos";
import TextoTerminos from "@/components/legal/TextoTerminos";
import { FaUserLarge } from "react-icons/fa6";

const brand = {
    primary: "#015E88",
    light: "#F5F7FA",
};

type SectionTitleProps = {
    children: React.ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
    return (
        <div className=" rounded-lg ">
            <h2 className="text-xl font-bold text-gray-700">{children}</h2>
        </div>
    );
}

function Label({
    htmlFor,
    children,
    required,
}: {
    htmlFor?: string;
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
            className="w-full border border-gray-300 rounded-lg bg-white text-gray-800 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    <label className="flex items-center gap-2">
        <Field type="checkbox" name={name} value={value} className="h-4 w-4" />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);

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
    hourlyRate: Yup.number()
        .typeError("Debe ser un número")
        .required("Requerido"),
    minDuration: Yup.string().required("Requerido"),
    preBooking: Yup.string().required("Requerido"),
    cancellation: Yup.string().required("Requerido"),
    openWeek: Yup.string().required("Requerido"),
    closeWeek: Yup.string().required("Requerido"),
    openWeekend: Yup.string().required("Requerido"),
    closeWeekend: Yup.string().required("Requerido"),
    tarifaHora: Yup.number()
        .typeError("Debe ser un número")
        .required("Requerido"),
    tarifaDia: Yup.number()
        .typeError("Debe ser un número")
        .required("Requerido"),
    registroComercial: Yup.mixed().required("Debes subir un archivo"),
    openHour: Yup.string().required("Requerido"),
    closeHour: Yup.string().required("Requerido"),
    terms: Yup.boolean().oneOf([true], "Debes aceptar los términos"),
});

const specializationsList = ["Grabacion", "Mezcla", "Mastering", "Produccion"];

type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
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
    const [tempStore, setTempStore] = useState<FormValues | null>(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePic(URL.createObjectURL(e.target.files[0]));
        }
    };

    // Simulación de funciones de botones
    const handleAction = (action: string) => {
        console.log(`Acción ejecutada: ${action}`);
        alert(`Acción ejecutada: ${action}`);
    };

    const initialValues: FormValues = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
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
                        Administra la información de tu estudio y la
                        configuración de tu negocio
                    </p>
                </div>
            </div>

            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
                <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
                    <Formik<FormValues>
                        initialValues={initialValues}
                        validationSchema={ProfileOwnerSchema}
                        onSubmit={(values, { resetForm }) => {
                            setTempStore(values);
                            console.log(
                                "Profile Owner – form payload (guardado):",
                                values
                            );

                            setSuccessMessage(true);
                            resetForm();
                            setTimeout(() => setSuccessMessage(false), 4000);
                        }}
                    >
                        {({
                            values,
                            setFieldValue,
                            isSubmitting,
                            isValid,
                            dirty,
                            errors,
                            touched,
                        }) => (
                            <Form className="space-y-6">
                                {successMessage && (
                                    <div className="p-3 text-green-800 bg-green-100 border border-green-300 rounded-lg text-center">
                                        REGISTRO CON ÉXITO
                                    </div>
                                )}
                                {Object.keys(errors).length > 0 &&
                                    Object.keys(touched).length > 0 && (
                                        <div className="p-3 text-red-800 bg-red-100 border border-red-300 rounded-lg text-center">
                                            Debes completar todos los datos
                                            requeridos.
                                        </div>
                                    )}

                                <SectionTitle>Información básica</SectionTitle>
                                <div className=" items-center gap-4 mb-4">
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
                                            style={{
                                                backgroundColor: brand.primary,
                                            }}
                                        >
                                            Cambiar foto
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handlePhotoUpload}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName" required>
                                            Nombre
                                        </Label>
                                        <Input
                                            name="firstName"
                                            placeholder="Sarah"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName" required>
                                            Apellido
                                        </Label>
                                        <Input
                                            name="lastName"
                                            placeholder="Mitchell"
                                        />
                                    </div>
                                </div>
                                <Label htmlFor="email" required>
                                    Email
                                </Label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                />
                                <Label htmlFor="phone" required>
                                    Teléfono
                                </Label>
                                <Input
                                    name="phone"
                                    placeholder="+54 11 1234 5678"
                                />
                                <div>
                                    <Label htmlFor="bio" required>
                                        Biografía empresarial
                                    </Label>
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

                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            console.log(
                                                "Editar Perfil (valores actuales):",
                                                values
                                            )
                                        }
                                        className="py-2 px-2 rounded-lg text-white font-medium shadow-md hover:opacity-90 cursor-pointer w-max self-end"
                                        style={{
                                            backgroundColor: brand.primary,
                                        }}
                                    >
                                        Editar Perfil
                                    </button>
                                </div>

                                <SectionTitle>
                                    Seguridad de la cuenta
                                </SectionTitle>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-500">
                                            Contraseña
                                        </span>
                                        <p className="text-sm text-gray-400">
                                            Última actualización hace 2 meses
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAction(
                                                    "Cambiar contraseña"
                                                )
                                            }
                                            className="px-3 py-1 rounded bg-blue-500 text-white"
                                        >
                                            Cambiar la contraseña
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-500">
                                            Autenticación de dos factores
                                        </span>
                                        <p className="text-sm text-gray-400">
                                            Asegure su cuenta comercial
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAction(
                                                    "Autenticación de dos factores"
                                                )
                                            }
                                            className="px-3 py-1 rounded bg-blue-500 text-white"
                                        >
                                            Permitir
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">
                                            Actividad de inicio de sesión
                                        </span>
                                        <p className="text-sm text-gray-400">
                                            Monitorear el acceso a la cuenta
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAction("Ver actividad")
                                            }
                                            className="px-3 py-1 rounded bg-blue-500 text-white"
                                        >
                                            Ver actividad
                                        </button>
                                    </div>
                                </div>

                                <SectionTitle>Zona de peligro</SectionTitle>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-700">
                                            Desactivar el listado de estudios
                                        </span>
                                        <p className="text-blue-500">
                                            Ocultar temporalmente su estudio de
                                            las búsquedas
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAction(
                                                    "Desactivar listado"
                                                )
                                            }
                                            className="px-3 py-1 rounded bg-gray-600 text-white"
                                        >
                                            Desactivar
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">
                                            Borrar cuenta
                                        </span>
                                        <p className="text-blue-500">
                                            Eliminar permanentemente su cuenta y
                                            todos los datos
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAction("Borrar cuenta")
                                            }
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
                                            !isValid || !dirty
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                        style={{
                                            backgroundColor: brand.primary,
                                        }}
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
