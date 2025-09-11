"use client";
import { useState, KeyboardEvent } from "react";

type ChipsInputProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  variant?: "light" | "dark";
};

export default function ChipsInput({
  id,
  label,
  placeholder = "Escribí y presioná Enter…",
  value,
  onChange,
  disabled,
  variant = "light",
}: ChipsInputProps) {
  const [draft, setDraft] = useState("");

  const addChip = (chip: string) => {
    const clean = chip.trim();
    if (!clean) return;
    if (value.includes(clean)) return;
    onChange([...value, clean]);
    setDraft("");
  };

  const removeChip = (chip: string) => {
    onChange(value.filter((c) => c !== chip));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChip(draft);
    }
  };

  const isDark = variant === "dark";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={`mb-1 block text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}
        >
          {label}
        </label>
      )}

      <div
        className={[
          "flex flex-wrap items-center gap-2 rounded-lg p-2",
          isDark
            ? "border border-white/15 bg-white/5"
            : "border border-gray-300 bg-white",
        ].join(" ")}
      >
        {value.map((chip) => (
          <span
            key={chip}
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm",
              isDark
                ? "border border-white/15 bg-white/10 text-white"
                : "border border-gray-300 bg-gray-50 text-gray-800",
            ].join(" ")}
          >
            {chip}
            <button
              type="button"
              onClick={() => removeChip(chip)}
              className={[
                "rounded-full px-1",
                isDark
                  ? "text-white/70 hover:bg-white/15"
                  : "text-gray-500 hover:bg-gray-200",
              ].join(" ")}
              aria-label={`Quitar ${chip}`}
              disabled={disabled}
            >
              ×
            </button>
          </span>
        ))}

        <input
          id={id}
          className={[
            "min-w-[180px] flex-1 border-0 bg-transparent text-sm outline-none",
            isDark ? "text-white placeholder-white/40" : "text-gray-900",
          ].join(" ")}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
