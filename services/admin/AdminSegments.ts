// services/admin/AdminSegments.ts
import { http, parseHttpError } from "@/lib/http";

type UsersArray = any[];
type UsersWrapped = { users: any[]; total?: number };

function countFrom(data: UsersArray | UsersWrapped): number {
  if (Array.isArray(data)) return data.length;
  if (typeof (data as UsersWrapped)?.total === "number") return (data as UsersWrapped).total!;
  return ((data as UsersWrapped)?.users ?? []).length;
}

export const AdminSegmentsService = {
  async countMusicians(): Promise<number> {
    try {
      const { data } = await http.get<UsersArray | UsersWrapped>("/admin/musicians");
      return countFrom(data);
    } catch (e) {
      throw parseHttpError(e);
    }
  },
  async countStudioOwners(): Promise<number> {
    try {
      const { data } = await http.get<UsersArray | UsersWrapped>("/admin/studio-owners");
      return countFrom(data);
    } catch (e) {
      throw parseHttpError(e);
    }
  },
};
