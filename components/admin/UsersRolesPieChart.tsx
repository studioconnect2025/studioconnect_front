// components/admin/UsersRolesPieChart.tsx
"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AdminSegmentsService } from "@/services/admin/AdminSegments";

const COLORS = ["#0f4c64", "#94a3b8"]; // principal + grisáceo

export default function UsersRolesPieChart() {
  const [musicians, setMusicians] = useState(0);
  const [owners, setOwners] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [m, o] = await Promise.all([
          AdminSegmentsService.countMusicians(),
          AdminSegmentsService.countStudioOwners(),
        ]);
        if (!alive) return;
        setMusicians(m);
        setOwners(o);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <div className="h-60 grid place-items-center text-gray-500">Cargando…</div>;

  const data = [
    { name: "Músicos", value: musicians },
    { name: "Dueños de estudio", value: owners },
  ];

  const total = musicians + owners;
  if (total === 0) {
    return <div className="h-60 grid place-items-center text-gray-500">Sin datos de roles.</div>;
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={24} />
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-sm text-gray-600">
        Total: <span className="font-medium text-sky-900">{total.toLocaleString("es-AR")}</span>
      </p>
    </div>
  );
}
