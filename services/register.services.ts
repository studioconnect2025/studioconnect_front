import { http } from "@/lib/http";

/** ===== Registrar dueño de estudio ===== */
export async function registerStudioOwner(data: any) {
  try {
    const res = await http.post("/auth/register/studio-owner", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Error desconocido";
    console.log("Error en registerStudioOwner:", message);
    throw new Error(message); // <-- lanzar solo el mensaje
  }
}

/** ===== Registrar músico ===== */
export async function registerMusician(payload: any) {
  try {
    const res = await http.post("/auth/register/musician", payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Error desconocido";
    console.log("Error en registerMusician:", message);
    throw new Error(message);
  }
}

