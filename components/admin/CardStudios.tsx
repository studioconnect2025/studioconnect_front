"use client";

import { useEffect, useState } from "react";
import CardsGeneral, { CardsGeneralItem } from "@/components/admin/CardsGeneral";
import { AdminStudiosService, type AdminStudio } from "@/services/admin/AdminStudios";

export default function CardStudios() {
  const [studios, setStudios] = useState<AdminStudio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminStudiosService.getAll();
        setStudios(data.slice(0, 5));
      } catch (e: any) {
        setError(e?.message || "Error cargando estudios");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toVariant = (status: string | null | undefined) => {
    const s = (status ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    if (s.startsWith("aprob") || s.startsWith("aprov") || s.startsWith("approv")) return "success" as const;
    if (s.startsWith("pend")) return "warning" as const;
    if (s.startsWith("bloq") || s.startsWith("block")) return "danger" as const;
    return "neutral" as const;
  };

  const getAvatar = (s: AdminStudio): string | undefined =>
    (s as any).avatarUrl ?? (Array.isArray(s.photos) ? s.photos[0] : undefined);

  const items: CardsGeneralItem[] = studios.map((s) => ({
    id: s.id,
    title: s.name,
    subtitle: s.city || "—",
    status: {
      label: s.status ?? "Pendiente",
      variant: toVariant(s.status),
    },
    avatarUrl: getAvatar(s),
    initials: s.name?.charAt(0) ?? "S",
  }));

  if (loading) return <p className="p-4 text-gray-900">Cargando estudios...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <CardsGeneral
      header="Gestión de estudio"
      columns={{ titleCol: "Estudios", statusCol: "Estado" }}
      items={items}
      onItemClick={(s) => console.log("abrir estudio", s)}
      className="mt-6 h-full"
    />
  );
}
