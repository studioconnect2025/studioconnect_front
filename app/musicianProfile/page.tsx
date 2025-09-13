"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { profileService } from "@/services/musician.services";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const passwordSchema = Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida");

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [originalData, setOriginalData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true); // 👈 loading

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        ciudad: "",
        provincia: "",
        calle: "",
        codigoPostal: "",
        telefono: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await profileService.getMyProfile();
                const profile = data.profile;

                if (profile) {
                    const loadedData = {
                        nombre: profile.nombre || "",
                        apellido: profile.apellido || "",
                        ciudad: profile.ciudad || "",
                        provincia: profile.provincia || "",
                        calle: profile.calle || "",
                        codigoPostal: profile.codigoPostal || "",
                        telefono: profile.numeroDeTelefono || "",
                    };
                    setFormData(loadedData);
                    setOriginalData(loadedData);
                }

                setProfilePic(data.profileImageUrl || null);
            } catch (error) {
                console.error("Error cargando perfil:", error);
                toast.error("Error cargando perfil");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                profile: {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    numeroDeTelefono: formData.telefono,
                    ciudad: formData.ciudad,
                    provincia: formData.provincia,
                    calle: formData.calle,
                    codigoPostal: formData.codigoPostal,
                },
            };

            await profileService.updateProfile({ profileData: payload });
            toast.success("Perfil actualizado correctamente");
            setOriginalData(formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            toast.error("Hubo un error al actualizar el perfil");
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
    };

    const handleProfilePicChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        try {
            const data = await profileService.updateProfilePicture(file);
            setProfilePic(data.profileImageUrl || null);
            toast.success("Foto actualizada correctamente");
        } catch (error) {
            console.error("Error actualizando foto:", error);
            toast.error("Error al actualizar la foto");
        }
    };

    const handleResetPassword = async () => {
        try {
            await passwordSchema.validate(newPassword);
            setPasswordError("");
            const token = prompt("Ingrese el token recibido por email:");
            if (!token)
                return toast.error(
                    "Se requiere el token para cambiar la contraseña"
                );

            await profileService.resetPassword({ token, newPassword });
            toast.success("Contraseña actualizada correctamente");
            setNewPassword("");
        } catch (err: any) {
            if (err.name === "ValidationError") {
                setPasswordError(err.message);
            } else {
                console.error(err);
                toast.error("Error al actualizar la contraseña");
            }
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = confirm(
            "¿Está seguro de que desea eliminar su cuenta? Esta acción es irreversible."
        );
        if (!confirmDelete) return;

        try {
            await profileService.deleteAccount();
            toast.success("Cuenta eliminada correctamente");
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar la cuenta");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-sky-700 font-semibold animate-pulse">
                    Cargando perfil...
                </p>
            </div>
        );
    }

    return (
        <div className="items-center justify-center bg-gray-100 w-full">
            <ToastContainer />
            {/* Header */}
            <div className="bg-sky-800 text-white py-4 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
                            <FaUser size={60} className="text-sky-800" />
                        </div>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Mi perfil
                    </h1>
                    <p className="mt-2 text-sm md:text-base text-gray-200">
                        Administrar la información y preferencias de su cuenta
                    </p>
                </div>
            </div>

            {/* Card Container */}
            <div className="flex items-center justify-center bg-gray-100 p-10">
                <div className="bg-white w-full max-w-4xl ml-10 rounded-xl shadow-lg p-6 space-y-3">
                    {/* Información básica */}
                    <div>
                        <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
                            Información básica
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-start mt-6 sm:space-x-6">
                            {/* Foto de perfil */}
                            <div className="flex flex-col items-center ml-5 sm:mr-6">
                                <div
                                    className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${
                                        profilePic
                                            ? "border-4 border-sky-600"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {profilePic ? (
                                        <img
                                            src={profilePic}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUser
                                            size={50}
                                            className="text-gray-500"
                                        />
                                    )}
                                </div>
                                <button
                                    className="cursor-pointer text-sky-600 text-sm mt-2 hover:underline"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    {profilePic ? "Cambiar foto" : "Subir foto"}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleProfilePicChange}
                                />
                            </div>

                            {/* Inputs del formulario */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(formData).map(
                                    ([key, value]) => (
                                        <div key={key}>
                                            <label className="block text-sm font-medium text-gray-700 capitalize">
                                                {key.replace(/([A-Z])/g, " $1")}
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            key,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <p className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700">
                                                    {value}
                                                </p>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Botones Guardar / Cancelar */}
                        {isEditing ? (
                            <div className="flex justify-end mt-4 space-x-2">
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700 transition"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-sky-700 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-black transition"
                                    onClick={handleSave}
                                >
                                    Guardar cambios
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-sky-700 text-white px-4 py-2 rounded-md hover:bg-black cursor-pointer transition"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Editar perfil
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Seguridad de la cuenta */}
                    <div>
                        <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
                            Seguridad de la cuenta
                        </h2>
                        <div className="flex justify-end bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-700 mr-27">
                                    Restablece la contraseña de tu cuenta
                                </p>

                                {/* Input con ojo */}
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Nueva contraseña"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        className={`border rounded-md p-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 ${
                                            passwordError
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>
                                    {passwordError && (
                                        <p className="text-red-500 text-sm mt-1 absolute -bottom-5 left-0">
                                            {passwordError}
                                        </p>
                                    )}
                                </div>

                                {/* Botón */}
                                <button
                                    className={`border border-sky-700 text-sky-700 px-4 py-2 rounded-md hover:bg-blue-50 transition cursor-pointer ${
                                        !newPassword || newPassword.length < 6
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={handleResetPassword}
                                    disabled={
                                        !newPassword || newPassword.length < 6
                                    }
                                >
                                    Cambiar la contraseña
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Zona de peligro */}
                    <div>
                        <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
                            Zona de peligro
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-red-50 p-5 rounded-md">
                            <p className="text-sm text-red-600">
                                Eliminar permanentemente su cuenta y todos los
                                datos
                            </p>
                            <button
                                className="mt-2 sm:mt-0 bg-red-600 text-white px-4 py-1 cursor-pointer rounded-md hover:bg-red-700 transition"
                                onClick={handleDeleteAccount}
                            >
                                Borrar cuenta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
