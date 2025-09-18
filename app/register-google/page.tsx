"use client";

import { Suspense } from "react";
import { Loader } from "@/components/common/Loader";
import RegisterGoogleHandler from "./RegisterGoogleHandler";

export default function RegisterGooglePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      }
    >
      <RegisterGoogleHandler />
    </Suspense>
  );
}
