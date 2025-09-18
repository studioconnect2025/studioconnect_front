// components/myStudio/MyStudioHeader.tsx
"use client";

type Props = {
  onEditStudio?: () => void;
};

export default function MyStudioHeader({ onEditStudio }: Props) {
  return (
    <div className="bg-sky-800 text-white border-b border-sky-900/30">
      <div className="mx-auto max-w-6xl px-4 py-5 md:py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
            Mi Estudio
          </h1>
          <p className="mt-1 text-xs md:text-sm text-white/80">
            Gestioná la información y configuración de tu estudio
          </p>
        </div>
      </div>
    </div>
  );
}
