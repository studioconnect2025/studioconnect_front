// src/services/register.services.ts
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/";

export async function registerStudioOwner(data: any) {
  const url = new URL("auth/register/studio-owner", API).toString();
  const res = await axios.post(url, data, { withCredentials: true });
  return res.data;
}
