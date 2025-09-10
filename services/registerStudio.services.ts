// src/services/studio.services.ts
import { http } from "@/lib/Http";

export const registerStudio = async (values: any, files: any) => {
  const token = localStorage.getItem("accessToken");

  const formData = new FormData();

  // Campos de texto
  formData.append("name", values.name);
  formData.append("studioType", values.studioType); // "grabacion" | "ensayo" | "produccion"
  formData.append("city", values.city);
  formData.append("province", values.province);
  formData.append("address", values.address);
  formData.append("description", values.description);
  formData.append("openingTime", String(values.openingTime));
  formData.append("closingTime", String(values.closingTime));

  // Servicios (array de strings)
  values.services?.forEach((s: string) => formData.append("services[]", s));

  // Equipamiento disponible (array de strings)
  values.availableEquipment?.forEach((e: string) => formData.append("availableEquipment[]", e));

  // Archivos
  if (files.comercialRegister) {
    formData.append("comercialRegister", files.comercialRegister);
  }
  if (files.photos?.length) {
    files.photos.forEach((file: File) => {
      formData.append("photos", file);
    });
  }

  // Request
  return await http.post("/owners/me/studio/files", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
