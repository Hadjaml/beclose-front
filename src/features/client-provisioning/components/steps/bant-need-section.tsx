"use client";

import { bantFieldHints, type BantCriteriaFormValue } from "@/features/client-configuration";
import { StringListField, TextAreaField } from "@/shared/ui/forms";

type NeedValue = BantCriteriaFormValue["need"];

export function BantNeedSection({ value, onChange }: { value: NeedValue; onChange: (next: NeedValue) => void }) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-text-primary">{bantFieldHints.need.self}</legend>
      <TextAreaField
        id="bant-need-definition"
        label="Définition"
        value={value.definition}
        onChange={(event) => onChange({ ...value, definition: event.target.value })}
        hint={bantFieldHints.need.definition}
      />
      <StringListField
        id="bant-need-status-values"
        label="Statuts possibles"
        value={value.statusValues}
        onChange={(next) => onChange({ ...value, statusValues: next })}
        hint={bantFieldHints.need.statusValues}
      />
      <StringListField
        id="bant-need-strong-signals"
        label="Signaux d'un besoin fort"
        value={value.strongSignals}
        onChange={(next) => onChange({ ...value, strongSignals: next })}
        hint={bantFieldHints.need.strongSignals}
      />
      <StringListField
        id="bant-need-moderate-signals"
        label="Signaux d'un besoin réel mais pas urgent"
        value={value.moderateSignals}
        onChange={(next) => onChange({ ...value, moderateSignals: next })}
        hint={bantFieldHints.need.moderateSignals}
      />
      <StringListField
        id="bant-need-negative-signals"
        label="Signaux d'absence de besoin"
        value={value.negativeSignals}
        onChange={(next) => onChange({ ...value, negativeSignals: next })}
        hint={bantFieldHints.need.negativeSignals}
      />
      <StringListField
        id="bant-need-disqualifiers"
        label="Disqualifiants"
        value={value.disqualifiers}
        onChange={(next) => onChange({ ...value, disqualifiers: next })}
        hint={bantFieldHints.need.disqualifiers}
      />
      <StringListField
        id="bant-need-questions"
        label="Questions à poser"
        value={value.questions}
        onChange={(next) => onChange({ ...value, questions: next })}
        hint={bantFieldHints.need.questions}
      />
    </fieldset>
  );
}
