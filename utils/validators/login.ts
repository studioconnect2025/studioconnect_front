import type { LoginPayload } from "@/types/Auth";

export type FieldErrors = Partial<Record<keyof LoginPayload, string>>;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email || email.trim() === "") return "El email es obligatorio.";
  if (email.length > 254) return "El email es demasiado largo.";
  if (!emailRegex.test(email)) return "Formato de email inválido.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password || password.trim() === "") return "La contraseña es obligatoria.";
  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
  if (password.length > 128) return "La contraseña es demasiado larga.";
  return null;
}

export function validateLogin(payload: LoginPayload): FieldErrors {
  const errors: FieldErrors = {};

  const emailErr = validateEmail(payload.email);
  if (emailErr) errors.email = emailErr;

  const passErr = validatePassword(payload.password);
  if (passErr) errors.password = passErr;

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}
