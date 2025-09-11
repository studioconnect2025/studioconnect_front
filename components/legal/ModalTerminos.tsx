"use client";

import { ReactNode } from "react";

export default function ModalTerminos({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        <h3 className="text-lg text-gray-600 font-bold mb-4">Términos y Condiciones</h3>
        <div className="text-sm text-gray-700 space-y-3 max-h-80 overflow-y-auto">
          {children}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
