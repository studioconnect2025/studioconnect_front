import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthService } from "@/services/auth.service";
import { parseJwt } from "@/utils/jwt";
import type { User, LoginPayload, GoogleRegistrationPayload } from "@/types/Auth";
import { http } from "@/lib/http"; 
import { setAccessTokenCookie, clearAccessTokenCookie } from "@/utils/authCookies";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

type AuthActions = {
  setAuth: (data: { user: User | null; accessToken: string | null }) => void;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: User | null) => void;
  clearError: () => void;
  // Métodos para Google OAuth
  loginWithGoogle: () => void;
  completeGoogleRegistration: (payload: GoogleRegistrationPayload) => Promise<void>;
  handleGoogleCallback: (token: string) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setAuth(data) {
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: !!data.user && !!data.accessToken,
          loading: false,
          error: null,
        });
      },
      
      async login(payload) {
        set({ loading: true, error: null });
        try { 
          const res = await AuthService.login(payload); 
          localStorage.setItem("accessToken", res.accessToken);
setAccessTokenCookie(res.accessToken);          
const claims = parseJwt<{ sub?: string; email?: string; role?: string }>(res.accessToken);
          const finalUser: User | null = claims
            ? ({
                id: claims.sub ?? "",
                email: claims.email ?? "",
                role: claims.role,
                name: (claims.email?.split("@")[0] as string) ?? "",
              } as User)
            : null;

          set({
            user: finalUser,
            accessToken: res.accessToken,
            isAuthenticated: true,
            loading: false,
          });
        } catch (e: any) {
          localStorage.removeItem("accessToken");
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: e?.message || "No se pudo iniciar sesión",
            loading: false,
          });
        }
      },

      async logout() {
        try {
          await AuthService.logout(); 
        } finally {
          localStorage.removeItem("accessToken");
          clearAccessTokenCookie(); 
          delete (http as any).defaults?.headers?.common?.Authorization;
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },

      setUser(u) {
        set({ user: u, isAuthenticated: !!u });
      },

      clearError() {
        set({ error: null });
      },

      // Métodos para Google OAuth
      loginWithGoogle() {
        const googleLoginUrl = AuthService.getGoogleLoginUrl();
        window.location.href = googleLoginUrl;
      },

      async completeGoogleRegistration(payload) {
        set({ loading: true, error: null });
        try {
          console.log("Sending Google registration request:", {
            role: payload.role,
            token: payload.registrationToken,
          });

          // Hacemos la request manualmente para poder incluir el token en el header
          const res = await http.post(
            "/auth/register/google",
            { role: payload.role },
            {
              headers: {
                Authorization: `Bearer ${payload.registrationToken}`,
              },
            }
          );

          localStorage.setItem("accessToken", res.data.accessToken);
          setAccessTokenCookie(res.data.accessToken); 
          const claims = parseJwt<{ sub?: string; email?: string; role?: string }>(res.data.accessToken);
          const finalUser: User | null = claims
            ? ({
                id: claims.sub ?? "",
                email: claims.email ?? "",
                role: claims.role,
                name: res.data.user?.name || claims.email?.split("@")[0] || "",
              } as User)
            : null;

          set({
            user: finalUser,
            accessToken: res.data.accessToken,
            isAuthenticated: true,
            loading: false,
          });
        } catch (e: any) {
          console.error("Google registration error:", e?.response?.data || e);
          set({
            error:
              e?.response?.data?.message ||
              e?.message ||
              "Error completando registro con Google",
            loading: false,
          });
          throw e;
        }
      },

      handleGoogleCallback(token) {
        set({ loading: true, error: null });
        
        try {
          localStorage.setItem("accessToken", token);
          setAccessTokenCookie(token); 
          const claims = parseJwt<{ sub?: string; email?: string; role?: string }>(token);
          const finalUser: User | null = claims
            ? ({
                id: claims.sub ?? "",
                email: claims.email ?? "",
                role: claims.role,
                name: claims.email?.split("@")[0] || "",
              } as User)
            : null;

          set({
            user: finalUser,
            accessToken: token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (e: any) {
          localStorage.removeItem("accessToken");
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: "Error procesando token de Google",
            loading: false,
          });
        }
      },
    }),
    {
      name: "auth",
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);

export const useAuthLoading = () => useAuthStore((s) => s.loading);
export const useAuthError = () => useAuthStore((s) => s.error);
export const useIsAuth = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthUser = () => useAuthStore((s) => s.user);