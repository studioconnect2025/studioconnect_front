"use client";

type Doc = { url: string; name: string; type?: string; download?: string };

export default function ReviewDialog({
  title,
  documents = [],
  mode,
  loading,
  error,
  onSubmit,
  onClose,
}: {
  title: string;
  documents?: Doc[];
  mode?: "reject";
  loading?: boolean;
  error?: string;
  onSubmit?: (message?: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {mode !== "reject" ? (
          <div className="mt-4 max-h-[70vh] overflow-auto">
            {loading ? (
              <p className="text-sm text-gray-500">Cargando documento…</p>
            ) : error ? (
              <p className="text-sm text-red-600">No se pudo cargar el documento: {error}</p>
            ) : documents.length === 0 ? (
              <p className="text-sm text-gray-500">No hay documento disponible.</p>
            ) : (
              documents.map((d, i) => {
                const isPdf =
                  (d.type ?? "").toLowerCase().includes("pdf") ||
                  d.url.toLowerCase().endsWith(".pdf");
                return (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-700">{d.name}</div>
                      {d.download && (
                        <a
                          href={d.download}
                          className="text-xs underline text-sky-700"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Descargar
                        </a>
                      )}
                    </div>
                    {isPdf ? (
                      <iframe
                        src={d.url}
                        className="h-96 w-full rounded"
                        title={d.name}
                        loading="lazy"
                      />
                    ) : (
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-700 underline text-sm"
                      >
                        Abrir archivo
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              onSubmit?.(String(fd.get("reason") ?? ""));
            }}
          >
            <label className="block text-sm text-gray-700">Motivo</label>
            <textarea
              name="reason"
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Describí brevemente el motivo del rechazo…"
              rows={4}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
              >
                Enviar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
