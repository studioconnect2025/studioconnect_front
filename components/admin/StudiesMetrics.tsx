// components/admin/StudiesMetrics.tsx
"use client";

import { useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useStudiosStore } from "@/stores/admin/StudiosStore";

export default function StudiesMetrics() {
  // ✅ Selectores independientes: sin tuplas, sin objetos → no hay 'unknown' ni loops
  const loading = useStudiosStore((s) => s.loading);
  const ts = useStudiosStore((s) => s.ts);
  const counts = useStudiosStore((s) => s.counts);
  const refreshAll = useStudiosStore((s) => s.refreshAll);

  useEffect(() => {
    if (!ts.length) refreshAll();
  }, [ts.length, refreshAll]);

  const pieData = [
    { name: "Pendiente", value: counts.pendiente ?? 0 },
    { name: "Aprobado", value: counts.aprovado ?? 0 }, // “aprovado” como en backend
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Línea: nuevos últimos 30 días */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
          Estudios nuevos (últimos 30 días)
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ts}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {loading && <p className="mt-2 text-xs text-gray-500">Actualizando…</p>}
      </div>

      {/* Dona: pendientes vs aprobados */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
          Pendientes vs Aprobados
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={"55%"}
                outerRadius={"85%"}
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {loading && <p className="mt-2 text-xs text-gray-500">Actualizando…</p>}
      </div>
    </section>
  );
}
