"use client";

import { bantFieldHints, type BantCriteriaFormValue } from "@/features/client-configuration";
import { StringListField, TextAreaField, TextField } from "@/shared/ui/forms";

type TimingValue = BantCriteriaFormValue["timing"];

function parsePositiveInt(raw: string, fallback: number): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : fallback;
}

export function BantTimingSection({ value, onChange }: { value: TimingValue; onChange: (next: TimingValue) => void }) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-text-primary">{bantFieldHints.timing.self}</legend>
      <TextAreaField
        id="bant-timing-definition"
        label="Définition"
        value={value.definition}
        onChange={(event) => onChange({ ...value, definition: event.target.value })}
        hint={bantFieldHints.timing.definition}
      />
      <StringListField
        id="bant-timing-status-values"
        label="Statuts possibles"
        value={value.statusValues}
        onChange={(next) => onChange({ ...value, statusValues: next })}
        hint={bantFieldHints.timing.statusValues}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="bant-timing-qualified-horizon"
          label="Horizon qualifié (jours)"
          type="text"
          value={String(value.qualifiedHorizonDays)}
          onChange={(event) => onChange({ ...value, qualifiedHorizonDays: parsePositiveInt(event.target.value, value.qualifiedHorizonDays) })}
          hint={bantFieldHints.timing.qualifiedHorizonDays}
        />
        <TextField
          id="bant-timing-nurture-horizon"
          label="Horizon nurture (jours)"
          type="text"
          value={String(value.nurtureHorizonDays)}
          onChange={(event) => onChange({ ...value, nurtureHorizonDays: parsePositiveInt(event.target.value, value.nurtureHorizonDays) })}
          hint={bantFieldHints.timing.nurtureHorizonDays}
        />
      </div>
      <StringListField
        id="bant-timing-negative-signals"
        label="Signaux d'un horizon trop lointain"
        value={value.negativeSignals}
        onChange={(next) => onChange({ ...value, negativeSignals: next })}
        hint={bantFieldHints.timing.negativeSignals}
      />
      <StringListField
        id="bant-timing-questions"
        label="Questions à poser"
        value={value.questions}
        onChange={(next) => onChange({ ...value, questions: next })}
        hint={bantFieldHints.timing.questions}
      />
    </fieldset>
  );
}
