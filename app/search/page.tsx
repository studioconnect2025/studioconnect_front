import { Suspense } from "react";
import Search from "@/components/search/search";

export default function SearchPage() {
  return (
    <Suspense fallback={   <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 text-lg font-medium">Cargando estudios...</p>
          </div>}>
      <Search />
    </Suspense>
  );
}
