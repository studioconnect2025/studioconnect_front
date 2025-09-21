import { http, parseHttpError } from "@/lib/http";

export type AdminBooking = {
  id: string;
  date: string;
  status: string;  
  userId?: string;
  studioId?: string;
};

type BookingsArrayResp = AdminBooking[];
type BookingsWrappedResp = { bookings: AdminBooking[]; total?: number };

function toArray(data: BookingsArrayResp | BookingsWrappedResp): AdminBooking[] {
  return Array.isArray(data) ? data : (data?.bookings ?? []);
}

export const AdminBookingsService = {
  async getAll(): Promise<AdminBooking[]> {
    try {
      const { data } = await http.get<BookingsArrayResp | BookingsWrappedResp>("/admin/bookings");
      return toArray(data);
    } catch (e) {
      throw parseHttpError(e);
    }
  },

  async count(): Promise<number> {
    try {
      const { data } = await http.get<BookingsArrayResp | BookingsWrappedResp>("/admin/bookings");
      if (Array.isArray(data)) return data.length;
      if (typeof (data as BookingsWrappedResp)?.total === "number") {
        return (data as BookingsWrappedResp).total!;
      }
      return ((data as BookingsWrappedResp)?.bookings ?? []).length;
    } catch (e) {
      throw parseHttpError(e);
    }
  },
};
