// components/admin/studios/StudiesMetrics.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { AdminStudiosService } from "@/services/admin/AdminStudios";

type TSPoint = { date: string; count: number };

export default function StudiesMetrics() {
  const [loading, setLoading] = useState(true);
  const [ts, setTs] = useState<TSPoint[]>([]);
  const [statusCounts, setStatusCounts] = useState<{ pendiente: number; aprobado: number }>({
    pendiente: 0,
    aprobado: 0,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [timeseries, counts] = await Promise.all([
          AdminStudiosService.timeseriesNew({ days: 30 }),
          AdminStudiosService.countByStatus(),
        ]);
        if (!alive) return;
        setTs(timeseries);
        setStatusCounts({
          pendiente: counts["pendiente"] ?? 0,
          aprobado: counts["aprobado"] ?? 0,
        });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const pieData = useMemo(
    () => [
      { name: "Pendiente", value: statusCounts.pendiente },
      { name: "Aprobado", value: statusCounts.aprobado },
    ],
    [statusCounts]
  );

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
      </div>

      {/* Doughnut: pendientes vs aprobados */}
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
      </div>
    </section>
  );
}
