// app/admin/page.tsx
import OverviewMetrics from "@/components/admin/OverviewMetrics";
import UsersTimelineChart from "@/components/admin/UsersTimelineChart";
import UsersRolesPieChart from "@/components/admin/UsersRolesPieChart";
import CardUsers from "@/components/admin/CardUsers";
import CardStudios from "@/components/admin/CardStudios";

export default function AdminDashboard() {
  return (
    <div className="bg-zinc-200 px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Título */}
      <div>
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-sky-900">
          Descripción general de la plataforma
        </h1>
        <p className="text-gray-600 text-center">
          Supervise el rendimiento de su plataforma y las métricas clave
        </p>
      </div>

      {/* Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Línea de tiempo */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Usuarios registrados (último mes)
            </h2>
          </div>
          <UsersTimelineChart />
        </div>

        {/* Torta por roles */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Composición por rol
            </h2>
          </div>
          <UsersRolesPieChart />
        </div>
      </section>

      {/* Métricas */}
      <OverviewMetrics />

{/* Gestión de usuarios y estudios */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-10">
  <div className="h-full">
    <CardUsers />
  </div>
  <div className="h-full">
    <CardStudios />
  </div>
</section>
    </div>
  );
}
