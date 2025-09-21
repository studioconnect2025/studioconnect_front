"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-2 sm:px-4">
      <div className="relative bg-white rounded-2xl shadow-lg w-full 
                      max-w-[95vw] sm:max-w-lg md:max-w-xl lg:max-w-xl 
                      max-h-[95vh] overflow-y-auto p-4 sm:p-10">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 cursor-pointer rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-sky-700" />
        </button>
        {/* Contenido */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

