export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  studioStatus?: "aprovado" | "pendiente" | "rechazado";
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};

export type MeResponse = User;

export type RefreshResponse = {
  accessToken: string;
};

export type GoogleRegistrationPayload = {
  role: 'MUSICIAN' | 'STUDIO_OWNER';
  registrationToken: string;
};