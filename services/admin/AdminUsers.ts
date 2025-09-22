// services/admin/AdminUsers.ts
import { http, parseHttpError } from "@/lib/http";

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  name?: string;
  status?: string;
  isActive?: boolean;
  lastSeenAt?: string;
  profileImageUrl?: string;
  createdAt?: string;
  profile?: { createdAt?: string };
  studio?: { createdAt?: string };
};

// Respuestas posibles del backend
type UsersArrayResp = AdminUser[];
type UsersWrappedResp = {
  users: AdminUser[];
  total?: number;
  page?: number;
  pageSize?: number;
  nextPage?: number | null;
};
type UsersResp = UsersArrayResp | UsersWrappedResp;

function toArray(data: UsersResp): AdminUser[] {
  return Array.isArray(data) ? data : (data?.users ?? []);
}

export const AdminUsersService = {
  async getAll(): Promise<AdminUser[]> {
    try {
      const { data } = await http.get<UsersResp>("/admin/users");
      return toArray(data);
    } catch (err) {
      throw parseHttpError(err);
    }
  },

  async count(): Promise<number> {
    try {
      const { data } = await http.get<UsersResp>("/admin/users");
      if (Array.isArray(data)) return data.length;
      if (data && typeof (data as UsersWrappedResp).total === "number") {
        return (data as UsersWrappedResp).total!;
      }
      const users = (data as UsersWrappedResp)?.users;
      return Array.isArray(users) ? users.length : 0;
    } catch (err) {
      throw parseHttpError(err);
    }
  },

  async latest(n = 5): Promise<AdminUser[]> {
    const all = await this.getAll();
    const sorted = [...all].sort((a, b) => {
      const A = (a.lastSeenAt ?? a.createdAt ?? a.profile?.createdAt) ?? "";
      const B = (b.lastSeenAt ?? b.createdAt ?? b.profile?.createdAt) ?? "";
      return new Date(B).getTime() - new Date(A).getTime();
    });
    return sorted.slice(0, n);
  },

  /** Trae TODAS las páginas (si el backend pagina) */
  async getAllPages(pageSize = 500): Promise<AdminUser[]> {
    try {
      const firstRes = await http.get<UsersResp>("/admin/users");
      const first = firstRes.data;

      // Caso A: array plano
      if (Array.isArray(first)) return first;

      // Caso B: envuelto con paginación
      const acc: AdminUser[] = [];
      const firstItems = (first as UsersWrappedResp)?.users ?? [];
      const total = (first as UsersWrappedResp)?.total;
      const firstPage = (first as UsersWrappedResp)?.page ?? 1;
      const size = (first as UsersWrappedResp)?.pageSize ?? pageSize;
      let nextPage =
        (first as UsersWrappedResp)?.nextPage ??
        (firstItems.length === size ? firstPage + 1 : null);

      acc.push(...firstItems);

      if (!nextPage && (typeof total !== "number" || acc.length >= total)) {
        return acc;
      }

      while (nextPage) {
        const { data } = await http.get<UsersResp>("/admin/users", {
          params: { page: nextPage, pageSize: size },
        });

        if (Array.isArray(data)) {
          acc.push(...data);
          break;
        }

        const wrapped = data as UsersWrappedResp;
        const batch = wrapped.users ?? [];
        acc.push(...batch);

        const reachedTotal = typeof total === "number" ? acc.length >= total : false;
        if (reachedTotal || batch.length < size) break;

        nextPage = wrapped.nextPage ?? (batch.length === size ? nextPage + 1 : null);
      }

      return acc;
    } catch (err) {
      throw parseHttpError(err);
    }
  },

  /** Búsqueda paginada por email (usa server si existe; sino filtra en cliente) */
  async searchPaginated(params: {
    q?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: AdminUser[]; total: number }> {
    const { q = "", page = 1, pageSize = 10 } = params;
    try {
      // Intento server-side
      const { data } = await http.get<UsersResp>("/admin/users", {
        params: { q, email: q, page, pageSize },
      });

      if (Array.isArray(data)) {
        // Sin paginar del lado del back → filtramos/ordenamos/paginamos acá
        const all = data;
        const filtered = q
          ? all.filter((u) => u.email?.toLowerCase().includes(q.toLowerCase()))
          : all;
        const sorted = [...filtered].sort((a, b) => {
          const A = (a.createdAt ?? a.profile?.createdAt ?? "") as string;
          const B = (b.createdAt ?? b.profile?.createdAt ?? "") as string;
          return new Date(B).getTime() - new Date(A).getTime();
        });
        const start = (page - 1) * pageSize;
        return { items: sorted.slice(start, start + pageSize), total: filtered.length };
      }

      // Envuelto → asumimos que el back ya filtró/paginó
      const wrapped = data as UsersWrappedResp;
      const items = wrapped.users ?? [];
      const total = wrapped.total ?? items.length;
      return { items, total };
    } catch (err) {
      // Fallback total: traemos todo y filtramos en cliente
      const all = await this.getAllPages();
      const filtered = q
        ? all.filter((u) => u.email?.toLowerCase().includes(q.toLowerCase()))
        : all;
      const sorted = [...filtered].sort((a, b) => {
        const A = (a.createdAt ?? a.profile?.createdAt ?? "") as string;
        const B = (b.createdAt ?? b.profile?.createdAt ?? "") as string;
        return new Date(B).getTime() - new Date(A).getTime();
      });
      const start = (page - 1) * pageSize;
      return { items: sorted.slice(start, start + pageSize), total: filtered.length };
    }
  },

  /** Toggle activo/inactivo. Acepta mensaje (motivo) cuando desactivás. */
  async toggleStatus(id: string, message?: string) {
    try {
      // Si tu endpoint es POST, reemplazá por http.post
      const { data } = await http.patch(`/admin/users/${id}/toggle-status`, { message });
      return data;
    } catch (err) {
      throw parseHttpError(err);
    }
  },
};
