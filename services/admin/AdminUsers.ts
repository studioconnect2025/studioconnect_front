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
};

// Tipos posibles de respuesta del back
type UsersArrayResp = AdminUser[];
type UsersWrappedResp = { users: AdminUser[]; total?: number };

function toArray(data: UsersArrayResp | UsersWrappedResp): AdminUser[] {
  return Array.isArray(data) ? data : (data?.users ?? []);
}

export const AdminUsersService = {
  async getAll(): Promise<AdminUser[]> {
    try {
      const { data } = await http.get<UsersArrayResp | UsersWrappedResp>("/admin/users");
      return toArray(data);
    } catch (err) {
      throw parseHttpError(err);
    }
  },

  async count(): Promise<number> {
    try {
      const { data } = await http.get<UsersArrayResp | UsersWrappedResp>("/admin/users");

      // Caso 1: array directo
      if (Array.isArray(data)) return data.length;

      // Caso 2: objeto con total explícito
      if (data && typeof (data as UsersWrappedResp).total === "number") {
        return (data as UsersWrappedResp).total!;
      }

      // Caso 3: objeto con users
      const users = (data as UsersWrappedResp)?.users;
      return Array.isArray(users) ? users.length : 0;
    } catch (err) {
      throw parseHttpError(err);
    }
  },

  async latest(n = 5): Promise<AdminUser[]> {
    const all = await this.getAll();
    const sorted = [...all].sort((a, b) => {
      if (!a.lastSeenAt || !b.lastSeenAt) return 0;
      return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
    });
    return sorted.slice(0, n);
  },
};
