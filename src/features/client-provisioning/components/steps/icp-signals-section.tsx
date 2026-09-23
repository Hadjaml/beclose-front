"use client";

import { icpFieldHints } from "@/features/client-configuration";
import { StringListField } from "@/shared/ui/forms";

export function IcpSignalsSection({
  positiveSignals,
  negativeSignals,
  hardDisqualifiers,
  onPositiveSignalsChange,
  onNegativeSignalsChange,
  onHardDisqualifiersChange,
}: {
  positiveSignals: string[];
  negativeSignals: string[];
  hardDisqualifiers: string[];
  onPositiveSignalsChange: (next: string[]) => void;
  onNegativeSignalsChange: (next: string[]) => void;
  onHardDisqualifiersChange: (next: string[]) => void;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-text-primary">Signaux</legend>
      <StringListField
        id="icp-positive-signals"
        label="Signaux positifs"
        value={positiveSignals}
        onChange={onPositiveSignalsChange}
        hint={icpFieldHints.positiveSignals}
      />
      <StringListField
        id="icp-negative-signals"
        label="Signaux négatifs"
        value={negativeSignals}
        onChange={onNegativeSignalsChange}
        hint={icpFieldHints.negativeSignals}
      />
      <StringListField
        id="icp-hard-disqualifiers"
        label="Disqualifiants stricts"
        value={hardDisqualifiers}
        onChange={onHardDisqualifiersChange}
        hint={icpFieldHints.hardDisqualifiers}
      />
    </fieldset>
  );
}
