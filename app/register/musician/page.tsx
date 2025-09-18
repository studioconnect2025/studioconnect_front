"use client";

import { useSearchParams } from "next/navigation";
import RegisterForm from "@/components/musicianRegister/musicianRegister";

export default function MusicianRegisterPage() {
  const searchParams = useSearchParams();

  // 📌 Capturamos los datos desde la URL
  const nombre = searchParams.get("nombre") || "";
  const apellido = searchParams.get("apellido") || "";
  const email = searchParams.get("email") || "";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <RegisterForm
        defaultValues={{
          nombre,
          apellido,
          email,
        }}
      />
    </main>
  );
}
