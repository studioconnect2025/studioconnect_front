"use client";

import React from "react";
import Link from "next/link";
import { brand } from "@/lib/brand";

type ButtonProps = {
  children: React.ReactNode;

  variant?: "brand" | "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  href?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition";

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const variants = {
  brand: "text-white", 
  primary: "bg-sky-800 text-white px-6 py-2 cursor-pointer rounded-lg hover:bg-black transition mt-8",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  children,
  variant = "brand",
  size = "md",
  fullWidth,
  leftIcon,
  rightIcon,
  isLoading,
  href,
  className = "",
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const cls = [
    base,
    sizes[size],
    variants[variant],
    "hover:opacity-90",
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : "",
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      )}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </>
  );

  const mergedStyle =
    variant === "brand" ? { ...(style || {}), backgroundColor: brand.primary } : style;

  if (href) {

    return (
      <Link
        href={href}
        className={cls}
        style={mergedStyle}
        aria-disabled={disabled || isLoading}
      >
        {content}
      </Link>
    );
  }


  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={cls}
      style={mergedStyle}
    >
      {content}
    </button>
  );
}
