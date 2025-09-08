"use client";
import Link from "next/link";
import {  FaEnvelope, FaCogs, FaBuilding } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export const OwnerToolbar = () => {
  const tools = [
    {
      title: "Mis salas",
      icon: <FaBuilding size={28} />,
      href: "/studioRooms",
      color: "bg-sky-800",
    },
    {
      title: "Dashboard",
      icon: <MdDashboard size={28} />,
      href: "/studioDashboard",
      color: "bg-sky-800",
    },
    {
      title: "Mensajes",
      icon: <FaEnvelope size={28} />,
      href: "/messages",
      color: "bg-sky-800",
    },
    {
      title: "Configuración",
      icon: <FaCogs size={28} />,
      href: "/settings",
      color: "bg-sky-800",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-black text-2xl sm:text-3xl md:text-3xl mb-5 font-medium">Panel del estudio express</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 ${tool.color} text-white`}
          >
            <div className="mb-2">{tool.icon}</div>
            <span className="font-medium text-lg">{tool.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
