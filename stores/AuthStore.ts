import { create } from "zustand";
import { persist } from "zustand/middleware";
import { http } from "@/lib/Http";
import type { User, LoginPayload, LoginResponse } from "@/types/Auth";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

type AuthActions = {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
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

   
      async login(payload) {
        set({ loading: true, error: null });
        try {
          const { data } = await http.post<LoginResponse>("/auth/login", payload);
          localStorage.setItem("accessToken", data.accessToken);
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            loading: false,
          });
        } catch (e: any) {
          set({
            error: e?.response?.data?.message || "No se pudo iniciar sesión",
            loading: false,
          });
        }
      },

      logout() {
        localStorage.removeItem("accessToken");
        set({ user: null, accessToken: null, isAuthenticated: false });
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
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);


export const useIsAuth = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthUser = () => useAuthStore((s) => s.user);
export const useAuthLoading = () => useAuthStore((s) => s.loading);
export const useAuthError = () => useAuthStore((s) => s.error);
