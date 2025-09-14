import { http } from "@/lib/Http";

const getAccessToken = () =>
  (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);

export const profileService = {
  // Devuelve null si no hay sesión o si el endpoint no está disponible (401/403/404)
  getMyProfile: async () => {
    try {
      const token = getAccessToken();
      if (!token) return null;

      const response = await http.get("/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data ?? null;
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401 || status === 403 || status === 404) return null; // usuario público o ruta ausente
      console.error("Error en profileService.getMyProfile:", error);
      return null; // no arrojar error: evita crashear Header/UI en build/start
    }
  },

  updateProfile: async ({ profileData }: { profileData: any }) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("No hay sesión activa");

      const response = await http.patch("/profile/me", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error en profileService.updateProfile:", error);
      throw new Error("No se pudo actualizar el perfil");
    }
  },

  updateProfilePicture: async (file: File) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("No hay sesión activa");

      const formData = new FormData();
      formData.append("file", file);

<<<<<<< HEAD
      const response = await http.patch("/profile/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
=======
      const response = await http.patch("/profile/me/picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
>>>>>>> 6b49b91 (Estudios destacados: usar fotos reales + placeholder. Cloudinary ok. Header tolerante.)
      });

      return response.data;
    } catch (error: any) {
      console.error("Error en profileService.updateProfilePicture:", error);
      throw new Error("No se pudo actualizar la foto de perfil");
    }
  },

  deleteAccount: async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("No hay sesión activa");

      const response = await http.delete("/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error en profileService.deleteAccount:", error);
      throw new Error("No se pudo eliminar la cuenta");
    }
  },

  resetPassword: async ({ token, newPassword }: { token: string; newPassword: string }) => {
    try {
      const response = await http.post("/auth/password-reset/reset", { token, newPassword });
      return response.data;
    } catch (error: any) {
      console.error("Error en profileService.resetPassword:", error);
      throw error;
    }
  },
};