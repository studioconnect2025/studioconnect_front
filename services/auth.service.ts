import { http } from "@/lib/Http";
import { ApiError, toApiError } from "@/utils/ApiError";
import type { LoginPayload, LoginResponse, MeResponse } from "@/types/Auth";

function extractRawToken(raw: any):
  | string
  | undefined {
  return (
    raw?.accessToken ??
    raw?.token ??
    raw?.access_token ??
    raw?.data?.accessToken ??
    raw?.data?.token ??
    raw?.data?.access_token
  );
}

function normalizeBearer(token: string): string {
  return String(token).replace(/^Bearer\s+/i, "");
}

function normalizeLoginResponse(raw: any): { accessToken: string; user?: any } {
  const maybeToken = extractRawToken(raw);
  const user =
    raw?.user ??
    raw?.data?.user ??
    raw?.payload?.user;

  if (!maybeToken) {
    throw new ApiError("Formato de respuesta de login inesperado", undefined, raw);
  }

  const accessToken = normalizeBearer(maybeToken);
  return { accessToken, user };
}

export const AuthService = {
  async login(payload: LoginPayload): Promise<{ accessToken: string; user?: any }> {
    try {
      const { data } = await http.post<LoginResponse>("/auth/login", payload);
      const { accessToken, user } = normalizeLoginResponse(data);

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken); // <-- misma key que usa el interceptor
      }

      return { accessToken, user };
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
  }
};
