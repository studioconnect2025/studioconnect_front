"use client";

import { useState } from "react";

function isCloudinary(url: string) {
  try { return new URL(url).host.includes("res.cloudinary.com"); } catch { return false; }
}
function altCloudinaryRawUrl(url: string) {
  // Si es cloudinary y tiene /image/upload/, probá con /raw/upload/
  try {
    const u = new URL(url);
    if (u.pathname.includes("/image/upload/")) {
      return url.replace("/image/upload/", "/raw/upload/");
    }
    return null;
  } catch { return null; }
}

export default function ReviewDialog({
  title,
  documents = [],
  mode = "view",
  onClose,
  onSubmit,
}: {
  title: string;
  documents?: string[];
  mode?: "view" | "reject";
  onClose: () => void;
  onSubmit?: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50">
            Cerrar
          </button>
        </div>

        <div className="max-h-[60vh] overflow-auto p-4 space-y-3">
          {mode === "view" ? (
            documents?.length ? (
              <ul className="space-y-3">
                {documents.map((raw, i) => {
                  const url = String(raw ?? "");
                  const isCld = isCloudinary(url);
                  const altUrl = isCld ? altCloudinaryRawUrl(url) : null;
                  return (
                    <li key={i} className="rounded-md border border-gray-100 p-2">
                      <p className="truncate text-sm text-gray-800" title={url}>{url}</p>

                      {isCld && (
                        <p className="mt-1 text-xs text-amber-600">
                          Nota: este archivo podría ser privado en Cloudinary (401). Probá el enlace alternativo “raw”.
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-2">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                        >
                          Abrir
                        </a>

                        {altUrl && altUrl !== url && (
                          <a
                            href={altUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs text-sky-700 hover:bg-sky-100"
                          >
                            Abrir (raw)
                          </a>
                        )}

                        <button
                          onClick={() => copy(url)}
                          className="rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                        >
                          {copied === url ? "¡Copiado!" : "Copiar link"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Sin documentos adjuntos.</p>
            )
          ) : (
            <>
              <label className="text-xs text-gray-600">Motivo para enviar al owner</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-200 p-2 text-sm outline-none focus:ring-1 focus:ring-sky-300"
                rows={6}
                placeholder="Explicá brevemente el porqué de la desaprobación…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t px-4 py-3">
          {mode === "reject" ? (
            <>
              <button onClick={onClose} className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={() => { onSubmit?.(message.trim()); onClose(); }}
                disabled={!message.trim()}
                className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-100 disabled:opacity-50"
              >
                Enviar y marcar en revisión
              </button>
            </>
          ) : (
            <button onClick={onClose} className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
              Listo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
