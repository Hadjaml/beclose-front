"use client";

/**
 * A single labeled boolean toggle, with its own hint line below (not
 * `FieldFrame`: a checkbox's label sits beside the control, not above it,
 * and it has no error state of its own in this kit — booleans don't fail
 * Zod validation the way a required string does). Built 2026-09-23 for the
 * ICP/BANT creation flow, which is full of plain booleans
 * (`validatedOfferRequired`, `explicitAmountRequired`, `handoffRules.*`,
 * `conversationPolicy.*`…) that none of the other primitives cover.
 */
export interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  hint?: string | undefined;
}

export function CheckboxField({ id, label, checked, onChange, hint }: CheckboxFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-start gap-2.5 text-sm">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-describedby={hint === undefined ? undefined : `${id}-hint`}
          className="mt-0.5 size-4 shrink-0 rounded border-border text-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15"
        />
        <span className="font-medium text-text-primary">{label}</span>
      </label>
      {hint === undefined ? null : (
        <p id={`${id}-hint`} className="pl-6 text-sm leading-5 text-text-secondary">
          {hint}
        </p>
      )}
    </div>
  );
}
