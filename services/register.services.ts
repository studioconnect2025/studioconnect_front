import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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
