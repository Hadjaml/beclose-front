"use client";

import type { ChangeEventHandler } from "react";
import { FieldFrame } from "./field-frame";

export interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  optional?: boolean | undefined;
  type?: "email" | "text" | "url";
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  optional,
  type = "text",
}: TextFieldProps) {
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? `${id}-error` : hint !== undefined ? `${id}-hint` : undefined}
        className="min-h-11 w-full rounded-app-md border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-muted hover:border-border-strong focus:border-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15"
      />
    </FieldFrame>
  );
}
