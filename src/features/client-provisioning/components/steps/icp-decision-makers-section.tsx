"use client";

import { icpFieldHints, type IcpCriteriaFormValue } from "@/features/client-configuration";
import { StringListField } from "@/shared/ui/forms";

type DecisionMakersValue = IcpCriteriaFormValue["decisionMakers"];

export function IcpDecisionMakersSection({
  value,
  onChange,
}: {
  value: DecisionMakersValue;
  onChange: (next: DecisionMakersValue) => void;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-text-primary">Décideurs visés</legend>
      <StringListField
        id="icp-decision-makers-primary"
        label="Décideurs principaux"
        value={value.primary}
        onChange={(next) => onChange({ ...value, primary: next })}
        hint={icpFieldHints.decisionMakers.primary}
      />
      <StringListField
        id="icp-decision-makers-secondary"
        label="Décideurs secondaires"
        value={value.secondary}
        onChange={(next) => onChange({ ...value, secondary: next })}
        hint={icpFieldHints.decisionMakers.secondary}
      />
      <StringListField
        id="icp-decision-makers-champions"
        label="Relais internes potentiels"
        value={value.potentialChampions}
        onChange={(next) => onChange({ ...value, potentialChampions: next })}
        hint={icpFieldHints.decisionMakers.potentialChampions}
      />
    </fieldset>
  );
}
