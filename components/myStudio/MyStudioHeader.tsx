"use client";

import Link from "next/link";

type Props = {
  onEditStudio?: () => void;
  locationText?: string;
};

export default function MyStudioHeader({ onEditStudio, locationText }: Props) {
  // Estilo unificado: igual a los otros botones azules (bajos, elegantes)
  const btnBlue =
    "inline-flex items-center justify-center py-1.5 rounded-md px-4 text-sm font-medium " +
    "text-white bg-[#03597E] hover:bg-[#024d6f] " + // azul de la app + hover
    "shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 text-gray-800">
      <div className="h-15 w-full rounded-lg bg-gray-100/80 px-3 py-2 text-sm text-gray-600 flex items-center">
        {locationText || "Ubicación • Ciudad, Provincia"}
      </div>

      <div className="ml-4 flex gap-4">
        {/* Ambos con el MISMO estilo azul y la misma altura */}
        {onEditStudio ? (
          <button onClick={onEditStudio} className={btnBlue}>
            Editar datos del estudio
          </button>
        ) : (
          <Link href="/studioForm" className={btnBlue}>
            Editar datos del estudio
          </Link>
        )}

        <Link href="/studioRooms" className={btnBlue}>
          Editar salas
        </Link>
      </div>
    </div>
  );
}
