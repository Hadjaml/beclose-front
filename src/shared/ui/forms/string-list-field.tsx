"use client";

import { useState } from "react";
import { FieldFrame } from "./field-frame";

/**
 * Editable list of short strings (signals, questions, titles…) — add one at
 * a time via a text input + button, remove any entry individually. Built
 * 2026-09-23 for the upcoming ICP/BANT creation flow: the real Beclose
 * shape (`bant-criteria-wire-schema.ts`, `icp-criteria-wire-schema.ts`) is
 * full of `string[]` fields the old onboarding wizard never needed
 * (`positiveSignals`, `negativeSignals`, `questions`, `decisionMakerTitles`…).
 */
export interface StringListFieldProps {
  id: string;
  label: string;
  value: readonly string[];
  onChange: (next: string[]) => void;
  hint?: string | undefined;
  error?: string | undefined;
  optional?: boolean | undefined;
  placeholder?: string | undefined;
  addLabel?: string;
}

export function StringListField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  optional,
  placeholder,
  addLabel = "Ajouter",
}: StringListFieldProps) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const trimmed = draft.trim();
    if (trimmed === "") return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function removeItem(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="space-y-2">
        {value.length === 0 ? null : (
          <ul className="space-y-1.5">
            {value.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-center justify-between gap-2 rounded-app-md border border-border bg-surface-muted px-3 py-2 text-sm text-text-primary"
              >
                <span className="min-w-0 break-words">{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="shrink-0 text-sm font-medium text-text-tertiary hover:text-red-700"
                  aria-label={`Retirer « ${item} »`}
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input
            id={id}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addItem();
              }
            }}
            placeholder={placeholder}
            className="min-h-11 w-full rounded-app-md border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-muted hover:border-border-strong focus:border-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15"
          />
          <button
            type="button"
            onClick={addItem}
            className="shrink-0 rounded-app-md border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          >
            {addLabel}
          </button>
        </div>
      </div>
    </FieldFrame>
  );
}
