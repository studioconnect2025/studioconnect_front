// components/admin/CardUsers.tsx
"use client";

import { useEffect, useState } from "react";
import CardsGeneral, { CardsGeneralItem } from "@/components/admin/CardsGeneral";
import { AdminUsersService, AdminUser } from "@/services/admin/AdminUsers";

export default function CardUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminUsersService.getAll();
        // Si no usás lastSeenAt todavía, podés omitir el sort
        const sorted = [...data].sort((a, b) => {
          if (!a.lastSeenAt || !b.lastSeenAt) return 0;
          return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
        });
        setUsers(sorted.slice(0, 5));
      } catch (e: any) {
        setError(e?.message || "Error cargando usuarios");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toStatus = (u: AdminUser) => {
    const label =
      u.status ?? (u.isActive === true ? "Activo" : u.isActive === false ? "Inactivo" : "—");
    const s = label.toLowerCase();
    const variant =
      s === "activo"
        ? ("success" as const)
        : s === "inactivo"
        ? ("warning" as const)
        : s === "bloqueado"
        ? ("danger" as const)
        : ("neutral" as const);
    return { label, variant };
  };

  const items: CardsGeneralItem[] = users.map((u) => ({
    id: u.id,
    title: u.name || u.email,       // nombre (o email)
    subtitle: u.role,               // rol
    // NO enviamos time => CardsGeneral oculta la columna
    status: toStatus(u),            // Activo / Inactivo / Bloqueado (con color)
    avatarUrl: u.profileImageUrl,   // 👈 usa la foto real
    initials: (u.name ?? u.email)?.charAt(0),
  }));

  if (loading) return <p className="p-4 text-gray-500">Cargando usuarios...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <CardsGeneral
      header="Gestión de usuarios"
      columns={{ titleCol: "Usuarios", statusCol: "Estado" }} 
      items={items}
      onItemClick={(it) => console.log("click usuario", it)}
      className="mt-6 h-full"
    />
  );
}
