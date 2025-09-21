"use client";

import { useEffect, useState } from "react";
import { AdminUsersService } from "@/services/admin/AdminUsers";
import { AdminStudiosService } from "@/services/admin/AdminStudios";
import { AdminBookingsService } from "@/services/admin/AdminBookings";
import { User, Building2, CalendarDays, DollarSign } from "lucide-react";

export default function OverviewMetrics() {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeStudios, setActiveStudios] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [usersCount, studiosCount, bookingsCount] = await Promise.all([
          AdminUsersService.count(),
          AdminStudiosService.count(),
          AdminBookingsService.count(),
        ]);
        if (!alive) return;
        setTotalUsers(usersCount);
        setActiveStudios(studiosCount);
        setTotalBookings(bookingsCount);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const fmt = (n: number) => n.toLocaleString("es-AR");

  return (
    <section className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total de usuarios */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">Total de usuarios</p>
          <p className="mt-2 text-2xl font-semibold text-sky-900">
            {loading ? "…" : fmt(totalUsers)}
          </p>
        </div>
        <User className="h-8 w-8 text-sky-600" />
      </div>

      {/* Estudios activos */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">Estudios activos</p>
          <p className="mt-2 text-2xl font-semibold text-sky-900">
            {loading ? "…" : fmt(activeStudios)}
          </p>
        </div>
        <Building2 className="h-8 w-8 text-emerald-600" />
      </div>

      {/* Total de reservas */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">Total de reservas</p>
          <p className="mt-2 text-2xl font-semibold text-sky-900">
            {loading ? "…" : fmt(totalBookings)}
          </p>
        </div>
        <CalendarDays className="h-8 w-8 text-amber-600" />
      </div>

      {/* Ingresos mensuales (placeholder) */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">Ingresos mensuales</p>
          <p className="mt-2 text-2xl font-semibold text-sky-900">—</p>
        </div>
        <DollarSign className="h-8 w-8 text-rose-600" />
      </div>
    </section>
  );
}
