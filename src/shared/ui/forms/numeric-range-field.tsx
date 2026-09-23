"use client";

import { FieldFrame } from "./field-frame";

/**
 * Min/max numeric range, with optional reject-bounds (a wider pair of
 * bounds beyond which a value is excluded, distinct from the preferred
 * min/max) — built 2026-09-23 for the upcoming ICP creation flow, matching
 * the shape of Beclose's real `employee_range` (`icp-criteria-wire-schema.ts`:
 * `min`/`max`/`rejectBelow`/`rejectAbove`). `showRejectBounds` is opt-in:
 * most numeric ranges in the target contract don't have reject bounds,
 * only headcount does.
 */
export interface NumericRangeValue {
  min: number | null;
  max: number | null;
  rejectBelow: number | null;
  rejectAbove: number | null;
}

export interface NumericRangeFieldProps {
  id: string;
  label: string;
  value: NumericRangeValue;
  onChange: (next: NumericRangeValue) => void;
  hint?: string | undefined;
  error?: string | undefined;
  optional?: boolean | undefined;
  unit?: string | undefined;
  showRejectBounds?: boolean;
}

function parseNumberInput(raw: string): number | null {
  if (raw.trim() === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function NumberInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number | null;
  onChange: (next: number | null) => void;
}) {
  return (
    <label htmlFor={id} className="space-y-1 text-sm">
      <span className="text-text-tertiary">{label}</span>
      <input
        id={id}
        type="number"
        value={value ?? ""}
        onChange={(event) => onChange(parseNumberInput(event.target.value))}
        className="min-h-11 w-full rounded-app-md border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition hover:border-border-strong focus:border-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15"
      />
    </label>
  );
}

export function NumericRangeField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  optional,
  unit,
  showRejectBounds = false,
}: NumericRangeFieldProps) {
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          id={`${id}-min`}
          label={unit === undefined ? "Minimum" : `Minimum (${unit})`}
          value={value.min}
          onChange={(next) => onChange({ ...value, min: next })}
        />
        <NumberInput
          id={`${id}-max`}
          label={unit === undefined ? "Maximum" : `Maximum (${unit})`}
          value={value.max}
          onChange={(next) => onChange({ ...value, max: next })}
        />
        {showRejectBounds ? (
          <>
            <NumberInput
              id={`${id}-reject-below`}
              label="Rejeter en dessous de"
              value={value.rejectBelow}
              onChange={(next) => onChange({ ...value, rejectBelow: next })}
            />
            <NumberInput
              id={`${id}-reject-above`}
              label="Rejeter au-dessus de"
              value={value.rejectAbove}
              onChange={(next) => onChange({ ...value, rejectAbove: next })}
            />
          </>
        ) : null}
      </div>
    </FieldFrame>
  );
}
