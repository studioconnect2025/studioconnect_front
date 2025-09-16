import React, { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
