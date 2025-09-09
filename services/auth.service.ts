import { http } from "@/lib/Http";
import { ApiError, toApiError } from "@/utils/ApiError";
import type { LoginPayload, LoginResponse, MeResponse } from "@/types/Auth";

function normalizeLoginResponse(raw: any): { accessToken: string; user?: any } {
  const accessToken =
    raw?.accessToken ??
    raw?.token ??
    raw?.access_token ??        
    raw?.data?.accessToken ??
    raw?.data?.token ??
    raw?.data?.access_token;

  const user =
    raw?.user ??
    raw?.data?.user ??
    raw?.payload?.user;

  if (!accessToken) {
    throw new ApiError("Formato de respuesta de login inesperado", undefined, raw);
  }
  return { accessToken, user };
}

export const AuthService = {
  async login(payload: LoginPayload): Promise<{ accessToken: string; user?: any }> {
    try {
      const { data } = await http.post("/auth/login", payload);
      return normalizeLoginResponse(data);
    } catch (e) {
      throw toApiError(e);
    }
  },

  async me(): Promise<MeResponse> {
    try {
      const { data } = await http.get<MeResponse>("/auth/me");
      return data;
    } catch (e) {
      throw toApiError(e);
    }
  },

  async logout(): Promise<void> {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

      await http.post("/auth/logout", null, {
        withCredentials: true, 
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401 || status === 403 || status === 404 || status === 405) return;
      throw toApiError(e);
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await http.post("/auth/password-reset/forgot", { email });
    } catch (e) {
      throw toApiError(e);
    }
  },

  async resetPassword(payload: { token: string; password: string }): Promise<void> {
    try {
      await http.post("/auth/password-reset/reset", payload);
    } catch (e) {
      throw toApiError(e);
    }
  },

  async validateResetToken(token: string): Promise<{ valid: boolean }> {
    try {
      const { data } = await http.get(`/auth/password-reset/validate-token?token=${token}`);
      return data;
    } catch (e) {
      return { valid: false };
    }
  }
};
