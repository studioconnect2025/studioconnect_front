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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-4xl max-h-[70vh] overflow-y-auto p-6">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 cursor-pointer rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-6 h-6 text-sky-700" />
        </button>
        {/* Contenido */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};
