"use client";

import { bantFieldHints, type BantCriteriaFormValue } from "@/features/client-configuration";
import { CheckboxField, StringListField, TextAreaField } from "@/shared/ui/forms";

type BudgetValue = BantCriteriaFormValue["budget"];

export function BantBudgetSection({
  value,
  onChange,
}: {
  value: BudgetValue;
  onChange: (next: BudgetValue) => void;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-text-primary">{bantFieldHints.budget.self}</legend>
      <TextAreaField
        id="bant-budget-definition"
        label="Définition"
        value={value.definition}
        onChange={(event) => onChange({ ...value, definition: event.target.value })}
        hint={bantFieldHints.budget.definition}
      />
      <StringListField
        id="bant-budget-status-values"
        label="Statuts possibles"
        value={value.statusValues}
        onChange={(next) => onChange({ ...value, statusValues: next })}
        hint={bantFieldHints.budget.statusValues}
      />
      <StringListField
        id="bant-budget-positive-signals"
        label="Signaux positifs"
        value={value.positiveSignals}
        onChange={(next) => onChange({ ...value, positiveSignals: next })}
        hint={bantFieldHints.budget.positiveSignals}
      />
      <StringListField
        id="bant-budget-negative-signals"
        label="Signaux négatifs"
        value={value.negativeSignals}
        onChange={(next) => onChange({ ...value, negativeSignals: next })}
        hint={bantFieldHints.budget.negativeSignals}
      />
      <StringListField
        id="bant-budget-questions"
        label="Questions à poser"
        value={value.questions}
        onChange={(next) => onChange({ ...value, questions: next })}
        hint={bantFieldHints.budget.questions}
      />
      <CheckboxField
        id="bant-budget-explicit-amount-required"
        label="Montant chiffré explicite requis"
        checked={value.explicitAmountRequired}
        onChange={(checked) => onChange({ ...value, explicitAmountRequired: checked })}
        hint={bantFieldHints.budget.explicitAmountRequired}
      />
    </fieldset>
  );
}
