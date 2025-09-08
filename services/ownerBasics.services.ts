import { http } from "@/lib/Http";
import { toApiError } from "@/utils/ApiError";

export type BasicInfo = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  profilePhoto: string | null;
  businessBio?: string | null;
  role?: string | null;
  isActive?: boolean | null;
};

type RawUser = {
  id: string;
  email: string;
  passwordHash?: string;
  isActive?: boolean;
  role?: string;
  studio?: unknown;
  bookings?: unknown[];
  // opcionales (si algún día existen)
  firstName?: string;
  lastName?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  phoneNumber?: string;
  phone?: string;
  telephone?: string;
  avatarUrl?: string;
  profilePhoto?: string;
  photo?: string;
  image?: string;
  bio?: string;
  businessBio?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    photo?: string;
    image?: string;
    bio?: string;
    businessBio?: string;
  };
};

function inferNamesFromEmail(email: string): { firstName: string | null; lastName: string | null } {
  const local = email.split("@")[0]; // ej: juan.perez
  // separadores comunes: ".", "_", "-"
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return { firstName: cap(parts[0]), lastName: cap(parts[1]) };
  }
  return { firstName: null, lastName: null };
}

function normalizeBasicInfo(raw: RawUser): BasicInfo {
  const nameFromFull = raw.name?.trim();
  const [fullFirst, ...rest] = nameFromFull ? nameFromFull.split(" ") : [null];
  const fullLast = rest?.length ? rest.join(" ") : null;

  let firstName =
    raw.firstName ??
    raw.profile?.firstName ??
    raw.given_name ??
    fullFirst;

  let lastName =
    raw.lastName ??
    raw.profile?.lastName ??
    raw.family_name ??
    fullLast;

  if (!firstName && !lastName && raw.email) {
    const inferred = inferNamesFromEmail(raw.email);
    firstName = inferred.firstName;
    lastName = inferred.lastName;
  }

  const phone =
    raw.phoneNumber ??
    raw.phone ??
    raw.telephone ??
    raw.profile?.phoneNumber ??
    null;

  const photo =
    raw.profilePhoto ??
    raw.avatarUrl ??
    raw.photo ??
    raw.image ??
    raw.profile?.avatarUrl ??
    raw.profile?.photo ??
    raw.profile?.image ??
    null;

  const bio =
    raw.businessBio ??
    raw.profile?.businessBio ??
    raw.bio ??
    raw.profile?.bio ??
    null;

  return {
    id: raw.id,
    email: raw.email,
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    phoneNumber: phone ?? null,
    profilePhoto: photo ?? null,
    businessBio: bio ?? null,
    role: raw.role ?? null,
    isActive: raw.isActive ?? null,
  };
}

export async function getOwnerBasicInfoById(id: string): Promise<BasicInfo> {
  try {
    const { data } = await http.get<RawUser>(`/users/${id}`);
    return normalizeBasicInfo(data);
  } catch (e) {
    throw toApiError(e);
  }
}
