"use client";
import { useEffect } from "react";
import { notFound } from "next/navigation";

export default function AccesoDenegadoPage() {
  useEffect(() => {
    const t = setTimeout(() => notFound(), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-[70vh] grid place-items-center px-6 bg-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-900">Acceso denegado</h1>
        <p className="mt-3 text-gray-600">
          No tenés permisos para ver esta página.
        </p>
        <a
          href="/"
          className="inline-block mt-6 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Volver al inicio
        </a>
      </div>
    </main>
  );
}
