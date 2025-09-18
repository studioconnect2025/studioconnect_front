"use client";

import { Suspense } from "react";
import { Loader } from "@/components/common/Loader";
import AuthCallbackHandler from "./AuthCallbackHandler";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  );
}
