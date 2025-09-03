"use client";

import { Field, ErrorMessage } from "formik";

interface InputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export default function Input({
  name,
  label,
  type = "text",
  placeholder,
}: InputProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm shadow-sm 
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <ErrorMessage
        name={name}
        component="p"
        className="text-xs text-red-600 mt-1"
      />
    </div>
  );
}
