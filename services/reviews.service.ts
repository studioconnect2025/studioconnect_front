// src/services/reviews.service.ts
import { http } from "@/lib/http";
import { ApiError, toApiError } from "@/utils/ApiError";

export type MusicianRef = {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: string;
};

export type RoomRef = {
  id: string;
  name?: string;
  studio?: { id?: string; name?: string };
};

export type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt?: string;
  created_at?: string; // por si el backend devuelve snake_case
  updatedAt?: string;
  musician?: MusicianRef;
  room?: RoomRef;
  booking?: { id: string };
};

export const ReviewsService = {
  async getRoomReviews(roomId: string): Promise<Review[]> {
    try {
      const { data } = await http.get<Review[]>(`/reviews/room/${roomId}`);
      return data ?? [];
    } catch (e) {
      throw toApiError(e);
    }
  },

  /**
   * Crear reseña (endpoint protegido -> necesita JWT).
   * Si tu `http` ya setea el token con interceptor no hace falta pasar `token`.
   * Si no, podés pasar token opcionalmente.
   */
  async createReview(
    bookingId: string,
    payload: { rating: number; comment?: string },
    token?: string
  ): Promise<Review> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await http.post<Review>(`/reviews/${bookingId}`, payload, config);
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },

  async getOwnerReviews(): Promise<Review[]> {
    try {
      const { data } = await http.get<Review[]>("/reviews/owner/my-reviews");
      return data ?? [];
    } catch (e) {
      throw toApiError(e);
    }
  },
};

export default ReviewsService;
