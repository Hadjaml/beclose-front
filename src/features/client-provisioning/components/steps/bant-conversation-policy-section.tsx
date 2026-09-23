"use client";

import { bantFieldHints, type BantCriteriaFormValue } from "@/features/client-configuration";
import { CheckboxField } from "@/shared/ui/forms";

type ConversationPolicyValue = BantCriteriaFormValue["conversationPolicy"];

export function BantConversationPolicySection({
  value,
  onChange,
}: {
  value: ConversationPolicyValue;
  onChange: (next: ConversationPolicyValue) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-semibold text-text-primary">{bantFieldHints.conversationPolicy.self}</legend>
      <CheckboxField
        id="bant-conversation-avoid-interrogation"
        label="Éviter le style interrogatoire"
        checked={value.avoidInterrogationStyle}
        onChange={(checked) => onChange({ ...value, avoidInterrogationStyle: checked })}
        hint={bantFieldHints.conversationPolicy.avoidInterrogationStyle}
      />
      <CheckboxField
        id="bant-conversation-infer-before-asking"
        label="Déduire avant de demander"
        checked={value.inferBeforeAsking}
        onChange={(checked) => onChange({ ...value, inferBeforeAsking: checked })}
        hint={bantFieldHints.conversationPolicy.inferBeforeAsking}
      />
      <CheckboxField
        id="bant-conversation-prefer-contextual-questions"
        label="Privilégier les questions contextuelles"
        checked={value.preferContextualQuestions}
        onChange={(checked) => onChange({ ...value, preferContextualQuestions: checked })}
        hint={bantFieldHints.conversationPolicy.preferContextualQuestions}
      />
      <CheckboxField
        id="bant-conversation-explicit-budget-only-when-needed"
        label="Ne demander un montant précis que si nécessaire"
        checked={value.explicitBudgetQuestionOnlyWhenNeeded}
        onChange={(checked) => onChange({ ...value, explicitBudgetQuestionOnlyWhenNeeded: checked })}
        hint={bantFieldHints.conversationPolicy.explicitBudgetQuestionOnlyWhenNeeded}
      />
    </fieldset>
  );
}
