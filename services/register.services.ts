// src/services/auth.ts
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** ===== Registrar dueño de estudio ===== */
export async function registerStudioOwner(data: any) {
  const url = `${API.replace(/\/$/, "")}/auth/register/studio-owner`;
  try {
    const res = await axios.post(url, data, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    console.error("Error en registerStudioOwner:", err.response?.data ?? err);
    throw err;
  }
}

/** ===== Registrar músico ===== */
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