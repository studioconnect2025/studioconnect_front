"use client";

import React, { ReactNode, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaBuilding, FaCloudUploadAlt } from "react-icons/fa";
import ModalTerminos from "@/components/legal/ModalTerminos";
import TextoTerminos from "@/components/legal/TextoTerminos";
import { useRouter } from "next/navigation";
import { registerStudio } from "@/services/registerStudio.services";

const brand = { primary: "#015E88", light: "#F5F7FA" };

export function SectionTitle({ children }: { children: ReactNode }) {
    return (
        <h3 className="text-2xl md:text-base font-semibold text-gray-700 mb-3">
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
            {children}{" "}
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
    <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full border cursor-pointer border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
);

const Checkbox = ({ name, value, label }: any) => (
    <label className="flex items-center gap-2 text-gray-800">
        <Field
            type="checkbox"
            name={name}
            value={value}
            className="h-4 w-4 cursor-pointer"
        />
        <span className="text-sm">{label}</span>
    </label>
);

const ProfileOwnerSchema = Yup.object().shape({
    name: Yup.string().required("Requerido").max(100),
    pais: Yup.string().required("Requerido"),
    codigoPostal: Yup.string().required("Requerido"),
    city: Yup.string().required("Requerido"),
    province: Yup.string().required("Requerido"),
    address: Yup.string().required("Requerido"),
    description: Yup.string().required("Requerido").max(500),
    studioType: Yup.string().required("Requerido"),
    services: Yup.array().min(1, "Selecciona al menos un servicio"),
    openingTime: Yup.string().required("Requerido"),
    closingTime: Yup.string().required("Requerido"),
    photos: Yup.array()
        .min(1, "Debes subir al menos 1 imagen")
        .max(5, "Máximo 5 imágenes"),
    comercialRegister: Yup.mixed().required("Debes subir un archivo"),
    terms: Yup.boolean().oneOf([true], "Debes aceptar los términos"),
});

export default function RegisterPage() {
    const [openModal, setOpenModal] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const router = useRouter();

    const initialValues = {
        name: "",
        pais: "",
        codigoPostal: "",
        city: "",
        province: "",
        address: "",
        description: "",
        studioType: "",
        services: [] as string[],
        openingTime: "",
        closingTime: "",
        comercialRegister: null as File | null,
        photos: [] as File[],
        availableEquipment: [] as string[],
        terms: false,
    };

    const studioTypes = [
        { label: "Grabación", value: "grabacion" },
        { label: "Ensayo", value: "ensayo" },
        { label: "Producción", value: "produccion" },
    ];

    const servicesList = [
        "Sala de grabación",
        "Sala de ensayo",
        "Sala de producción",
        "Cafetería",
        "Estacionamiento",
    ];

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const files = {
                photos: values.photos,
                comercialRegister: values.comercialRegister,
            };

            const dataToSend = { ...values };

            await registerStudio(dataToSend, files);

            setMessage({
                type: "success",
                text: "¡Estudio registrado correctamente!",
            });
            setTimeout(() => router.push("/myStudio"), 2000);
        } catch (err: any) {
            setMessage({
                type: "error",
                text: "Error al registrar estudio. Por favor, inténtalo de nuevo.",
            });
            console.error(
                " Error registrando estudio:",
                err.response?.data || err.message
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            {/* HEADER */}
            <div className="bg-sky-800 text-white py-10 px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                            <FaBuilding size={40} className="text-sky-700" />
                        </div>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Registro de estudio
                    </h1>
                    <p className="mt-2 text-sm md:text-base text-gray-200">
                        Únete a nuestra red de estudios de grabación
                        profesionales y conéctate con músicos de todo el mundo.
                    </p>
                </div>
            </div>

            {/* FORM */}
            <div className="flex justify-center bg-gray-100 px-4 py-5 items-center">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg ml-2 p-6">
                    {message && (
                        <div
                            className={`p-3 mb-4 rounded-lg text-sm text-center font-medium ${
                                message.type === "success"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={ProfileOwnerSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue, isSubmitting }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Columna izquierda */}
                                <div className="space-y-3">
                                    <SectionTitle>
                                        Información del estudio
                                    </SectionTitle>

                                    <div>
                                        <Label htmlFor="name" required>
                                            Nombre del estudio
                                        </Label>
                                        <Input
                                            name="name"
                                            placeholder="Mi Estudio"
                                        />
                                        <HelpError name="name" />
                                    </div>

                                    <div>
                                        <Label htmlFor="pais" required>
                                            País
                                        </Label>
                                        <Input
                                            name="pais"
                                            placeholder="Argentina"
                                        />
                                        <HelpError name="pais" />
                                    </div>

                                    <div>
                                        <Label htmlFor="codigoPostal" required>
                                            Código Postal
                                        </Label>
                                        <Input
                                            name="codigoPostal"
                                            placeholder="C1000"
                                        />
                                        <HelpError name="codigoPostal" />
                                    </div>

                                    <div>
                                        <Label htmlFor="city" required>
                                            Ciudad
                                        </Label>
                                        <Input
                                            name="city"
                                            placeholder="Buenos Aires"
                                        />
                                        <HelpError name="city" />
                                    </div>

                                    <div>
                                        <Label htmlFor="province" required>
                                            Provincia
                                        </Label>
                                        <Input
                                            name="province"
                                            placeholder="Buenos Aires"
                                        />
                                        <HelpError name="province" />
                                    </div>

                                    <div>
                                        <Label htmlFor="address" required>
                                            Dirección
                                        </Label>
                                        <Input
                                            name="address"
                                            placeholder="Av. Siempre Viva 123"
                                        />
                                        <HelpError name="address" />
                                    </div>

                                    <div>
                                        <Label htmlFor="description" required>
                                            Descripción
                                        </Label>
                                        <Field
                                            as="textarea"
                                            name="description"
                                            placeholder="Describe tu estudio..."
                                            className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <HelpError name="description" />
                                    </div>

                                    <div>
                                        <Label htmlFor="studioType" required>
                                            Tipo de estudio
                                        </Label>
                                        <Field
                                            as="select"
                                            name="studioType"
                                            className="w-full cursor-pointer border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm"
                                        >
                                            <option value="">
                                                Seleccione...
                                            </option>
                                            {studioTypes.map((type) => (
                                                <option
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <HelpError name="studioType" />
                                    </div>
                                </div>

                                {/* Columna derecha */}
                                <div className="space-y-3">
                                    <SectionTitle>
                                        Fotos del estudio
                                    </SectionTitle>
                                    <Label htmlFor="photos" required>
                                        Sube hasta 5 fotos
                                    </Label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(event) => {
                                            const files =
                                                event.currentTarget.files;
                                            if (files)
                                                setFieldValue(
                                                    "photos",
                                                    Array.from(files).slice(
                                                        0,
                                                        5
                                                    )
                                                );
                                        }}
                                        className="w-full border border-gray-300 rounded-lg bg-white px-3 py-3 cursor-pointer text-sm"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {values.photos?.map(
                                            (file: File, index: number) => (
                                                <img
                                                    key={index}
                                                    src={URL.createObjectURL(
                                                        file
                                                    )}
                                                    alt={`preview-${index}`}
                                                    className="w-24 h-24 object-cover rounded"
                                                />
                                            )
                                        )}
                                    </div>
                                    <HelpError name="photos" />

                                    <SectionTitle>Servicios</SectionTitle>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {servicesList.map((s) => (
                                            <Checkbox
                                                key={s}
                                                name="services"
                                                value={s}
                                                label={s}
                                            />
                                        ))}
                                    </div>
                                    <HelpError name="services" />

                                    <SectionTitle>Horarios</SectionTitle>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                htmlFor="openingTime"
                                                required
                                            >
                                                Hora de apertura
                                            </Label>
                                            <Input
                                                name="openingTime"
                                                type="time"
                                            />
                                            <HelpError name="openingTime" />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="closingTime"
                                                required
                                            >
                                                Hora de cierre
                                            </Label>
                                            <Input
                                                name="closingTime"
                                                type="time"
                                            />
                                            <HelpError name="closingTime" />
                                        </div>
                                    </div>

                                    <SectionTitle>
                                        Registro Comercial
                                    </SectionTitle>
                                    <div className="border-2 border-dashed border-sky-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                                        <input
                                            id="comercialRegister"
                                            name="comercialRegister"
                                            type="file"
                                            accept="application/pdf,image/*"
                                            className="hidden"
                                            onChange={(event) =>
                                                setFieldValue(
                                                    "comercialRegister",
                                                    event.currentTarget
                                                        .files?.[0]
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="comercialRegister"
                                            className="text-gray-800 cursor-pointer"
                                        >
                                            <FaCloudUploadAlt
                                                size={40}
                                                className="mx-auto items-center"
                                            />
                                            Suelta tu archivo aquí o haz clic
                                            para subir (PDF o imagen)
                                        </label>
                                        <HelpError name="comercialRegister" />
                                    </div>

                                    <div className="flex mt-5 items-center gap-2">
                                        <Field
                                            type="checkbox"
                                            name="terms"
                                            className="h-4 w-4 cursor-pointer"
                                        />
                                        <span className="text-gray-800 text-sm">
                                            Acepto los{" "}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenModal(true)
                                                }
                                                className="text-sky-700 cursor-pointer underline hover:text-sky-900"
                                            >
                                                términos y condiciones
                                            </button>
                                        </span>
                                    </div>
                                    <HelpError name="terms" />
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 px-4 cursor-pointer rounded-lg text-white font-medium shadow-md hover:opacity-90"
                                        style={{
                                            backgroundColor: brand.primary,
                                        }}
                                    >
                                        {isSubmitting
                                            ? "Registrando..."
                                            : "Registrar mi estudio"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            <ModalTerminos
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
            >
                <TextoTerminos />
            </ModalTerminos>
        </div>
    );
}
