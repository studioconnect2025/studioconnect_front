"use client";
import { useState } from "react";
import {
  FaCheck,
  FaMobileAlt,
  FaLock,
  FaHeadset,
  FaChartBar,
  FaCalendarCheck,
  FaCreditCard,
  FaMedal,
} from "react-icons/fa";
import ModalCheckout from "@/components/payments/ModalCheckout";

export default function PricingPlans() {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"mensual" | "anual">("mensual");

  const handleStart = (plan: "mensual" | "anual") => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  return (
    <section className="w-full bg-gray-50">
      {/* Hero */}
      <div className="bg-sky-800 text-white py-10 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <FaMedal size={40} className="text-sky-800" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Elija su plan de estudio
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            Selecciona el plan de membresía perfecto para registrar y administrar tu estudio en StudioConnect
          </p>
        </div>
      </div>

      {/* Planes */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Mensual */}
          <div className="bg-white border-4 hover:border-black rounded-xl shadow-sm hover:shadow-xl relative text-center">
            <span className="absolute -top-3 left-6 bg-sky-600 text-white text-sm px-3 py-1 rounded-full">
              Más popular
            </span>
            <div className="p-6 flex flex-col items-center space-y-6">
              <h2 className="text-2xl font-semibold text-black">Plan Mensual</h2>
              <p className="text-gray-500 text-base">
                Ideal para estudios en crecimiento.
              </p>
              <p className="text-3xl font-bold text-sky-700">
                $25usd
                <span className="text-base font-normal ml-2 text-gray-600">/mes</span>
              </p>

              <ul className="space-y-6 text-base text-gray-700 text-left">
                {[
                  "Acceso a más de 2 salas para tu estudio",
                  "Atención al cliente prioritaria",
                  "Marca personalizada",
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <FaCheck className="w-4 h-4 text-sky-600 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleStart("mensual")}
                className="bg-sky-700 text-white py-2 px-6 text-sm sm:text-base md:text-lg rounded-xl w-full sm:w-auto hover:bg-black transition-transform duration-300 ease-in-out hover:scale-110"
              >
                Empezar
              </button>
            </div>
          </div>

          {/* Plan Anual */}
          <div className="bg-white border-4 hover:border-black rounded-xl shadow-sm hover:shadow-xl text-center">
            <div className="p-6 flex flex-col items-center space-y-6">
              <h2 className="text-2xl font-semibold text-black">Plan Anual</h2>
              <p className="text-gray-500 text-base">
                Tu estudio siempre online, sin preocupaciones.
              </p>
              <p className="text-3xl font-bold text-sky-700">
                $100usd
                <span className="text-base font-normal ml-2 text-gray-600">/año</span>
              </p>

              <ul className="space-y-6 text-base text-gray-700 text-left">
                {[
                  "Publica tu estudio 12 meses",
                  "Ahorra 3 meses",
                  "Análisis e informes avanzados",
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <FaCheck className="w-4 h-4 text-sky-600 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleStart("anual")}
                className="bg-sky-700 text-white py-2 px-6 text-sm sm:text-base md:text-lg rounded-xl w-full sm:w-auto hover:bg-black transition-transform duration-300 ease-in-out hover:scale-110"
              >
                Empezar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Que incluye */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h3 className="text-center text-xl md:text-2xl font-semibold mb-10 text-black">
          Y además te brindamos…
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "Reserva inteligente",
              desc: "Sistema de programación inteligente con prevención de conflictos",
              icon: <FaCalendarCheck />,
            },
            {
              title: "Analíticas",
              desc: "Información detallada sobre el rendimiento de su estudio",
              icon: <FaChartBar />,
            },
            {
              title: "Procesamiento de pagos",
              desc: "Manejo seguro de pagos con múltiples opciones",
              icon: <FaCreditCard />,
            },
            {
              title: "App mobile",
              desc: "Administra tu estudio sobre la marcha",
              icon: <FaMobileAlt />,
            },
            {
              title: "24/7 Support",
              desc: "Asistencia las 24 horas cuando la necesite",
              icon: <FaHeadset />,
            },
            {
              title: "Seguridad",
              desc: "Seguridad de nivel empresarial para sus datos",
              icon: <FaLock />,
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-sky-100 text-sky-700 flex items-center justify-center rounded-2xl mb-3 text-3xl transition-transform duration-300 ease-in-out hover:scale-120">
                {item.icon}
              </div>
              <h4 className="font-semibold text-lg text-gray-800">{item.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Checkout */}
      <ModalCheckout open={open} onClose={() => setOpen(false)} plan={selectedPlan} />
    </section>
  );
}
