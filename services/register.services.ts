import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/";

export async function registerStudioOwner(data: any) {
  const url = new URL("auth/register/studio-owner", API).toString();
  const res = await axios.post(url, data, { withCredentials: true });
  return res.data;
}

// Ahora el tipo acepta el payload completo con profile y ubicacion
export async function registerMusician(payload: {
  email: string;
  password: string;
  confirmPassword: string;
  profile: {
    nombre: string;
    apellido: string;
    numeroDeTelefono: string;
    ubicacion: {
      ciudad: string;
      provincia: string;
      calle: string;
      codigoPostal: string;
    };
  };
}) {
  const url = new URL("auth/register/musician", API).toString();

  console.log("Payload enviado al backend:", payload); // Aquí ves todo en consola

  const res = await axios.post(url, payload, { withCredentials: true });
  return res.data;
}
