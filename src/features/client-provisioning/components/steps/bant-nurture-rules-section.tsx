"use client";

import { bantFieldHints, type BantCriteriaFormValue, type DelayEntryFormValue } from "@/features/client-configuration";
import { CheckboxField, RepeatableGroupField, SectionErrorsNote, TextField, type FieldErrors } from "@/shared/ui/forms";

type NurtureRulesValue = BantCriteriaFormValue["nurtureRules"];

const emptyNurtureRules: NonNullable<NurtureRulesValue> = { maxFollowUps: 3, followUpDelayDays: [] };

function DelayEntryEditor({
  idPrefix,
  entry,
  onChange,
}: {
  idPrefix: string;
  entry: DelayEntryFormValue;
  onChange: (next: DelayEntryFormValue) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextField
        id={`${idPrefix}-key`}
        label="Statut de timing"
        value={entry.key}
        onChange={(event) => onChange({ ...entry, key: event.target.value })}
        placeholder="Une des valeurs de statut du critère timing"
      />
      <TextField
        id={`${idPrefix}-days`}
        label="Délai avant relance (jours)"
        type="text"
        value={String(entry.days)}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          onChange({ ...entry, days: Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : 0 });
        }}
      />
    </div>
  );
}

export function BantNurtureRulesSection({
  value,
  onChange,
  errors,
}: {
  value: NurtureRulesValue;
  onChange: (next: NurtureRulesValue) => void;
  errors: FieldErrors;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-text-primary">{bantFieldHints.nurtureRules.self}</legend>
      <SectionErrorsNote errors={errors} prefix="nurtureRules" />
      <CheckboxField
        id="bant-nurture-rules-enabled"
        label="Relancer automatiquement les prospects en attente"
        checked={value !== null}
        onChange={(checked) => onChange(checked ? emptyNurtureRules : null)}
      />
      {value === null ? null : (
        <div className="space-y-4 rounded-app-lg border border-border bg-surface-muted/60 p-4">
          <TextField
            id="bant-nurture-max-follow-ups"
            label="Nombre maximum de relances"
            type="text"
            value={String(value.maxFollowUps)}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              onChange({ ...value, maxFollowUps: Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : 0 });
            }}
            hint={bantFieldHints.nurtureRules.maxFollowUps}
          />
          <RepeatableGroupField<DelayEntryFormValue>
            id="bant-nurture-follow-up-delay-days"
            label="Délais de relance par statut de timing"
            hint={bantFieldHints.nurtureRules.followUpDelayDays}
            value={value.followUpDelayDays}
            onChange={(next) => onChange({ ...value, followUpDelayDays: next })}
            createItem={() => ({ key: "", days: 0 })}
            renderItem={(entry, index, updateEntry) => (
              <DelayEntryEditor key={index} idPrefix={`bant-nurture-delay-${index}`} entry={entry} onChange={updateEntry} />
            )}
            addLabel="Ajouter un délai"
            removeLabel="Retirer ce délai"
            emptyLabel="Aucun délai défini — aucune relance automatique tant qu'aucun statut n'est ajouté ici."
          />
        </div>
      )}
    </fieldset>
  );
}
