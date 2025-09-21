// services/admin/AdminStudios.ts
import { http } from "@/lib/http";

export type AdminStudio = {
  id: string;
  name: string;
  studioType?: string | null;
  pais?: string | null;
  codigoPostal?: string | null;
  city?: string | null;
  province?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  description?: string | null;
  photos?: string[] | null;
  services?: any | null;
  openingTime?: string | null;
  closingTime?: string | null;
  comercialRegister?: string | null;
  owner?: { id: string; email: string } | null;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  /** Puede venir con typos o null */
  status?: string | null | undefined;
  stripeAccountId?: string | null;
};

export type TimeseriesPoint = { date: string; count: number };
export type TimeseriesParams = { days?: number };
export type PendingResponse = { items: AdminStudio[]; total: number } | AdminStudio[];

const normalizeStatus = (s?: string | null) => {
  const x = (s ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  if (x.startsWith("aprob") || x.startsWith("aprov") || x.startsWith("approv")) return "aprovado"; // normalizamos a lo que espera backend
  if (x.startsWith("pend")) return "pendiente";
  if (x.startsWith("bloq") || x.startsWith("block")) return "bloqueado";
  return x || "pendiente";
};

const normalizeList = (list: AdminStudio[] = []) =>
  list.map((s) => ({ ...s, status: normalizeStatus(s.status) }));

function lastNDates(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d);
    dt.setDate(d.getDate() - i);
    out.push(dt.toISOString().slice(0, 10));
  }
  return out;
}
function buildTimeseriesFrom(list: AdminStudio[], days = 30): TimeseriesPoint[] {
  const map = new Map<string, number>();
  const keys = lastNDates(days);
  keys.forEach((k) => map.set(k, 0));
  list.forEach((s) => {
    const k = (s.createdAt ?? s.updatedAt ?? "").slice(0, 10);
    if (map.has(k)) map.set(k, (map.get(k) ?? 0) + 1);
  });
  return keys.map((k) => ({ date: k, count: map.get(k) ?? 0 }));
}

export const AdminStudiosService = {
  /** Unimos activos + pendientes (no existe /admin/studios “todos” en tu backend) */
  async getAll(): Promise<AdminStudio[]> {
    const settled = await Promise.allSettled([
      AdminStudiosService.getActive(),   // GET /admin/studios/active
      AdminStudiosService.getPending(),  // GET /admin/studios/pending
    ]);
    const active = settled[0].status === "fulfilled" ? settled[0].value : [];
    const pendingRaw = settled[1].status === "fulfilled" ? settled[1].value : [];
    const pending = Array.isArray(pendingRaw) ? pendingRaw : pendingRaw.items ?? [];
    return normalizeList([...(active ?? []), ...(pending ?? [])]);
  },

  /** Estudios activos (aprobados) */
  async getActive(): Promise<AdminStudio[]> {
    const { data } = await http.get<AdminStudio[] | { items: AdminStudio[] }>(
      "/admin/studios/active"
    );
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return normalizeList(list);
  },

  /** Pendientes — tu endpoint real */
  async getPending(params?: { page?: number; pageSize?: number }): Promise<PendingResponse> {
    const { page = 1, pageSize = 10 } = params ?? {};
    const { data } = await http.get<PendingResponse>("/admin/studios/pending", {
      params: { page, pageSize },
    });
    if (Array.isArray(data)) return normalizeList(data);
    return { items: normalizeList(data.items ?? []), total: data.total ?? data.items?.length ?? 0 };
  },

  /** Compat para componentes existentes que llamaban getPendingRequests */
  async getPendingRequests(params: { page?: number; pageSize?: number }): Promise<PendingResponse> {
    return AdminStudiosService.getPending(params);
  },

  /** Aprobar / Rechazar solicitud
   * Swagger: { "status": "aprovado" }  (tal cual con “v”)
   */
  async updateRequestStatus(
    id: string,
    payload: { status: "approved" | "rejected"; message?: string }
  ) {
    const map: Record<"approved" | "rejected", string> = {
      approved: "aprovado",   // exacto como Swagger
      rejected: "rechazado",  // ajustá si tu backend espera otro string
    };

    // Swagger dice que espera SOLO "status"
    const body = { status: map[payload.status] ?? payload.status };

    const { data } = await http.patch(`/admin/studios/${id}/process`, body);
    return data;
  },

  /** Serie últimos N días (fallback local con createdAt/updatedAt si no hay endpoint de métricas) */
  async timeseriesNew({ days = 30 }: TimeseriesParams): Promise<TimeseriesPoint[]> {
    const active = await AdminStudiosService.getActive();
    return buildTimeseriesFrom(active, days);
  },

  /** Conteo por estado (fallback con activos+pendientes) */
  async countByStatus(): Promise<Record<string, number>> {
    const [active, pendResp] = await Promise.all([
      AdminStudiosService.getActive(),
      AdminStudiosService.getPending(),
    ]);
    const pending = Array.isArray(pendResp) ? pendResp : pendResp.items ?? [];
    return {
      aprovado: active.length,   // dejamos la clave normalizada a “aprovado” por consistencia
      pendiente: pending.length,
      bloqueado: 0,
    };
  },

  /** Total “aprovado” */
  async count(): Promise<number> {
    const counts = await AdminStudiosService.countByStatus();
    return counts["aprovado"] ?? counts["aprovado"] ?? 0;
  },
};

export { normalizeStatus };
