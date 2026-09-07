"use client";

import type { ChangeEventHandler, ReactNode } from "react";

interface FieldFrameProps {
  id: string;
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  optional?: boolean | undefined;
  children: ReactNode;
}

function FieldFrame({ id, label, hint, error, optional, children }: FieldFrameProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-text-primary">{label}</label>
        {optional ? <span className="text-sm text-text-tertiary">Facultatif</span> : null}
      </div>
      {children}
      {error !== undefined ? (
        <p id={`${id}-error`} className="text-sm text-red-700" role="alert">{error}</p>
      ) : hint !== undefined ? (
        <p id={`${id}-hint`} className="text-sm leading-5 text-text-secondary">{hint}</p>
      ) : null}
    </div>
  );
}

interface TextFieldProps {
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

interface TextAreaFieldProps extends Omit<TextFieldProps, "onChange" | "type"> {
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  rows?: number;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  optional,
  rows = 3,
}: TextAreaFieldProps) {
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? `${id}-error` : hint !== undefined ? `${id}-hint` : undefined}
        className="w-full resize-y rounded-app-md border border-border bg-surface px-3.5 py-2.5 text-sm leading-6 text-text-primary outline-none transition placeholder:text-text-muted hover:border-border-strong focus:border-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15"
      />
    </FieldFrame>
  );
}
