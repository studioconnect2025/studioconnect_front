import { http } from "@/lib/http";
import { ApiError, toApiError } from "@/utils/ApiError";
import type { LoginPayload, LoginResponse, MeResponse, GoogleRegistrationPayload } from "@/types/Auth";


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

type ResetPasswordPayload = { token: string; newPassword: string };

export const dynamic = "force-dynamic"; 

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
        localStorage.setItem("accessToken", accessToken); 
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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  try {
    await http.post(
      "/auth/logout",
      {}, // mejor que null
      {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
  } catch (e: any) {
    const status = e?.response?.status;
  
    if (![401, 403, 404, 405].includes(status)) {
      throw toApiError(e);
    }
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  
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
    } catch (e) {
      return { valid: false };
    }
  },

  // Método para completar registro con Google (CON DEBUG LOGS)
  async completeGoogleRegistration(payload: GoogleRegistrationPayload): Promise<{ accessToken: string; user?: any }> {
    try {
      // Debug logs para ver qué se está enviando
      console.log('🚀 Sending registration request:', {
        payload,
        headers: {
          Authorization: `Bearer ${payload.registrationToken}`,
        }
      });

      const { data } = await http.post<LoginResponse>("/auth/register/google", payload, {
        headers: {
          Authorization: `Bearer ${payload.registrationToken}`,
        },
      });
      
      console.log('✅ Registration response received:', data);
      
      const { accessToken, user } = normalizeLoginResponse(data);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }
      
      return { accessToken, user };
    } catch (e: any) {
      console.error('❌ Registration error:', {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
        config: {
          url: e?.config?.url,
          method: e?.config?.method,
          headers: e?.config?.headers,
        }
      });
      throw toApiError(e);
    }
  },

  // Método para obtener la URL de login de Google
  getGoogleLoginUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const cleanBaseUrl = baseUrl.replace(/\/$/, ''); // Remover "/" al final si existe
    
    console.log('🚀 Google Login URL:', `${cleanBaseUrl}/auth/google/login`); // Para debug
    return `${cleanBaseUrl}/auth/google/login`;
  },
};