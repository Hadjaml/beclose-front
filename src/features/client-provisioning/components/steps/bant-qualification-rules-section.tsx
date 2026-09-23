"use client";

import { bantFieldHints, type BantCriteriaFormValue, type RuleEntryFormValue } from "@/features/client-configuration";
import { RepeatableGroupField, StringListField, TextField } from "@/shared/ui/forms";

type QualificationRulesValue = BantCriteriaFormValue["qualificationRules"];

function RuleEntryEditor({
  idPrefix,
  entry,
  onChange,
}: {
  idPrefix: string;
  entry: RuleEntryFormValue;
  onChange: (next: RuleEntryFormValue) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        id={`${idPrefix}-key`}
        label="Critère"
        value={entry.key}
        onChange={(event) => onChange({ ...entry, key: event.target.value })}
        placeholder="ex. budget, need, timing, budget_not"
      />
      <StringListField
        id={`${idPrefix}-values`}
        label="Statuts qui déclenchent cette règle"
        value={entry.values}
        onChange={(next) => onChange({ ...entry, values: next })}
      />
    </div>
  );
}

export function BantQualificationRulesSection({
  value,
  onChange,
}: {
  value: QualificationRulesValue;
  onChange: (next: QualificationRulesValue) => void;
}) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-base font-semibold text-text-primary">{bantFieldHints.qualificationRules.self}</legend>
      <RepeatableGroupField<RuleEntryFormValue>
        id="bant-qualification-rules-qualified"
        label="Règles « qualifié »"
        hint={bantFieldHints.qualificationRules.qualified}
        value={value.qualified}
        onChange={(next) => onChange({ ...value, qualified: next })}
        createItem={() => ({ key: "", values: [] })}
        renderItem={(entry, index, updateEntry) => (
          <RuleEntryEditor key={index} idPrefix={`bant-qualification-rules-qualified-${index}`} entry={entry} onChange={updateEntry} />
        )}
        addLabel="Ajouter une condition"
        removeLabel="Retirer cette condition"
        emptyLabel="Aucune condition de qualification définie."
      />
      <RepeatableGroupField<RuleEntryFormValue>
        id="bant-qualification-rules-nurture"
        label="Règles « nurture »"
        hint={bantFieldHints.qualificationRules.nurture}
        value={value.nurture}
        onChange={(next) => onChange({ ...value, nurture: next })}
        createItem={() => ({ key: "", values: [] })}
        renderItem={(entry, index, updateEntry) => (
          <RuleEntryEditor key={index} idPrefix={`bant-qualification-rules-nurture-${index}`} entry={entry} onChange={updateEntry} />
        )}
        addLabel="Ajouter une condition"
        removeLabel="Retirer cette condition"
        emptyLabel="Aucune condition de relance différée définie."
      />
    </fieldset>
  );
}
