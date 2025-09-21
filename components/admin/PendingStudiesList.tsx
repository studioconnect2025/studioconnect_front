// components/admin/PendingStudiesList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ReviewDialog from "./ReviewDialog";
import {
  AdminStudiosService,
  type AdminStudio,
  type PendingResponse,
} from "@/services/admin/AdminStudios";
import { useStudiosStore } from "@/stores/admin/StudiosStore";
import { toast } from "react-toastify";

function getItems(data: PendingResponse): AdminStudio[] {
  return Array.isArray(data) ? data : data.items;
}
function getTotal(data: PendingResponse): number {
  return Array.isArray(data) ? data.length : data.total;
}

export default function PendingStudiesList() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PendingResponse>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [openId, setOpenId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const items = useMemo(() => getItems(data), [data]);
  const total = useMemo(() => getTotal(data), [data]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const refreshAll = useStudiosStore((s) => s.refreshAll);

  const fetchPage = async (p = 1) => {
    setLoading(true);
    try {
      const res = await AdminStudiosService.getPendingRequests({ page: p, pageSize });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleApprove = async (id: string) => {
    try {
      await AdminStudiosService.updateRequestStatus(id, { status: "approved" });
      toast.success("Estudio aprobado correctamente");
      await Promise.all([fetchPage(page), refreshAll()]); // 👈 refresca lista y métricas
    } catch (e: any) {
      toast.error(e?.message ?? "Error al aprobar. Intenta nuevamente.");
    }
  };

  const handleReject = async (id: string, message: string) => {
    try {
      await AdminStudiosService.updateRequestStatus(id, {
        status: "rejected",
        message,
      });
      toast.info("Solicitud enviada a revisión");
      await Promise.all([fetchPage(page), refreshAll()]);
    } catch (e: any) {
      toast.error(e?.message ?? "Error al procesar rechazo.");
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="px-5 pt-5">
        <h2 className="text-lg font-semibold text-gray-800">Estudios pendientes de aprobación</h2>
        <p className="text-xs text-gray-500">
          Revise documentos, apruebe o deje observaciones — Página {page} de {totalPages}
        </p>
      </div>

      <ul className="mt-3 divide-y divide-gray-100">
        {loading ? (
          <li className="px-5 py-10 text-center text-gray-500">Cargando…</li>
        ) : items.length === 0 ? (
          <li className="px-5 py-10 text-center text-gray-500">No hay solicitudes pendientes</li>
        ) : (
          items.map((s) => {
            // A veces pendientes trae id de solicitud y el endpoint espera id del estudio
            const processId = (s as any).studio?.id ?? s.id;

            return (
              <li key={s.id} className="px-5 py-4 grid grid-cols-12 items-center gap-3">
                <div className="col-span-6 min-w-0">
                  <p className="truncate text-sm font-semibold text-sky-900">{s.name}</p>
                  <p className="truncate text-xs text-gray-500">
                    {s.city ?? "—"} · {s.province ?? "—"} · {s.owner?.email ?? (s as any).ownerEmail ?? "—"}
                  </p>
                </div>
                <div className="col-span-6 flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
                    onClick={() => setOpenId(s.id)}
                  >
                    Ver documentos
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100"
                    onClick={() => handleApprove(processId)}
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-100"
                    onClick={() => setRejectId(processId)}
                  >
                    Desaprobar
                  </button>
                </div>

                {/* Modal ver docs */}
                {openId === s.id && (
                  <ReviewDialog
                    title={`Documentación de ${s.name}`}
                    onClose={() => setOpenId(null)}
                    documents={(s as any).documents ?? (s as any).comercialRegister ? [(s as any).comercialRegister] : []}
                  />
                )}

                {/* Modal rechazo */}
                {rejectId === processId && (
                  <ReviewDialog
                    title={`Motivo de rechazo — ${s.name}`}
                    mode="reject"
                    onClose={() => setRejectId(null)}
                    onSubmit={(msg) => handleReject(processId, msg)}
                  />
                )}
              </li>
            );
          })
        )}
      </ul>

      {/* Paginación */}
      <div className="flex items-center justify-between px-5 py-3">
        <button
          className="rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Anterior
        </button>
        <span className="text-xs text-gray-500">
          {total} resultados • Página {page} / {totalPages}
        </span>
        <button
          className="rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}
