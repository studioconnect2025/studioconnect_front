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

/** Devuelve la fecha a usar para “fecha de registro” del usuario */
function getUserSignupDate(u: AnyUser): Date | null {
  const raw =
    u?.createdAt ??
    u?.profile?.createdAt ??
    u?.studio?.createdAt ??
    null;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function formatDay(d: Date) {
  // “dd/MM”
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
}

export default function UsersTimelineChart() {
  const [users, setUsers] = useState<AnyUser[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await AdminUsersService.getAll();
        if (!alive) return;
        setUsers(data as AnyUser[]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const series = useMemo(() => {
    if (!users) return [];

    // Últimos 30 días (incluye hoy)
    const today = new Date();
    const days: Date[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setHours(0, 0, 0, 0);
      d.setDate(today.getDate() - i);
      days.push(d);
    }

    // Conteo por día
    const counts: Record<string, number> = {};
    for (const d of days) counts[d.toDateString()] = 0;

    let hasAnyDate = false;
    for (const u of users) {
      const d = getUserSignupDate(u);
      if (!d) continue;
      hasAnyDate = true;

      // Normalizamos al día (00:00:00)
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
      if (key in counts) counts[key] += 1; // solo contamos si está dentro de los 30 días
    }

    if (!hasAnyDate) return [];

    // Si querés ACUMULADO, setea `accumulate = true`
    const accumulate = false;

    let acc = 0;
    return days.map((d) => {
      const key = d.toDateString();
      const value = counts[key] ?? 0;
      acc += value;
      return {
        day: formatDay(d),
        value: accumulate ? acc : value,
      };
    });
  }, [users]);

  if (loading) {
    return (
      <div className="h-60 grid place-items-center text-gray-500">Cargando…</div>
    );
  }

  if (!series.length) {
    return (
      <div className="h-60 grid place-items-center text-gray-500">
        No hay datos de fecha para construir la línea del último mes.
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={series} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#eee" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0f4c64"
            strokeWidth={3}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-gray-500">
        Usuarios nuevos por día (últimos 30 días)
      </p>
    </div>
  );
}
