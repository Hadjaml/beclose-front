"use client";

import { bantFieldHints, type BantCriteriaFormValue } from "@/features/client-configuration";
import { CheckboxField } from "@/shared/ui/forms";

type HandoffRulesValue = BantCriteriaFormValue["handoffRules"];

export function BantHandoffRulesSection({
  value,
  onChange,
}: {
  value: HandoffRulesValue;
  onChange: (next: HandoffRulesValue) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-semibold text-text-primary">{bantFieldHints.handoffRules.self}</legend>
      <CheckboxField
        id="bant-handoff-explicit-meeting-request"
        label="Demande explicite de rendez-vous"
        checked={value.explicitMeetingRequest}
        onChange={(checked) => onChange({ ...value, explicitMeetingRequest: checked })}
        hint={bantFieldHints.handoffRules.explicitMeetingRequest}
      />
      <CheckboxField
        id="bant-handoff-strong-need-and-human-request"
        label="Besoin fort + demande d'un humain"
        checked={value.strongNeedAndHumanRequest}
        onChange={(checked) => onChange({ ...value, strongNeedAndHumanRequest: checked })}
        hint={bantFieldHints.handoffRules.strongNeedAndHumanRequest}
      />
      <CheckboxField
        id="bant-handoff-strong-buying-intent"
        label="Intention d'achat forte"
        checked={value.strongBuyingIntent}
        onChange={(checked) => onChange({ ...value, strongBuyingIntent: checked })}
        hint={bantFieldHints.handoffRules.strongBuyingIntent}
      />
    </fieldset>
  );
}
