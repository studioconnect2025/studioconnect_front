import { Suspense } from "react";
import Search from "@/components/search/search";

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Cargando búsqueda...</p>}>
      <Search />
    </Suspense>
  );
}
