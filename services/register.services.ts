import { http } from "@/lib/http";
import axios from "axios";

// Registrar dueño de estudio
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

// Registrar músico
export async function registerMusician(payload: {
  email: string;
  password: string;
  confirmPassword: string;
  profile: {
    nombre: string;
    apellido: string;
    numeroDeTelefono: string;
    ubicacion?: { 
      ciudad: string;
      provincia: string;
      calle: string;
      codigoPostal: string;
    };
  };
}) {
  const url = `${API.replace(/\/$/, "")}/auth/register/musician`;
  try {
    const res = await axios.post(url, payload, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    console.error("Error en registerMusician:", err.response?.data ?? err);
    throw err;
  }
}
