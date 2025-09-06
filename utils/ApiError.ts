export class ApiError extends Error {
  status?: number;
  data?: unknown;
  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function toApiError(e: any): ApiError {
  const status = e?.response?.status;
  const data = e?.response?.data;

  const rawMsg =
    typeof data?.message === "string"
      ? data.message
      : Array.isArray(data?.message)
      ? data.message.join(" ")
      : undefined;

  const code = (data?.code || data?.error || data?.name || "").toString().toUpperCase();
  const msgLc = (rawMsg || "").toLowerCase();

  const userNotFoundHint =
    code.includes("USER_NOT_FOUND") ||
    code.includes("AUTH_USER_NOT_FOUND") ||
    /usuario\s+no\s+registrado|email\s+no\s+registrado|user\s+not\s+found|no\s+existe\s+(el|la)?\s*(usuario|user|email)/i.test(rawMsg || "");

  if (!status) {
    const isTimeout = e?.code === "ECONNABORTED";
    const message = isTimeout
      ? "Tiempo de espera agotado. Intentá de nuevo."
      : "No se pudo conectar con el servidor. Verificá que esté en marcha.";
    return new ApiError(message, undefined, data ?? e);
  }

  let message = "Error comunicando con el servidor";

  switch (status) {
    case 401:
      message = userNotFoundHint
        ? "Usuario no registrado."
        : "Email o contraseña incorrectos.";
      break;
    case 404:
    case 400:
      message = rawMsg || "Usuario no registrado.";
      break;
    case 403:
      if (code === "EMAIL_NOT_VERIFIED") message = "Debes verificar tu email.";
      else if (code === "ACCOUNT_BLOCKED") message = "Tu cuenta está bloqueada. Contactá soporte.";
      else message = rawMsg || "Acceso denegado.";
      break;
    case 422:
      message = rawMsg || "Revisá los campos.";
      return new ApiError(message, status, data);
    case 429:
      message = "Demasiados intentos. Probá de nuevo en un minuto.";
      break;
    default:
      message = status >= 500 ? "Servicio no disponible. Intentá más tarde." : (rawMsg || "Error al procesar la solicitud.");
  }

  return new ApiError(message, status, data);
}
