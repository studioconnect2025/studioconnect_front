import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";
export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  timeout?: number; // ms
};

type ToastState = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast: Toast = { id, timeout: 3500, variant: "info", ...t };
    set({ toasts: [...get().toasts, toast] });
    // auto-dismiss
    if (toast.timeout && toast.timeout > 0) {
      setTimeout(() => {
        const { toasts } = get();
        set({ toasts: toasts.filter((x) => x.id !== id) });
      }, toast.timeout);
    }
    return id;
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
