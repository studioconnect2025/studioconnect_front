"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { roomsService } from "@/services/rooms.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    tipo: Yup.string().required("Selecciona un tipo de sala"),
    capacidad: Yup.number().required().positive().integer(),
    tamano: Yup.number().required().positive(),
    tarifa: Yup.number().required().positive(),
    reservaMinima: Yup.number().required().positive(),
    descripcion: Yup.string().required("La descripción es obligatoria"),
    customEquipment: Yup.string(),
});

const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];

const CrearSalaForm = () => {
    const router = useRouter();
    const [equipos, setEquipos] = useState<string[]>([]);
    const [fotos, setFotos] = useState<File[]>([]);
    const [dias, setDias] = useState<
        { dia: string; inicio: string; fin: string }[]
    >([]);

    const toggleEquipo = (equipo: string) => {
        setEquipos((prev) =>
            prev.includes(equipo)
                ? prev.filter((e) => e !== equipo)
                : [...prev, equipo]
        );
    };

    const agregarDia = () =>
        setDias([...dias, { dia: "Lunes", inicio: "09:00", fin: "22:00" }]);
    const eliminarDia = (index: number) =>
        setDias(dias.filter((_, i) => i !== index));
    const handleDiasChange = (
        index: number,
        field: "dia" | "inicio" | "fin",
        value: string
    ) => {
        setDias((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    return (
        <div className="w-screen bg-gray-50 p-8 overflow-auto mt-10">
            <ToastContainer />
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-5xl mx-auto">
                <h2 className="text-3xl font-semibold text-sky-700 mb-4">
                    Agregar Nueva Sala
                </h2>
                <p className="text-gray-600 mb-6">
                    Crea una nueva sala de estudio con todos los detalles
                    necesarios y especificaciones del equipo
                </p>

                <Formik
                    initialValues={{
                        nombre: "",
                        tipo: "",
                        capacidad: 0,
                        tamano: 0,
                        tarifa: 0,
                        reservaMinima: 0,
                        descripcion: "",
                        customEquipment: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm, setSubmitting }) => {
                        try {
                            const token = localStorage.getItem("accessToken");
                            if (!token) throw new Error("Usuario no logueado");

                            const roomPayload = {
                                name: values.nombre,
                                type: values.tipo,
                                capacity: Number(values.capacidad),
                                size: Number(values.tamano),
                                pricePerHour: Number(values.tarifa),
                                minHours: Number(values.reservaMinima),
                                description: values.descripcion,
                                features: equipos,
                                customEquipment: values.customEquipment,
                                availability: dias.reduce((acc, curr) => {
                                    acc[curr.dia] = {
                                        start: curr.inicio,
                                        end: curr.fin,
                                    };
                                    return acc;
                                }, {} as Record<string, { start: string; end: string }>),
                            };

                            const createdRoom = await roomsService.createRoom({
                                token, 
                                roomData: roomPayload,
                            });

                            if (fotos.length > 0) {
                                const formData = new FormData();
                                fotos.forEach((file) =>
                                    formData.append("images", file)
                                );
                                await roomsService.uploadRoomImages({
                                    roomId: createdRoom.id,
                                    imagesFormData: formData,
                                });
                            }

                            toast.success("Sala creada exitosamente");
                            resetForm();
                            setEquipos([]);
                            setFotos([]);
                            setDias([]);

                            // Redirigir después de 2 segundos
                            setTimeout(() => router.push("/studioRooms"), 2000);
                        } catch (error) {
                            console.error("Error creando sala:", error);
                            toast.error("No se pudo crear la sala");
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({
                        values,
                        handleChange,
                        setFieldValue,
                        isSubmitting,
                    }) => (
                        <Form className="space-y-6">
                            {/* Campos básicos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700">
                                        Nombre
                                    </label>
                                    <Field
                                        type="text"
                                        name="nombre"
                                        value={values.nombre}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded text-gray-700"
                                    />
                                    <ErrorMessage
                                        name="nombre"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">
                                        Tipo
                                    </label>
                                    <Field
                                        as="select"
                                        name="tipo"
                                        value={values.tipo}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded text-gray-700"
                                    >
                                        <option value="">Selecciona</option>
                                        <option value="grabacion">
                                            Grabación
                                        </option>
                                        <option value="ensayo">Ensayo</option>
                                        <option value="produccion">
                                            Producción
                                        </option>
                                    </Field>
                                    <ErrorMessage
                                        name="tipo"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">
                                        Capacidad
                                    </label>
                                    <Field
                                        type="number"
                                        name="capacidad"
                                        value={values.capacidad}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded text-gray-700"
                                    />
                                    <ErrorMessage
                                        name="capacidad"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">
                                        Tamaño (m²)
                                    </label>
                                    <Field
                                        type="number"
                                        name="tamano"
                                        value={values.tamano}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded text-gray-700"
                                    />
                                    <ErrorMessage
                                        name="tamano"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">
                                        Tarifa por hora
                                    </label>
                                    <Field name="tarifa">
                                        {({ field }: any) => (
                                            <input
                                                {...field}
                                                type="text"
                                                value={
                                                    field.value
                                                        ? "$" +
                                                          new Intl.NumberFormat(
                                                              "es-AR",
                                                              {
                                                                  minimumFractionDigits: 0,
                                                              }
                                                          ).format(field.value)
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    const numericValue =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            ""
                                                        );
                                                    setFieldValue(
                                                        "tarifa",
                                                        numericValue
                                                            ? parseInt(
                                                                  numericValue
                                                              )
                                                            : 0
                                                    );
                                                }}
                                                className="w-full p-2 border rounded text-gray-700"
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="tarifa"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700">
                                        Horas mínimas de reserva
                                    </label>
                                    <Field
                                        type="number"
                                        name="reservaMinima"
                                        value={values.reservaMinima}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded text-gray-700"
                                    />
                                    <ErrorMessage
                                        name="reservaMinima"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="block text-gray-700">
                                    Descripción
                                </label>
                                <Field
                                    as="textarea"
                                    name="descripcion"
                                    value={values.descripcion}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded text-gray-700"
                                    rows={3}
                                />
                                <ErrorMessage
                                    name="descripcion"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-gray-700 mb-2">
                                    Equipos
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {[
                                        "Micrófono",
                                        "Amplificador",
                                        "Consola",
                                        "Acondicionamiento acústico",
                                        "Cables y conectores",
                                        "Interfaces de audio",
                                    ].map((eq) => (
                                        <button
                                            type="button"
                                            key={eq}
                                            onClick={() => toggleEquipo(eq)}
                                            className={`px-2 py-1 border rounded ${
                                                equipos.includes(eq)
                                                    ? "bg-sky-700 text-white"
                                                    : "bg-white text-gray-700"
                                            }`}
                                        >
                                            {eq}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Equipo personalizado */}
                            <div>
                                <label className="block text-gray-700">
                                    Equipo personalizado
                                </label>
                                <Field
                                    type="text"
                                    name="customEquipment"
                                    value={values.customEquipment}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded text-gray-700"
                                />
                            </div>

                            {/* Fotos */}
                            <div>
                                <label className="block text-gray-700">
                                    Fotos de la sala
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                        setFotos(
                                            e.target.files
                                                ? Array.from(e.target.files)
                                                : []
                                        )
                                    }
                                    className="w-full p-2 border rounded text-gray-700"
                                />
                            </div>

                            {/* Disponibilidad dinámica */}
                            <div>
                                <label className="block text-gray-700 mb-2">
                                    Disponibilidad de la sala
                                </label>
                                {dias.map((d, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 mb-2"
                                    >
                                        <select
                                            value={d.dia}
                                            onChange={(e) =>
                                                handleDiasChange(
                                                    idx,
                                                    "dia",
                                                    e.target.value
                                                )
                                            }
                                            className="p-1 border rounded text-gray-700"
                                        >
                                            {diasSemana.map((day) => (
                                                <option key={day} value={day}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="time"
                                            value={d.inicio}
                                            onChange={(e) =>
                                                handleDiasChange(
                                                    idx,
                                                    "inicio",
                                                    e.target.value
                                                )
                                            }
                                            className="p-1 border rounded text-gray-700"
                                        />
                                        <input
                                            type="time"
                                            value={d.fin}
                                            onChange={(e) =>
                                                handleDiasChange(
                                                    idx,
                                                    "fin",
                                                    e.target.value
                                                )
                                            }
                                            className="p-1 border rounded text-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => eliminarDia(idx)}
                                            className="text-red-500 px-2"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={agregarDia}
                                    className="px-3 py-1 bg-sky-700 text-white rounded"
                                >
                                    Agregar día
                                </button>
                            </div>

                            {/* Botón enviar */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg cursor-pointer bg-sky-700 text-white hover:bg-sky-500"
                                >
                                    {isSubmitting
                                        ? "Enviando..."
                                        : "Crear Sala"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CrearSalaForm;
