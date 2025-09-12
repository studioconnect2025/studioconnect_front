"use client";

import React from "react";
import { RiUser5Line } from "react-icons/ri";

const Profile: React.FC = () => {
    return (
        <div className="items-center justify-center bg-gray-100 w-full">
            {/* Header */}
            <div className="bg-sky-800 text-white py-4 px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                            <RiUser5Line size={80} className="text-sky-800" />
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
            <div className="flex items-center justify-center bg-gray-100 p-8">
                <div className="bg-white w-full max-w-4xl ml-10 rounded-xl shadow-lg p-6 rounded-b-lg space-y-3">
                    {/* Información básica */}
                    <div>
                        <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
                            Información básica
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                            <div className="flex flex-col items-center mb-4 sm:mb-0">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                    <img
                                        src="/profile.png"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="cursor-pointer text-sky-600 text-sm mt-2 hover:underline">
                                    Cambiar foto
                                </button>
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Alex"
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Johnson"
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Palermo"
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Provincia
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Alex"
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Calle
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="av. libre 123"
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Código postal
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="1345"
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="+1 (555) 123-4567"
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="bg-sky-700 text-white px-4 py-2 rounded-md hover:bg-black cursor-pointer transition">
                                Editar perfil
                            </button>
                        </div>
                    </div>

                    {/* Seguridad de la cuenta */}
                    <div>
                        <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
                            Seguridad de la cuenta
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-700">
                                Contraseña - Última actualización hace 3 meses
                            </p>
                            <button className="mt-2 sm:mt-0 border border-sky-700 text-sky-700 px-4 py-1 rounded-md hover:bg-blue-50 transition cursor-pointer">
                                Cambiar la contraseña
                            </button>
                        </div>
                    </div>

                    {/* Zona de peligro */}
                    <div>
                        <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
                            Zona de peligro
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-red-50 p-4 rounded-md">
                            <p className="text-sm text-red-600">
                                Eliminar permanentemente su cuenta y todos los
                                datos
                            </p>
                            <button className="mt-2 sm:mt-0 bg-red-600 text-white px-4 py-1 cursor-pointer rounded-md hover:bg-red-700 transition">
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
