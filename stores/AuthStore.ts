import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthService } from "@/services/auth.service";
import { parseJwt } from "@/utils/jwt";
import type { User, LoginPayload } from "@/types/Auth";
import { http } from "@/lib/Http"; 


type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

type AuthActions = {
  setAuth: (data: { user: User; accessToken: string }) => void; 
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: User | null) => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setAuth(data) {
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      },
      
      async login(payload) {
        set({ loading: true, error: null });
        try { 
          const res = await AuthService.login(payload); 
          localStorage.setItem("accessToken", res.accessToken);
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
