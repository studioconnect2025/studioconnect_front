"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminUsersService, type AdminUser } from "@/services/admin/AdminUsers";
import ReviewDialog from "@/components/admin/ReviewDialog";
import { btnPrimary, btnDanger, btnSecondary } from "@/components/admin/ui";
import { toast } from "react-toastify";

type PagedUsers = { items: AdminUser[]; total: number };

function getUserDate(u: AdminUser): number {
  const raw = (u.createdAt ?? (u as any)?.profile?.createdAt ?? "") as string;
  const t = new Date(raw).getTime();
  return Number.isFinite(t) ? t : 0;
}

export default function AdminUsersPage() {
  // búsqueda + debounce
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  // paginación
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PagedUsers>({ items: [], total: 0 });

  // modal (desactivar con motivo)
  const [banUserId, setBanUserId] = useState<string | null>(null);
  const [banUserName, setBanUserName] = useState<string>("");

  // para evitar múltiples clicks
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));

  const fetchUsers = async (p = page, q = debounced) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AdminUsersService.searchPaginated({ q, page: p, pageSize });
      const sorted = [...res.items].sort((a, b) => getUserDate(b) - getUserDate(a));
      setData({ items: sorted, total: res.total });
    } catch (e: any) {
      setError(e?.message ?? "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  // cuando cambia la búsqueda, volvemos a página 1
  useEffect(() => {
    setPage(1);
  }, [debounced]);

  // cargar lista al iniciar / cambiar página o query
  useEffect(() => {
    fetchUsers(page, debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debounced]);

  const onToggleActive = async (u: AdminUser) => {
    if (submittingId) return;
    if (u.isActive) {
      // desactivar → pedir motivo
      setBanUserId(u.id);
      setBanUserName(u.email ?? u.name ?? "usuario");
    } else {
      // activar directo
      try {
        setSubmittingId(u.id);
        await AdminUsersService.toggleStatus(u.id);
        toast.success("Usuario activado");
        await fetchUsers(page, debounced);
      } catch (e: any) {
        toast.error(e?.message ?? "No se pudo activar el usuario");
      } finally {
        setSubmittingId(null);
      }
    }
  };

  const onConfirmBan = async (message?: string) => {
    if (!banUserId) return;
    try {
      setSubmittingId(banUserId);
      await AdminUsersService.toggleStatus(banUserId, message || "");
      toast.info("Usuario desactivado");
      setBanUserId(null);
      await fetchUsers(page, debounced);
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo desactivar el usuario");
    } finally {
      setSubmittingId(null);
    }
  };

  const rows = useMemo(() => data.items, [data.items]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500">
            Buscar, listar y activar/desactivar cuentas.
          </p>
        </header>

        {/* Buscador */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar por email
          </label>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ej: usuario@correo.com"
              className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {loading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                cargando…
              </span>
            )}
          </div>
          {!!debounced && (
            <p className="mt-1 text-xs text-gray-500">
              Resultados para:{" "}
              <span className="font-medium text-gray-700">{debounced}</span>
            </p>
          )}
        </div>

        {/* Lista */}
        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="px-4 sm:px-5 pt-4 sm:pt-5 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Todos los usuarios
            </h2>
            <p className="text-xs text-gray-500">
              {data.total.toLocaleString("es-AR")} resultado(s)
            </p>
          </div>

          {error ? (
            <div className="px-5 py-10 text-center text-rose-600">{error}</div>
          ) : loading && rows.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-500">Cargando…</div>
          ) : rows.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-500">Sin resultados</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {rows.map((u) => (
                <li
                  key={u.id}
                  className="px-4 sm:px-5 py-3 grid grid-cols-12 items-center gap-2 sm:gap-3"
                >
                  <div className="col-span-6 lg:col-span-5 min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {u.email}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {u.role ?? "—"}
                    </p>
                  </div>

                  <div className="col-span-3 lg:col-span-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold
                      ${
                        u.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {u.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div className="col-span-3 lg:col-span-4 flex justify-end gap-2">
                    {u.isActive ? (
                      <button
                        className={`${btnDanger} ${
                          submittingId === u.id ? "opacity-70 pointer-events-none" : ""
                        }`}
                        onClick={() => onToggleActive(u)}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        className={`${btnPrimary} ${
                          submittingId === u.id ? "opacity-70 pointer-events-none" : ""
                        }`}
                        onClick={() => onToggleActive(u)}
                      >
                        Activar
                      </button>
                    )}
                    <button
                      className={btnSecondary}
                      onClick={() =>
                        navigator.clipboard
                          ?.writeText(u.email ?? "")
                          .then(() => toast.success("Email copiado"))
                      }
                    >
                      Copiar email
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Paginación */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3">
            <button
              className={`${btnSecondary} disabled:opacity-50`}
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <span className="text-xs text-gray-500">
              Página {page} / {totalPages}
            </span>
            <button
              className={`${btnSecondary} disabled:opacity-50`}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </section>
      </div>

      {/* Modal para motivo de desactivación */}
      {banUserId && (
        <ReviewDialog
          title={`Desactivar usuario — ${banUserName}`}
          mode="reject"
          onClose={() => setBanUserId(null)}
          onSubmit={(msg) => onConfirmBan(msg)}
        />
      )}
    </main>
  );
}
