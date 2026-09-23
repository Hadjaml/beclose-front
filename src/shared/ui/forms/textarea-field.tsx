"use client";

import type { ChangeEventHandler } from "react";
import { FieldFrame } from "./field-frame";
import type { TextFieldProps } from "./text-field";

export interface TextAreaFieldProps extends Omit<TextFieldProps, "onChange" | "type"> {
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
