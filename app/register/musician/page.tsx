"use client";

import { Suspense } from "react";
import { Loader } from "@/components/common/Loader";
import MusicianRegisterHandler from "./MusicianRegisterHandler";

export default function MusicianRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      }
    >
      <MusicianRegisterHandler />
    </Suspense>
  );
}
