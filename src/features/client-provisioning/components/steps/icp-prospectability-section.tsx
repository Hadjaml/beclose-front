"use client";

import { icpFieldHints, type IcpCriteriaFormValue } from "@/features/client-configuration";
import { CheckboxField, SectionErrorsNote, StringListField, type FieldErrors } from "@/shared/ui/forms";

type ProspectabilityValue = IcpCriteriaFormValue["prospectability"];

export function IcpProspectabilitySection({
  value,
  onChange,
  errors,
}: {
  value: ProspectabilityValue;
  onChange: (next: ProspectabilityValue) => void;
  errors: FieldErrors;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-semibold text-text-primary">Atteignabilité</legend>
      <SectionErrorsNote errors={errors} prefix="prospectability" />
      <CheckboxField
        id="icp-prospectability-accounts-identifiable"
        label="Entreprises facilement identifiables"
        checked={value.companyAccountsIdentifiable}
        onChange={(checked) => onChange({ ...value, companyAccountsIdentifiable: checked })}
        hint={icpFieldHints.prospectability.companyAccountsIdentifiable}
      />
      <CheckboxField
        id="icp-prospectability-decision-makers-identifiable"
        label="Décideurs facilement identifiables"
        checked={value.decisionMakersIdentifiable}
        onChange={(checked) => onChange({ ...value, decisionMakersIdentifiable: checked })}
        hint={icpFieldHints.prospectability.decisionMakersIdentifiable}
      />
      <StringListField
        id="icp-prospectability-supported-channels"
        label="Canaux de prospection envisageables"
        value={value.supportedChannels}
        onChange={(next) => onChange({ ...value, supportedChannels: next })}
        hint={icpFieldHints.prospectability.supportedChannels}
      />
      <CheckboxField
        id="icp-prospectability-need-discoverable"
        label="Besoin révélable en conversation"
        checked={value.needDiscoverableThroughConversation}
        onChange={(checked) => onChange({ ...value, needDiscoverableThroughConversation: checked })}
        hint={icpFieldHints.prospectability.needDiscoverableThroughConversation}
      />
      <CheckboxField
        id="icp-prospectability-meeting-value"
        label="Rendez-vous à valeur commerciale suffisante"
        checked={value.commercialValueOfMeetingRequired}
        onChange={(checked) => onChange({ ...value, commercialValueOfMeetingRequired: checked })}
        hint={icpFieldHints.prospectability.commercialValueOfMeetingRequired}
      />
      <CheckboxField
        id="icp-prospectability-human-available"
        label="Personne disponible côté client pour closer"
        checked={value.humanAvailableToCloseRequired}
        onChange={(checked) => onChange({ ...value, humanAvailableToCloseRequired: checked })}
        hint={icpFieldHints.prospectability.humanAvailableToCloseRequired}
      />
    </fieldset>
  );
}
