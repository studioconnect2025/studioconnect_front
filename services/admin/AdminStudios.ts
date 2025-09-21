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
  if (x.startsWith("aprob") || x.startsWith("aprov") || x.startsWith("approv")) return "aprobado";
  if (x.startsWith("pend")) return "pendiente";
  if (x.startsWith("bloq") || x.startsWith("block")) return "bloqueado";
  return x || "pendiente";
};
const normalizeList = (list: AdminStudio[] = []) =>
  list.map((s) => ({ ...s, status: normalizeStatus(s.status) }));

export const AdminStudiosService = {
  /** Todos los estudios (si no existe endpoint, hace fallback a activos+pendientes) */
  async getAll(): Promise<AdminStudio[]> {
    try {
      const { data } = await http.get<AdminStudio[]>("/admin/studios");
      return normalizeList(Array.isArray(data) ? data : []);
    } catch {
      const [active, pendingResp] = await Promise.all([
        AdminStudiosService.getActive(),
        AdminStudiosService.getPendingRequests({ page: 1, pageSize: 100 }),
      ]);
      const pending = Array.isArray(pendingResp) ? pendingResp : pendingResp.items ?? [];
      return normalizeList([...(active ?? []), ...(pending ?? [])]);
    }
  },

  /** Estudios activos (aprobados) */
  async getActive(): Promise<AdminStudio[]> {
    const { data } = await http.get<AdminStudio[] | { items: AdminStudio[] }>("/admin/studios/active");
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return normalizeList(list);
  },

  /** Solicitudes pendientes, paginadas */
  async getPendingRequests(params: { page?: number; pageSize?: number }): Promise<PendingResponse> {
    const { page = 1, pageSize = 10 } = params ?? {};
    const { data } = await http.get<PendingResponse>("/admin/studios/pending-requests", {
      params: { page, pageSize },
    });
    if (Array.isArray(data)) return normalizeList(data);
    return { items: normalizeList(data.items ?? []), total: data.total ?? data.items?.length ?? 0 };
  },

  /** Aprobar / Rechazar solicitud */
  async updateRequestStatus(
    id: string,
    payload: { status: "approved" | "rejected"; message?: string }
  ) {
    const { data } = await http.patch(`/admin/studios/requests/${id}`, payload);
    return data;
  },

  /** Nuevos estudios por día (últimos N días) */
  async timeseriesNew({ days = 30 }: TimeseriesParams): Promise<TimeseriesPoint[]> {
    const { data } = await http.get<TimeseriesPoint[]>("/admin/studios/timeseries", {
      params: { days },
    });
    return Array.isArray(data) ? data : [];
  },

  /** Conteo por estado (normalizado) */
  async countByStatus(): Promise<Record<string, number>> {
    const { data } = await http.get<Record<string, number>>("/admin/studios/status-counts");
    const out: Record<string, number> = {};
    Object.entries(data ?? {}).forEach(([k, v]) => (out[normalizeStatus(k)] = Number(v) || 0));
    return out;
  },

  /** Total de estudios aprobados (o activos) */
  async count(): Promise<number> {
    try {
      const counts = await AdminStudiosService.countByStatus();
      return counts["aprobado"] ?? 0;
    } catch {
      try {
        const { data } = await http.get<{ items?: any[]; total?: number } | any[]>(
          "/admin/studios/active",
          { params: { page: 1, pageSize: 1 } }
        );
        if (Array.isArray(data)) return data.length;
        if (typeof (data as any)?.total === "number") return (data as any).total;
        return Array.isArray((data as any)?.items) ? (data as any).items.length : 0;
      } catch {
        return 0;
      }
    }
  },
};

export { normalizeStatus }; // si lo querés reutilizar
