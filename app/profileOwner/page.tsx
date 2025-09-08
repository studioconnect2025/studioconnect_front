"use client";

import BasicInfoCard from "@/components/profileOwner/BasicInfoCard";

export default function ProfileOwnerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <BasicInfoCard onEdit={() => console.log("Abrir componente de edición")} />
      </div>
    </div>
  );
}
