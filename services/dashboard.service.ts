import { http } from "@/lib/http";

export type Reservation = {
  id: string;
  room: string;
  studio: string;
  musician: string;
  startTime: string;
  endTime: string;
  isPaid: boolean;
  totalPrice: number | null;
};

export const dashboardService = {
  async getRooms() {
    const res = await http.get("/owners/me/studio/rooms");
    return res.data ?? [];
  },

  async getBookings() {
    const res = await http.get("/bookings/owner/my-bookings");
    return res.data ?? [];
  },
};
