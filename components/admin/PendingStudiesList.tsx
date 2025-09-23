"use client";

import { useEffect, useMemo, useState } from "react";
import ReviewDialog from "./ReviewDialog";
import {
  AdminStudiosService,
  type AdminStudio,
  type PendingResponse,
  type ComercialRegisterResp,
} from "@/services/admin/AdminStudios";
import { useStudiosStore } from "@/stores/admin/StudiosStore";
import { toast } from "react-toastify";
import { btnSecondary, btnPrimary, btnDanger } from "@/components/admin/ui";

// Normalización de respuesta (lista simple o paginada)
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

  // Modal ver docs
  const [openId, setOpenId] = useState<string | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [doc, setDoc] = useState<ComercialRegisterResp | null>(null);

  // Modal rechazo
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

  const handleOpenDocs = async (studioId: string) => {
    setOpenId(studioId);
    setDoc(null);
    setDocError(null);
    setDocLoading(true);
    try {
      const r = await AdminStudiosService.getComercialRegister(studioId);
      setDoc(r);
    } catch (e: any) {
      setDocError(e?.message || "No se pudo obtener el documento");
    } finally {
      setDocLoading(false);
    }
  };

  const handleApprove = async (studioId: string) => {
    try {
      await AdminStudiosService.updateRequestStatus(studioId, { status: "approved" });
      toast.success("Estudio aprobado correctamente");
      await Promise.all([fetchPage(page), refreshAll()]);
    } catch (e: any) {
      toast.error(e?.message ?? "Error al aprobar. Intenta nuevamente.");
    }
  };

  const handleReject = async (studioId: string, message: string) => {
    try {
      await AdminStudiosService.updateRequestStatus(studioId, { status: "rejected", message });
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
            const studioId = (s as any).studio?.id ?? s.id;
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
                    className={btnSecondary}
                    onClick={() => handleOpenDocs(studioId)}
                  >
                    Ver documentos
                  </button>
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() => handleApprove(studioId)}
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => setRejectId(studioId)}
                  >
                    Desaprobar
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {/* Modal ver docs */}
      {openId && (
        <ReviewDialog
          title="Registro comercial"
          loading={docLoading}
          error={docError || undefined}
          documents={
            doc
              ? [{ url: doc.inline, name: "Registro comercial (inline)", type: "pdf", download: doc.download }]
              : []
          }
          onClose={() => {
            setOpenId(null);
            setDoc(null);
            setDocError(null);
          }}
        />
      )}

      {/* Modal rechazo */}
      {rejectId && (
        <ReviewDialog
          title="Motivo de rechazo"
          mode="reject"
          onSubmit={(msg) => handleReject(rejectId, msg || "")}
          onClose={() => setRejectId(null)}
        />
      )}

      {/* Paginación */}
      <div className="flex items-center justify-between px-5 py-3">
        <button
          className={`${btnSecondary} disabled:opacity-50`}
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Anterior
        </button>
        <span className="text-xs text-gray-500">
          {total} resultados • Página {page} / {totalPages}
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
  );
}
