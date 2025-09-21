"use client";
import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClass?: string;
};

export default function ModalShell({
  open,
  title,
  onClose,
  children,
  footer,
  maxWidthClass = "max-w-4xl",
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className={`w-full ${maxWidthClass} rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden flex flex-col max-h-[85vh]`}>
          <div className="flex items-center justify-between bg-sky-700 px-6 py-4 text-white">
            <h3 className="text-base md:text-lg font-semibold">{title}</h3>
            <button onClick={onClose} aria-label="Cerrar" className="h-9 w-9 grid place-items-center rounded-md hover:bg-white/10">
              ×
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8">{children}</div>
          {footer ? <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-slate-200">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
