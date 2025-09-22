// components/admin/ui.ts
export const btnBase =
  "inline-flex items-center justify-center rounded-md px-3.5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

export const btnSecondary =
  `${btnBase} bg-gray-50 text-gray-900 border border-gray-300 hover:bg-gray-100 focus-visible:ring-sky-400`;

export const btnPrimary =
  `${btnBase} bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 focus-visible:ring-emerald-400`;

export const btnDanger =
  `${btnBase} bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 focus-visible:ring-rose-400`;
