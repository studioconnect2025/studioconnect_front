import axios, { AxiosError } from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 60000,
  withCredentials: false, // usamos Bearer token, no cookies
});

http.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  config.headers = config.headers ?? {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete (config.headers as any).Authorization;
  return config;
});

/** Helper centralizado para transformar errores de Axios en Error legible */
export function parseHttpError(err: unknown): Error {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<any>;
    const msg =
      ax.response?.data?.message ??
      ax.response?.data?.error ??
      ax.message ??
      "Error desconocido";
    return new Error(Array.isArray(msg) ? msg.join(" | ") : String(msg));
  }
  return new Error("Error desconocido");
}
