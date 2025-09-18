"use client";

import { useSearchParams } from "next/navigation";
import RegisterForm from "@/components/registerformMusician/registerForm";

export default function MusicianRegisterHandler() {
  const searchParams = useSearchParams();

  // 📌 Capturamos los datos desde la URL (si no existen → "")
  const nombre = searchParams.get("nombre") ?? "";
  const apellido = searchParams.get("apellido") ?? "";
  const email = searchParams.get("email") ?? "";

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
