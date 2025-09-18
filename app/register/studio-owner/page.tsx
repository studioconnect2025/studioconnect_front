"use client";

import { useSearchParams } from "next/navigation";
import StudioConnectStudioForm from "@/components/forms/userOwnerForm";

export default function StudioOwnerRegisterPage() {
  const searchParams = useSearchParams();

  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const email = searchParams.get("email") || "";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <StudioConnectStudioForm
        defaultValues={{
          firstName,
          lastName,
          email,
        }}
      />
    </main>
  );
}
