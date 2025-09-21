"use client";

import { ReactNode } from "react";

type StatusVariant = "success" | "danger" | "warning" | "neutral";

export type CardsGeneralItem = {
  id: string;
  title: string;
  subtitle?: string;
  time?: string;
  status?: { label: string; variant?: StatusVariant };
  avatarUrl?: string;
  initials?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
};

export type CardsGeneralProps = {
  header: string;
  columns?: {
    titleCol?: string;
    timeCol?: string;   // si NO lo pasás, el componente oculta la columna de tiempo
    statusCol?: string;
  };
  items: CardsGeneralItem[];
  onItemClick?: (item: CardsGeneralItem) => void;
  onRightIconClick?: (item: CardsGeneralItem) => void;
  className?: string;
};

const statusClasses: Record<StatusVariant, string> = {
  success: "bg-green-200 text-green-800",
  danger: "bg-rose-100 text-rose-700",
  warning: "bg-amber-100 text-amber-700",
  neutral: "bg-gray-100 text-gray-600",
};

function Avatar({
  url,
  initials,
  alt,
  icon,
}: {
  url?: string;
  initials?: string;
  alt: string;
  icon?: ReactNode;
}) {
  if (icon) {
    return (
      <div className="h-8 w-8 grid place-items-center rounded-full bg-gray-100 text-gray-700">
        {icon}
      </div>
    );
  }
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} className="h-8 w-8 rounded-full object-cover" />;
  }
  const text = (initials ?? alt?.charAt(0) ?? "?").slice(0, 2).toUpperCase();
  return (
    <div className="h-8 w-8 grid place-items-center rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
      {text}
    </div>
  );
}

export default function CardsGeneral({
  header,
  columns = { titleCol: "Usuarios", timeCol: "Tiempo", statusCol: "Estado" },
  items,
  onItemClick,
  onRightIconClick,
  className = "",
}: CardsGeneralProps) {
  const showTime = Boolean(columns.timeCol);

  return (
    <section className={`h-full rounded-xl border border-gray-200 bg-white flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-5 pt-5">
        <h2 className="text-lg font-semibold text-gray-800">{header}</h2>
      </div>

      {/* Head row */}
      <div className="mt-4 grid grid-cols-12 items-center px-5 text-xs font-medium text-gray-500">
        <div className={showTime ? "col-span-6" : "col-span-9"}>
          {columns.titleCol}
        </div>
        {showTime && <div className="col-span-3">{columns.timeCol}</div>}
        <div className="col-span-3 text-right">{columns.statusCol}</div>
      </div>

      {/* List */}
      <ul className="mt-2 divide-y divide-gray-100 flex-1">
        {items.map((it) => {
          const disabled = it.disabled;
          const rawVariant = it.status?.variant as string | undefined;
          const label = (it.status?.label ?? "").toLowerCase();

          const inferred: StatusVariant =
            label.includes("aprob") || label.includes("approv") || label.includes("aprov")
              ? "success"
              : label.includes("pend")
              ? "warning"
              : label.includes("bloq") || label.includes("block")
              ? "danger"
              : "neutral";

          const variant: StatusVariant =
            rawVariant && rawVariant in statusClasses
              ? (rawVariant as StatusVariant)
              : inferred;

          return (
            <li
              key={it.id}
              className={`grid grid-cols-12 items-center px-5 py-4 ${
                disabled ? "opacity-60" : "hover:bg-gray-50"
              }`}
            >
              {/* Col 1: avatar + titles */}
              <button
                type="button"
                className={showTime ? "col-span-6" : "col-span-9"}
                onClick={() => onItemClick?.(it)}
                disabled={disabled}
              >
                <div className="flex items-center gap-3 text-left">
                  <Avatar
                    url={it.avatarUrl}
                    initials={it.initials}
                    alt={it.title}
                    icon={it.leftIcon}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-sky-900">
                      {it.title}
                    </p>
                    {it.subtitle && (
                      <p className="truncate text-xs text-gray-500">{it.subtitle}</p>
                    )}
                  </div>
                </div>
              </button>

              {/* Col 2: time (opcional) */}
              {showTime && (
                <div className="col-span-3 text-sm text-gray-600">
                  {it.time ?? "—"}
                </div>
              )}

              {/* Col 3: status */}
              <div className="col-span-3 flex items-center justify-end gap-2">
                {it.rightIcon && (
                  <button
                    type="button"
                    onClick={() => onRightIconClick?.(it)}
                    className="grid h-7 w-7 place-items-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
                    aria-label="action"
                    disabled={disabled}
                  >
                    {it.rightIcon}
                  </button>
                )}

                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${statusClasses[variant]}`}
                >
                  {it.status?.label ?? "—"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="h-3" />
    </section>
  );
}
