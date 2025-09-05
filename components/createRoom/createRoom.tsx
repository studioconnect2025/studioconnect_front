import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiUpload } from "react-icons/fi";

const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    tipo: Yup.string().required("Selecciona un tipo de sala"),
    capacidad: Yup.number()
        .required("La capacidad es obligatoria")
        .positive("Debe ser mayor a 0")
        .integer("Debe ser un número entero"),
    tamano: Yup.number()
        .required("El tamaño es obligatorio")
        .positive("Debe ser mayor a 0"),
    tarifa: Yup.number()
        .required("La tarifa es obligatoria")
        .positive("Debe ser mayor a 0"),
    reservaMinima: Yup.number()
        .required("La reserva mínima es obligatoria")
        .positive("Debe ser mayor a 0"),
    descripcion: Yup.string().required("La descripción es obligatoria"),
});

const CrearSala = () => {
    const [dias, setDias] = useState([
        { dia: "Lunes", inicio: "09:00", fin: "22:00" },
        { dia: "Martes", inicio: "09:00", fin: "22:00" },
        { dia: "Miércoles", inicio: "09:00", fin: "22:00" },
    ]);

    const agregarDia = () => {
        setDias([...dias, { dia: "", inicio: "09:00", fin: "22:00" }]);
    };

    const [equipos, setEquipos] = useState<string[]>([]);

    const toggleEquipo = (equipo: string) => {
        if (equipos.includes(equipo)) {
            setEquipos(equipos.filter((e) => e !== equipo));
        } else {
            setEquipos([...equipos, equipo]);
        }
    };

    return (
        <div className="max-w-4xl max-h-[70vh] ">
            <div className=" bg-white shadow-xl rounded-2xl p-5 md:p-6">
              <div>
                  <h2 className="text-2xl font-semibold text-sky-700 mb-2">
                    Agregar Nueva Sala
                </h2>
                <p className="text-gray-600 mb-6">
                    Crea una nueva sala de estudio con todos los detalles
                    necesarios y especificaciones del equipo
                </p>
              </div>

                <Formik
                    initialValues={{
                        nombre: "",
                        tipo: "",
                        capacidad: "",
                        tamano: "",
                        tarifa: "",
                        reservaMinima: "",
                        descripcion: "",
                        equipoPersonalizado: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        const nuevaSala = {
                            ...values,
                            dias,
                            equipos,
                        };

                        console.log("Sala guardada:", nuevaSala);

                        alert("Sala creada y guardada en consola");
                        resetForm();
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Columna izquierda */}
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Nombre de la Sala *
                                        </label>
                                        <Field
                                            type="text"
                                            name="nombre"
                                            placeholder="ej., Estudio A, Sala de Ensayo 1"
                                            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ErrorMessage
                                            name="nombre"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    <div className="text-gray-500">
                                        <label className="text-sm font-medium text-gray-700">
                                            Tipo de Sala *
                                        </label>
                                        <Field
                                            as="select"
                                            name="tipo"
                                            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">
                                                Selecciona el tipo de sala
                                            </option>
                                            <option value="estudio">
                                                Estudio
                                            </option>
                                            <option value="ensayo">
                                                Sala de Ensayo
                                            </option>
                                        </Field>
                                        <ErrorMessage
                                            name="tipo"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Capacidad *
                                            </label>
                                            <Field
                                                type="number"
                                                name="capacidad"
                                                placeholder="8"
                                                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <ErrorMessage
                                                name="capacidad"
                                                component="div"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                            \
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Tamaño (m²) *
                                            </label>
                                            <Field
                                                type="number"
                                                name="tamano"
                                                placeholder="40"
                                                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <ErrorMessage
                                                name="tamano"
                                                component="div"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Tarifa por Hora ($) *
                                            </label>
                                            <Field
                                                type="number"
                                                name="tarifa"
                                                placeholder="3500"
                                                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <ErrorMessage
                                                name="tarifa"
                                                component="div"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Reserva Mínima (horas) *
                                            </label>
                                            <Field
                                                type="number"
                                                name="reservaMinima"
                                                placeholder="2"
                                                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <ErrorMessage
                                                name="reservaMinima"
                                                component="div"
                                                className="text-red-500 text-xs mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Descripción *
                                        </label>
                                        <Field
                                            as="textarea"
                                            name="descripcion"
                                            placeholder="Describe la sala, su acústica y qué la hace especial..."
                                            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={4}
                                        />
                                        <ErrorMessage
                                            name="descripcion"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Columna derecha */}
                                <div className="flex flex-col gap-4">
                                    {/* Subir fotos */}
                                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 cursor-pointer">
                                        <FiUpload className="text-3xl mb-2" />
                                        <p>
                                            Haz clic para subir fotos o arrastra
                                            y suelta
                                        </p>
                                        <p className="text-xs">
                                            PNG, JPG hasta 10MB cada una
                                        </p>
                                    </div>

                                    {/* Equipo y características */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Equipo y Características
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 text-gray-700">
                                            {[
                                                "Consola de Grabación",
                                                "Pro Tools",
                                                "Micrófonos",
                                                "Instrumentos",
                                                "Tratamiento Acústico",
                                                "Aire Acondicionado",
                                            ].map((item, idx) => (
                                                <label
                                                    key={idx}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={equipos.includes(
                                                            item
                                                        )}
                                                        onChange={() =>
                                                            toggleEquipo(item)
                                                        }
                                                        className="accent-blue-500"
                                                    />
                                                    {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Equipo personalizado */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Equipo Personalizado
                                        </label>
                                        <Field
                                            as="textarea"
                                            name="equipoPersonalizado"
                                            placeholder="Lista cualquier equipo adicional o características especiales..."
                                            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={2}
                                        />
                                    </div>

                                    {/* Disponibilidad */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Disponibilidad
                                        </p>
                                        <div className="flex flex-col gap-2 text-gray-400">
                                            {dias.map((d, idx) => (
                                                <div
                                                    key={idx}
                                                    className="grid grid-cols-3 gap-2"
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Día"
                                                        value={d.dia}
                                                        onChange={(e) => {
                                                            const nuevosDias = [
                                                                ...dias,
                                                            ];
                                                            nuevosDias[
                                                                idx
                                                            ].dia =
                                                                e.target.value;
                                                            setDias(nuevosDias);
                                                        }}
                                                        className="p-2 border rounded-lg"
                                                    />
                                                    <input
                                                        type="time"
                                                        value={d.inicio}
                                                        className="p-2 border rounded-lg"
                                                        onChange={(e) => {
                                                            const nuevosDias = [
                                                                ...dias,
                                                            ];
                                                            nuevosDias[
                                                                idx
                                                            ].inicio =
                                                                e.target.value;
                                                            setDias(nuevosDias);
                                                        }}
                                                    />
                                                    <input
                                                        type="time"
                                                        value={d.fin}
                                                        className="p-2 border rounded-lg"
                                                        onChange={(e) => {
                                                            const nuevosDias = [
                                                                ...dias,
                                                            ];
                                                            nuevosDias[
                                                                idx
                                                            ].fin =
                                                                e.target.value;
                                                            setDias(nuevosDias);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={agregarDia}
                                                className="text-sky-600 text-sm hover:underline self-start mt-1"
                                            >
                                                + Agregar más días
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    type="reset"
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg bg-sky-700 text-white hover:bg-sky-500"
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

export default CrearSala;
