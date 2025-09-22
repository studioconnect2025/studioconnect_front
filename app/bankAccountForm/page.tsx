"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaCoins } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi"; // 🔹 agregado para icono upload
import { FaPiggyBank } from "react-icons/fa6";

export default function BankAccountForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cbu: "",
    alias: "",
    bankName: "",
    accountHolder: "",
    accountType: "",
    dni: "",
    phone: "",
    email: "",
  });

  // 🔹 estado para archivo
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 manejar archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: file
        ? "Tu cuenta bancaria y el archivo fueron registrados correctamente."
        : "Tu cuenta bancaria fue registrada correctamente.",
      confirmButtonText: "Aceptar",
    }).then(() => {
      router.push("/studioDashboard");
    });
  };

  return (
    <div>
      <div className="bg-sky-800 text-white py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <FaPiggyBank size={40} className="text-sky-700" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Registro de cuenta bancaria
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            Registra tu cuenta y comienza a recibir los pagos por las reservas.
          </p>
        </div>
      </div>

      <div className="flex justify-center bg-gray-100 px-4 py-5 items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white rounded-xl shadow-lg ml-2 p-6"
        >
          {/* 🔹 GRID PARA ORDENAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-1">CBU</label>
              <input
                type="text"
                name="cbu"
                value={formData.cbu}
                onChange={handleChange}
                className="w-full border cursor-pointer border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Alias</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                className="w-full border cursor-pointer border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Banco</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full border cursor-pointer border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Titular de la cuenta
              </label>
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleChange}
                className="w-full border cursor-pointer border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Tipo de cuenta</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className="w-full border cursor-pointer border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option className="text-gray-700" value="">
                  Seleccione
                </option>
                <option className="text-gray-700" value="caja_ahorro">
                  Caja de ahorro
                </option>
                <option className="text-gray-700" value="cuenta_corriente">
                  Cuenta corriente
                </option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="w-full border cursor-pointer border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border cursor-pointer border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border cursor-pointer border-gray-300 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* 🔹 UPLOAD FILE */}
          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Registro Comercial</label>
            <label
              htmlFor="fileUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer hover:border-sky-600"
            >
              <FiUploadCloud className="text-sky-600 text-3xl mb-2" />
              <p className="text-gray-600">
                {file
                  ? `Archivo cargado: ${file.name}`
                  : "Suelta tu archivo aquí o haz clic para subir (PDF o imagen)"}
              </p>
              <input
                id="fileUpload"
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <button
            type="submit"
            className="bg-sky-800 text-white px-6 py-2 cursor-pointer rounded-lg hover:bg-black transition mt-8"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
