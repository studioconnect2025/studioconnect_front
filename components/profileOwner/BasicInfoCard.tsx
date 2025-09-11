"use client";

import { useEffect, useState } from "react";
import { getOwnerBasicInfoById } from "@/services/ownerProfile.service";
import { BasicInfo } from "@/types/owner";
import { useAuthStore } from "@/stores/AuthStore";

function Field({
  label,
  value,
  full = false,
}: {
  label: string;
  value?: string | null;
  full?: boolean;
}) {
  const content =
    value && String(value).trim().length > 0 ? (
      <span className="text-gray-800">{value}</span>
    ) : (
      <span className="text-gray-400">—</span>
    );

  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <div className="min-h-10 px-1 py-2">{content}</div>
    </div>
  );
}

export default function BasicInfoCard({ onEdit }: { onEdit: () => void }) {
  const userId = useAuthStore((s) => s.user?.id);
  const [user, setUser] = useState<BasicInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const me = await getOwnerBasicInfoById(userId);
        if (alive) setUser(me);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Error al cargar el perfil.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  if (!userId && loading) {
    return (
      <div className="bg-white rounded-xl border p-5">
        <p className="text-sm text-gray-500">Cargando perfil…</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border">
        <div className="px-5 pt-5">
          <h3 className="text-sm font-medium text-gray-800">Información básica</h3>
        </div>
        <div className="border-t mt-3" />
        <div className="p-5">
          <div className="animate-pulse flex gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white rounded-xl border p-5">
        <p className="text-sm text-red-600">{error ?? "Sin datos de usuario."}</p>
      </div>
    );
  }

  const initials =
    ((user.firstName?.[0] ?? user.email?.[0] ?? "S").toUpperCase() || "S") +
    ((user.lastName?.[0] ?? user.email?.[1] ?? "C").toUpperCase() || "C");

  return (
    <div className="bg-white rounded-xl border">
      <div className="px-5 pt-5">
        <h3 className="text-sm font-medium text-gray-800">Información básica</h3>
      </div>
      <div className="border-t mt-3" />

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3 flex md:flex-col items-center md:items-start gap-3">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.email}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border">
                <span className="text-sm font-semibold text-gray-700">{initials}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
             
              }}
              className="text-xs text-[#0B6B8A] hover:opacity-90 underline underline-offset-2"
            >
              Cambiar foto
            </button>
          </div>

          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nombre" value={user.firstName ?? undefined} />
            <Field label="Apellido" value={user.lastName ?? undefined} />

            <Field label="Email" value={user.email} full />
            <Field label="Teléfono" value={user.phoneNumber ?? undefined} full />

            <Field label="Rol" value={user.role ?? undefined} />
            <Field
              label="Estado"
              value={
                user.isActive == null ? undefined : user.isActive ? "Activo" : "Inactivo"
              }
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center rounded-md bg-[#0B6B8A] text-white px-4 py-2 text-sm font-medium hover:opacity-95"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
