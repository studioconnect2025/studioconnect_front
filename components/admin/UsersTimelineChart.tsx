"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AdminUsersService } from "@/services/admin/AdminUsers";

type AnyUser = {
  createdAt?: string;
  profile?: { createdAt?: string };
  studio?: { createdAt?: string };
};

/** Fecha a usar como “alta” del usuario */
function getUserSignupDate(u: AnyUser): Date | null {
  const raw = u?.createdAt ?? u?.profile?.createdAt ?? u?.studio?.createdAt ?? null;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function formatDay(d: Date) {
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }); // dd/MM
}

export default function UsersTimelineChart() {
  const [users, setUsers] = useState<AnyUser[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await AdminUsersService.getAllPages(500);
        if (!alive) return;
        setUsers(data as AnyUser[]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const { series, totalLast30 } = useMemo(() => {
    if (!users) return { series: [] as { day: string; usuarios: number }[], totalLast30: 0 };

    // Últimos 30 días (incluye hoy), normalizados a 00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: Date[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d);
    }

    // Mapa día -> cantidad
    const counts: Record<string, number> = {};
    for (const d of days) counts[d.toDateString()] = 0;

    // Contabilizamos SOLO si cae dentro de los últimos 30 días
    let total = 0;
    for (const u of users) {
      const signup = getUserSignupDate(u);
      if (!signup) continue;
      const key = new Date(signup.getFullYear(), signup.getMonth(), signup.getDate()).toDateString();
      if (key in counts) {
        counts[key] += 1;
        total += 1;
      }
    }

    const series = days.map((d) => ({
      day: formatDay(d),
      usuarios: counts[d.toDateString()] ?? 0,
    }));

    return { series, totalLast30: total };
  }, [users]);

  if (loading) {
    return <div className="h-60 grid place-items-center text-gray-500">Cargando…</div>;
  }

  if (!series.length) {
    return (
      <div className="h-60 grid place-items-center text-gray-500">
        No hay datos de registro en los últimos 30 días.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Resumen arriba */}
      <p className="mb-1 text-sm text-gray-600 text-center">
        Registrados en los últimos 30 días:{" "}
        <span className="font-semibold text-sky-900">{totalLast30.toLocaleString("es-AR")}</span>
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={series} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#eee" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            labelFormatter={(label) => `Día ${label}`}
            formatter={(value: number) => [value, "Usuarios"]}
          />
          <Line
            name="Usuarios"           // <- nombre visible en el tooltip/leyenda
            type="monotone"
            dataKey="usuarios"        // <- cambiamos de "value" a "usuarios"
            stroke="#0f4c64"
            strokeWidth={3}
            dot={{ r: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="mt-2 text-center text-xs text-gray-500">
        Usuarios nuevos por día (últimos 30 días)
      </p>
    </div>
  );
}
