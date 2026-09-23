"use client";

import { icpFieldHints } from "@/features/client-configuration";
import { SectionErrorsNote, StringListField, type FieldErrors } from "@/shared/ui/forms";

interface MarketValue {
  businessModel: string[];
  geographies: string[];
  salesMotion: string[];
}

export function IcpMarketSection({
  value,
  onChange,
  errors,
}: {
  value: MarketValue;
  onChange: (next: MarketValue) => void;
  errors: FieldErrors;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-text-primary">Marché</legend>
      <SectionErrorsNote errors={errors} prefix="market" />
      <StringListField
        id="icp-market-business-model"
        label="Modèle commercial visé"
        value={value.businessModel}
        onChange={(next) => onChange({ ...value, businessModel: next })}
        hint={icpFieldHints.market.businessModel}
      />
      <StringListField
        id="icp-market-geographies"
        label="Zones géographiques"
        value={value.geographies}
        onChange={(next) => onChange({ ...value, geographies: next })}
        hint={icpFieldHints.market.geographies}
      />
      <StringListField
        id="icp-market-sales-motion"
        label="Mode de vente habituel"
        value={value.salesMotion}
        onChange={(next) => onChange({ ...value, salesMotion: next })}
        hint={icpFieldHints.market.salesMotion}
      />
    </fieldset>
  );
}
