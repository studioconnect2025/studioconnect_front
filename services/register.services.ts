import { http, parseHttpError } from "@/lib/http";

// Registrar dueño de estudio
export async function registerStudioOwner(data: any) {
  try {
    const res = await http.post("/auth/register/studio-owner", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    throw parseHttpError(err);
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
  try {
    const res = await http.post("/auth/register/musician", payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    throw parseHttpError(err);
  }
}
