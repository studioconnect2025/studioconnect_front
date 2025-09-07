import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/";

export interface OwnerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface StudioInfo {
  name: string;
  city: string;
  province: string;
  address: string;
  description: string;
}

export interface StudioOwnerRegisterPayload {
  ownerInfo: OwnerInfo;
  studioInfo: StudioInfo;
}

export interface StudioOwnerRegisterResponse {
  message: string;
}

export async function registerStudioOwner(
  data: StudioOwnerRegisterPayload
): Promise<StudioOwnerRegisterResponse> {
  const url = new URL("auth/register/studio-owner", API).toString();
  const payload: StudioOwnerRegisterPayload = {
    ownerInfo: {
      firstName: data.ownerInfo.firstName,
      lastName: data.ownerInfo.lastName,
      email: data.ownerInfo.email,
      phoneNumber: data.ownerInfo.phoneNumber,
      password: data.ownerInfo.password,
    },
    studioInfo: {
      name: data.studioInfo.name,
      city: data.studioInfo.city,
      province: data.studioInfo.province,
      address: data.studioInfo.address,
      description: data.studioInfo.description,
    },
  };
  const res = await axios.post(url, payload, { withCredentials: true });
  return res.data as StudioOwnerRegisterResponse;
}
