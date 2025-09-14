import { http } from "@/lib/Http";

export const profileService = {
  getMyProfile: async () => {
    try {
      const response = await http.get("/profile/me");
      return response.data;
    } catch (error: any) {
      console.error("Error en profileService.getMyProfile:", error);
      throw new Error("No se pudo obtener el perfil");
    }
  },

  updateProfile: async ({ profileData }: { profileData: any }) => {
    try {
      const response = await http.patch("/profile/me", profileData);
      return response.data;
    } catch (error: any) {
      console.error("Error en profileService.updateProfile:", error);
      throw new Error("No se pudo actualizar el perfil");
    }
  },

  updateProfilePicture: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file); 

      const response = await http.patch("/profile/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error: any) {
      console.error("Error en profileService.updateProfilePicture:", error);
      throw new Error("No se pudo actualizar la foto de perfil");
    }
  },

  deleteAccount: async () => {
    try {
      const response = await http.delete("/profile/me");
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