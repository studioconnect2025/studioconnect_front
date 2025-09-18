"use client";

import { useSearchParams } from "next/navigation";
import OwnerRegisterForm from "@/components/registerformOwner/registerFormOwner";

export default function StudioOwnerRegisterHandler() {
  const searchParams = useSearchParams();

  const firstName = searchParams.get("firstName") ?? "";
  const lastName = searchParams.get("lastName") ?? "";
  const email = searchParams.get("email") ?? "";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <OwnerRegisterForm
        defaultValues={{
          nombre: firstName,
          apellido: lastName,
          email,
        }}
      />
    </main>
  );
}
