// components/admin/ReviewDialog.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { btnSecondary, btnPrimary, btnDanger } from "@/components/admin/ui";

type ReviewDialogProps = {
  title: string;
  mode?: "reject";                    // si está, muestra textarea y botón de rechazo
  documents?: string[];               // urls a documentos (opcionales)
  onClose: () => void;
  onSubmit?: (message?: string) => void;
};

export default function ReviewDialog({
  title,
  mode,
  documents = [],
  onClose,
  onSubmit,
}: ReviewDialogProps) {
  const [message, setMessage] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  // cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // cerrar clic fuera
  const onClickOverlay = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const submit = () => onSubmit?.(mode === "reject" ? message.trim() : undefined);

  return (
    <div
      ref={overlayRef}
      onClick={onClickOverlay}
      className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-xl bg-white shadow-xl p-5">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        {/* Contenido */}
        <div className="mt-4 space-y-4">
          {/* Lista de documentos si hay */}
          {documents.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Documentación adjunta:</p>
              <ul className="list-disc pl-5 space-y-1">
                {documents.map((url, i) => (
                  <li key={i}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-700 hover:underline break-all"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Texto de rechazo si corresponde */}
          {mode === "reject" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo / observaciones
              </label>
              <textarea
                className="w-full min-h-28 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                placeholder="Describe brevemente los cambios necesarios…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Este mensaje será enviado al dueño del estudio.
              </p>
            </div>
          )}
        </div>

        {/* Footer de acciones */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <button type="button" className={btnSecondary} onClick={onClose}>
            Cancelar
          </button>

          {mode === "reject" ? (
            <button
              type="button"
              className={btnDanger}
              onClick={submit}
              disabled={!message.trim()}
            >
              Enviar rechazo
            </button>
          ) : (
            <button type="button" className={btnPrimary} onClick={submit}>
              Aprobar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
