"use client";

import { useToastStore } from "@/stores/ui/ToastStore";

export default function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  const color = (v?: string) =>
    v === "success" ? "bg-emerald-600"
    : v === "error" ? "bg-rose-600"
    : "bg-sky-600";

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto w-80 rounded-lg shadow-lg text-white ${color(t.variant)}`}
        >
          <div className="flex items-start gap-3 p-3">
            <div className="flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.description && (
                <p className="text-xs opacity-90">{t.description}</p>
              )}
            </div>
            <button
              className="rounded px-2 text-xs hover:bg-black/10"
              onClick={() => dismiss(t.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
