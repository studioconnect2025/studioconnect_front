import { http } from "@/lib/http";
import { ApiError, toApiError } from "@/utils/ApiError";
import type { LoginPayload, LoginResponse, MeResponse, GoogleRegistrationPayload } from "@/types/Auth";

function extractRawToken(raw: any): string | undefined {
  return (
    raw?.accessToken ??
    raw?.token ??
    raw?.access_token ??
    raw?.data?.accessToken ??
    raw?.data?.token ??
    raw?.data?.access_token
  );
}

type ResetPasswordPayload = { token: string; newPassword: string };
export const dynamic = "force-dynamic";

function normalizeBearer(token: string): string {
  return String(token).replace(/^Bearer\s+/i, "");
}

function decodeJwtPayload(token: string): any | null {
  try {
    const seg = token.split(".")[1];
    return JSON.parse(atob(seg.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function normalizeRoleName(raw: any): string {
  if (!raw) return "";
  const base = String(raw)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // quita tildes
    .toUpperCase()
    .trim();

  const map: Record<string, string> = {
    "DUENO DE ESTUDIO": "OWNER",
    "DUeNO DE ESTUDIO": "OWNER", // redundante pero harmless
    PROPIETARIO: "OWNER",
    OWNER: "OWNER",
    HOST: "HOST",
    ADMIN: "ADMIN",
    ADMINISTRADOR: "ADMIN",
    MUSICO: "MUSICIAN",
    MUSICIAN: "MUSICIAN",
  };
  return map[base] ?? base;
}

function normalizeLoginResponse(raw: any): { accessToken: string; user?: any } {
  const maybeToken = extractRawToken(raw);
  const user = raw?.user ?? raw?.data?.user ?? raw?.payload?.user;
  if (!maybeToken) throw new ApiError("Formato de respuesta de login inesperado", undefined, raw);
  const accessToken = normalizeBearer(maybeToken);
  return { accessToken, user };
}

function setSessionCookies(accessToken: string, user?: any) {
  if (typeof window === "undefined") return;

  const maxAge = 60 * 60 * 24;
  document.cookie = `accessToken=${accessToken}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;

  const payload = decodeJwtPayload(accessToken) || {};
  const fromToken = payload?.role;
  const fromUser =
    user?.role ??
    user?.type ??
    (Array.isArray(user?.roles) ? user.roles[0] : undefined);

  const role = normalizeRoleName(fromToken ?? fromUser ?? "");
  if (role) {
    document.cookie = `role=${role}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  }
}

function clearSessionCookies() {
  if (typeof window === "undefined") return;
  document.cookie = "accessToken=; Path=/; Max-Age=0; SameSite=Lax";
  document.cookie = "role=; Path=/; Max-Age=0; SameSite=Lax";
}

export const AuthService = {
  async login(payload: LoginPayload): Promise<{ accessToken: string; user?: any }> {
    try {
      const { data } = await http.post<LoginResponse>("/auth/login", payload);
      const { accessToken, user } = normalizeLoginResponse(data);
      if (typeof window !== "undefined") localStorage.setItem("accessToken", accessToken);
      setSessionCookies(accessToken, user);
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
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    try {
      await http.post(
        "/auth/logout",
        {},
        { withCredentials: true, headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
    } catch (e: any) {
      const status = e?.response?.status;
      if (![401, 403, 404, 405].includes(status)) throw toApiError(e);
    } finally {
      if (typeof window !== "undefined") localStorage.removeItem("accessToken");
      clearSessionCookies();
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await http.post("/auth/password-reset/forgot", { email });
    } catch (e) {
      throw toApiError(e);
    }
  },

  async resetPassword({ token, newPassword }: ResetPasswordPayload): Promise<void> {
    try {
      await http.post("/auth/password-reset/reset", { token, newPassword });
    } catch (e) {
      throw toApiError(e);
    }
  },

  async validateResetToken(token: string): Promise<{ valid: boolean }> {
    try {
      const { data } = await http.get(`/auth/password-reset/validate-token?token=${token}`);
      return data;
    } catch {
      return { valid: false };
    }
  },

  async completeGoogleRegistration(payload: GoogleRegistrationPayload): Promise<{ accessToken: string; user?: any }> {
    try {
      const { data } = await http.post<LoginResponse>("/auth/register/google", payload, {
        headers: { Authorization: `Bearer ${payload.registrationToken}` },
      });
      const { accessToken, user } = normalizeLoginResponse(data);
      if (typeof window !== "undefined") localStorage.setItem("accessToken", accessToken);
      setSessionCookies(accessToken, user);
      return { accessToken, user };
    } catch (e: any) {
      throw toApiError(e);
    }
  },

  getGoogleLoginUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");
    return `${cleanBaseUrl}/auth/google/login`;
  },
};
