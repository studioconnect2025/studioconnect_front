import { http } from "@/lib/http";

export const registerStudio = async (values: any, files: any) => {
  const token = localStorage.getItem("accessToken");

  const formData = new FormData();

  // Campos de texto
  formData.append("name", values.name);
  formData.append("studioType", values.studioType);
  formData.append("pais", values.pais);
  formData.append("codigoPostal", values.codigoPostal);
  formData.append("city", values.city);
  formData.append("province", values.province);
  formData.append("address", values.address);
  formData.append("description", values.description);
  formData.append("openingTime", String(values.openingTime));
  formData.append("closingTime", String(values.closingTime));

  // Arrays
  values.services?.forEach((s: string) => formData.append("services[]", s));
  values.availableEquipment?.forEach((e: string) =>
    formData.append("availableEquipment[]", e)
  );

  // Archivos
  if (files.comercialRegister) {
    formData.append("comercialRegister", files.comercialRegister);
  }
  if (files.photos?.length) {
    files.photos.forEach((file: File) => formData.append("photos", file));
  }

  // Aquí quitamos Content-Type manual
  return await http.post("/owners/me/studio/files", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
