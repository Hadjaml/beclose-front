"use client";

import { FieldFrame } from "./field-frame";

/**
 * Select from a fixed, closed set of values — built 2026-09-23 for the
 * upcoming ICP/BANT creation flow's status enums (`budgetStatusSchema`,
 * `authorityStatusSchema`, etc.) and similar closed vocabularies. Generic
 * over the option value type; the caller supplies `{value, label}` pairs
 * so the French label stays a presentation concern, not baked into this
 * primitive.
 */
export interface EnumOption<Value extends string> {
  value: Value;
  label: string;
}

export interface EnumSelectFieldProps<Value extends string> {
  id: string;
  label: string;
  value: Value | null;
  options: readonly EnumOption<Value>[];
  onChange: (next: Value) => void;
  hint?: string | undefined;
  error?: string | undefined;
  optional?: boolean | undefined;
  placeholder?: string;
}

export function EnumSelectField<Value extends string>({
  id,
  label,
  value,
  options,
  onChange,
  hint,
  error,
  optional,
  placeholder = "Choisir…",
}: EnumSelectFieldProps<Value>) {
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} optional={optional}>
      <select
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value as Value)}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? `${id}-error` : hint !== undefined ? `${id}-hint` : undefined}
        className="min-h-11 w-full rounded-app-md border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition hover:border-border-strong focus:border-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldFrame>
  );
}
