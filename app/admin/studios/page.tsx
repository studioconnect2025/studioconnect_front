"use client";

import StudiesMetrics from "@/components/admin/StudiesMetrics";
import PendingStudiesList from "@/components/admin/PendingStudiesList";

export default function AdminStudiesPage() {
  return (
    <div className="bg-zinc-200 px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div>
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-sky-900">
          Estudios
        </h1>
        <p className="text-gray-600 text-center">
          Métricas y gestión de solicitudes de estudios
        </p>
      </div>

      <StudiesMetrics />
      <PendingStudiesList />
    </div>
  );
}
