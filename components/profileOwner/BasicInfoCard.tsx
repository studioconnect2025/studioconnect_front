"use client";

import { useEffect, useState } from "react";
import { getOwnerBasicInfoById, type BasicInfo } from "@/services/ownerBasics.services";
import { useAuthStore } from "@/stores/AuthStore";

export default function BasicInfoCard({ onEdit }: { onEdit: () => void }) {
  const userId = useAuthStore((s) => s.user?.id as string | undefined);
  const [user, setUser] = useState<BasicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) { setError("No hay usuario autenticado."); setLoading(false); return; }
    (async () => {
      try { setUser(await getOwnerBasicInfoById(userId)); }
      catch (e: any) { setError(e?.message ?? "Error al cargar el perfil."); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-5">
        <div className="animate-pulse flex gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }
  if (error || !user) {
    return <div className="bg-white rounded-xl border p-5"><p className="text-sm text-red-600">{error ?? "Sin datos de usuario."}</p></div>;
  }

  const initialsFromName =
    ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).trim();
  const initialsFromEmail = user.email?.split("@")[0]?.slice(0, 2).toUpperCase() || "SC";
  const initials = (initialsFromName || initialsFromEmail || "SC").toUpperCase();

  return (
    <div className="bg-white rounded-xl border">
      <div className="px-5 pt-5">
        <h3 className="text-sm font-medium text-gray-800">Información básica</h3>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3 flex md:flex-col items-center md:items-start gap-3">
            {user.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profilePhoto} alt={`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email}
                   className="w-16 h-16 rounded-full object-cover border" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 border">
                {initials}
              </div>
            )}
          </div>

          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Nombre</label>
              <div className="rounded border bg-gray-50 px-3 py-2 text-sm text-gray-800">
                {user.firstName ?? "—"}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Apellido</label>
              <div className="rounded border bg-gray-50 px-3 py-2 text-sm text-gray-800">
                {user.lastName ?? "—"}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Email</label>
              <div className="rounded border bg-gray-50 px-3 py-2 text-sm text-gray-800">
                {user.email}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Teléfono</label>
              <div className="rounded border bg-gray-50 px-3 py-2 text-sm text-gray-800">
                {user.phoneNumber ?? "—"}
              </div>
            </div>

            {/* Fallbacks útiles mientras el back no mande nombre/teléfono */}
            {(user.role || user.isActive !== null) && (
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {user.role && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Rol</label>
                    <div className="rounded border bg-gray-50 px-3 py-2 text-sm text-gray-800">
                      {user.role}
                    </div>
                  </div>
                )}
                {user.isActive !== null && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Estado</label>
                    <div className="rounded border bg-gray-50 px-3 py-2 text-sm text-gray-800">
                      {user.isActive ? "Activo" : "Inactivo"}
                    </div>
                  </div>
                )}
              </div>
            )}
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
