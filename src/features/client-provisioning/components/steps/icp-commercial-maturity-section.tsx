"use client";

import { icpFieldHints, type IcpCriteriaFormValue, type LevelEntryFormValue } from "@/features/client-configuration";
import {
  EnumSelectField,
  RepeatableGroupField,
  SectionErrorsNote,
  StringListField,
  TextField,
  type FieldErrors,
} from "@/shared/ui/forms";

type CommercialMaturityValue = IcpCriteriaFormValue["commercialMaturity"];

function LevelEntryEditor({
  idPrefix,
  entry,
  onChange,
}: {
  idPrefix: string;
  entry: LevelEntryFormValue;
  onChange: (next: LevelEntryFormValue) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextField
        id={`${idPrefix}-key`}
        label="Clé du niveau"
        value={entry.key}
        onChange={(event) => onChange({ ...entry, key: event.target.value })}
        placeholder="ex. structure"
      />
      <TextField
        id={`${idPrefix}-description`}
        label="Définition"
        value={entry.description}
        onChange={(event) => onChange({ ...entry, description: event.target.value })}
      />
    </div>
  );
}

export function IcpCommercialMaturitySection({
  value,
  onChange,
  errors,
}: {
  value: CommercialMaturityValue;
  onChange: (next: CommercialMaturityValue) => void;
  errors: FieldErrors;
}) {
  const levelOptions = value.levels.map((level) => ({ value: level.key, label: level.key || "(vide)" }));

  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-text-primary">Maturité commerciale</legend>
      <SectionErrorsNote errors={errors} prefix="commercialMaturity" />
      <RepeatableGroupField<LevelEntryFormValue>
        id="icp-commercial-maturity-levels"
        label="Échelle des niveaux possibles"
        hint={icpFieldHints.commercialMaturity.levels}
        value={value.levels}
        onChange={(next) => onChange({ ...value, levels: next })}
        createItem={() => ({ key: "", description: "" })}
        renderItem={(entry, index, updateEntry) => (
          <LevelEntryEditor key={index} idPrefix={`icp-commercial-maturity-level-${index}`} entry={entry} onChange={updateEntry} />
        )}
        addLabel="Ajouter un niveau"
        removeLabel="Retirer ce niveau"
        emptyLabel="Aucun niveau de maturité défini pour l'instant."
      />
      {levelOptions.length === 0 ? (
        <p className="text-sm text-text-tertiary">
          Ajoutez au moins un niveau ci-dessus pour pouvoir choisir le niveau idéal (requis).
        </p>
      ) : (
        <EnumSelectField
          id="icp-commercial-maturity-preferred-level"
          label="Niveau idéal"
          value={value.preferredLevel === "" ? null : value.preferredLevel}
          options={levelOptions}
          onChange={(next) => onChange({ ...value, preferredLevel: next })}
          hint={icpFieldHints.commercialMaturity.preferredLevel}
        />
      )}
      <StringListField
        id="icp-commercial-maturity-target-levels"
        label="Niveaux considérés comme de bons candidats"
        value={value.targetLevels}
        onChange={(next) => onChange({ ...value, targetLevels: next })}
        hint={icpFieldHints.commercialMaturity.targetLevels}
        placeholder="Une des clés ci-dessus"
      />
      <StringListField
        id="icp-commercial-maturity-preferred-levels"
        label="Niveaux considérés comme les meilleurs candidats"
        value={value.preferredLevels}
        onChange={(next) => onChange({ ...value, preferredLevels: next })}
        hint={icpFieldHints.commercialMaturity.preferredLevels}
        placeholder="Une des clés ci-dessus"
      />
      <StringListField
        id="icp-commercial-maturity-excluded-levels"
        label="Niveaux qui excluent le prospect"
        value={value.excludedLevels}
        onChange={(next) => onChange({ ...value, excludedLevels: next })}
        hint={icpFieldHints.commercialMaturity.excludedLevels}
        placeholder="Une des clés ci-dessus"
      />
    </fieldset>
  );
}
