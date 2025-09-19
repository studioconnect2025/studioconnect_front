import { http } from "@/lib/http";
import { ApiError, toApiError } from "@/utils/ApiError";

export type Studio = {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  codigoPostal?: string;
 pricePerHour: string
  // Coordenadas
  lat?: number;
  lng?: number;

  // Info extra
  studioType?: string;
  rating?: number;
  reviewsCount?: number;
  services?: string[];
  photos?: string[];
  amenities?: string[];


  // Horarios
  openingTime?: string;
  closingTime?: string;

  // Estado
  isActive?: boolean;
  status?: string;
};


export interface UpdateStudioPayload {
  name?: string;
  description?: string;
  hourlyRate?: number;
  // ...
}

export const OwnerService = {
  async getAllStudios(): Promise<Studio[]> {
    try {
      const { data } = await http.get<Studio[]>("/studios");
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },

  async getStudioById(id: string): Promise<Studio> {
    try {
      const { data } = await http.get<Studio>(`/studios/${id}`);
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },

  async getMyStudios(): Promise<Studio[]> {
    try {
      const { data } = await http.get<Studio[]>("/studios/me/my-studios");
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },


  // aca esta el updateOwner
  async updateMyStudio(id: string, payload: UpdateStudioPayload): Promise<Studio> {
    try {
      const { data } = await http.patch<Studio>(`/studios/me/${id}`, payload);
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },

  async uploadStudioPhoto(id: string, file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await http.post(`/studios/me/${id}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },
};
