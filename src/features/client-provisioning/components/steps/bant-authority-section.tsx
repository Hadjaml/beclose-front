"use client";

import { bantFieldHints, type BantCriteriaFormValue } from "@/features/client-configuration";
import { StringListField, TextAreaField } from "@/shared/ui/forms";

type AuthorityValue = BantCriteriaFormValue["authority"];

export function BantAuthoritySection({
  value,
  onChange,
}: {
  value: AuthorityValue;
  onChange: (next: AuthorityValue) => void;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-text-primary">{bantFieldHints.authority.self}</legend>
      <TextAreaField
        id="bant-authority-definition"
        label="Définition"
        value={value.definition}
        onChange={(event) => onChange({ ...value, definition: event.target.value })}
        hint={bantFieldHints.authority.definition}
      />
      <StringListField
        id="bant-authority-status-values"
        label="Statuts possibles"
        value={value.statusValues}
        onChange={(next) => onChange({ ...value, statusValues: next })}
        hint={bantFieldHints.authority.statusValues}
      />
      <StringListField
        id="bant-authority-decision-maker-titles"
        label="Titres décideurs directs"
        value={value.decisionMakerTitles}
        onChange={(next) => onChange({ ...value, decisionMakerTitles: next })}
        hint={bantFieldHints.authority.decisionMakerTitles}
      />
      <StringListField
        id="bant-authority-champion-titles"
        label="Titres relais internes"
        value={value.championTitles}
        onChange={(next) => onChange({ ...value, championTitles: next })}
        hint={bantFieldHints.authority.championTitles}
      />
      <StringListField
        id="bant-authority-questions"
        label="Questions à poser"
        value={value.questions}
        onChange={(next) => onChange({ ...value, questions: next })}
        hint={bantFieldHints.authority.questions}
      />
    </fieldset>
  );
}
