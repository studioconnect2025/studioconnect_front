"use client";

import { Suspense } from "react";
import { Loader } from "@/components/common/Loader";
import StudioOwnerRegisterHandler from "./StudioOwnerRegisterHandler";

export default function StudioOwnerRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      }
    >
      <StudioOwnerRegisterHandler />
    </Suspense>
  );
}
