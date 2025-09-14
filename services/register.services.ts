// src/services/auth.ts
import { http, parseHttpError } from "@/lib/Http";

/** ===== Tipos mínimos (pueden moverse a src/types/auth.ts si querés) ===== */
export interface UbicacionPayload {
  ciudad?: string;
  provincia?: string;
  calle?: string;
  codigoPostal?: string;
}

export interface ProfilePayload {
  nombre?: string;
  apellido?: string;
  numeroDeTelefono?: string;
  ubicacion?: UbicacionPayload;
  // también soportamos plano si alguna vista lo manda así:
  ciudad?: string;
  provincia?: string;
  calle?: string;
  codigoPostal?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  profile?: ProfilePayload; // opcional: el back crea igual el user
}

export interface RegisterResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string; // "Músico" | "Dueño de Estudio"
    isActive: boolean;
    profile?: {
      id: string;
      userId: string;
      nombre?: string;
      apellido?: string;
      numeroDeTelefono?: string;
      ciudad?: string;
      provincia?: string;
      calle?: string;
      codigoPostal?: string;
    };
  };
}

/** ===== Servicios ===== */

/** Registro de MÚSICO (el back fija role="Músico" por endpoint) */
export async function registerMusician(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  try {
    const { data } = await http.post<RegisterResponse>(
      "/auth/register/musician",
      payload
    );
    return data;
  } catch (err) {
    throw parseHttpError(err);
  }
}

/** Registro de DUEÑO (el back fija role="Dueño de Estudio" por endpoint) */
export async function registerStudioOwner(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  try {
    const { data } = await http.post<RegisterResponse>(
      "/auth/register/studio-owner",
      payload
    );
    return data;
  } catch (err) {
    throw parseHttpError(err);
  }
}
