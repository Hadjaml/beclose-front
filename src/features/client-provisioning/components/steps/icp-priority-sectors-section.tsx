"use client";

import {
  icpFieldHints,
  type PrioritySectorFormValue,
  type PrioritySectorTierFormValue,
} from "@/features/client-configuration";
import { RepeatableGroupField, TextField } from "@/shared/ui/forms";

function SectorEditor({
  idPrefix,
  sector,
  onChange,
}: {
  idPrefix: string;
  sector: PrioritySectorFormValue;
  onChange: (next: PrioritySectorFormValue) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextField
        id={`${idPrefix}-id`}
        label="Identifiant"
        value={sector.id}
        onChange={(event) => onChange({ ...sector, id: event.target.value })}
        hint={icpFieldHints.prioritySector.id}
      />
      <TextField
        id={`${idPrefix}-label`}
        label="Libellé en français"
        value={sector.labelFr ?? ""}
        onChange={(event) => onChange({ ...sector, labelFr: event.target.value.trim() === "" ? null : event.target.value })}
        hint={icpFieldHints.prioritySector.labelFr}
        optional
      />
    </div>
  );
}

function TierEditor({
  idPrefix,
  tier,
  onChange,
}: {
  idPrefix: string;
  tier: PrioritySectorTierFormValue;
  onChange: (next: PrioritySectorTierFormValue) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        id={`${idPrefix}-rank`}
        label="Rang de priorité"
        type="text"
        value={String(tier.tier)}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          onChange({ ...tier, tier: Number.isFinite(parsed) && parsed > 0 ? parsed : 1 });
        }}
        hint={icpFieldHints.prioritySectorTier.tier}
      />
      <RepeatableGroupField<PrioritySectorFormValue>
        id={`${idPrefix}-sectors`}
        label="Secteurs de ce rang"
        hint={icpFieldHints.prioritySectorTier.sectors}
        value={tier.sectors}
        onChange={(next) => onChange({ ...tier, sectors: next })}
        createItem={() => ({ id: "", labelFr: null })}
        renderItem={(sector, sectorIndex, updateSector) => (
          <SectorEditor
            key={sectorIndex}
            idPrefix={`${idPrefix}-sector-${sectorIndex}`}
            sector={sector}
            onChange={updateSector}
          />
        )}
        addLabel="Ajouter un secteur"
        removeLabel="Retirer ce secteur"
        emptyLabel="Aucun secteur dans ce rang."
      />
    </div>
  );
}

export function IcpPrioritySectorsSection({
  value,
  onChange,
}: {
  value: PrioritySectorTierFormValue[];
  onChange: (next: PrioritySectorTierFormValue[]) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-base font-semibold text-text-primary">Secteurs prioritaires</legend>
      <RepeatableGroupField<PrioritySectorTierFormValue>
        id="icp-priority-sectors"
        label="Rangs de priorité"
        value={value}
        onChange={onChange}
        createItem={() => ({ tier: value.length + 1, sectors: [] })}
        renderItem={(tier, tierIndex, updateTier) => (
          <TierEditor
            key={tierIndex}
            idPrefix={`icp-priority-sectors-tier-${tierIndex}`}
            tier={tier}
            onChange={updateTier}
          />
        )}
        addLabel="Ajouter un rang"
        removeLabel="Retirer ce rang"
        emptyLabel="Aucun secteur prioritaire défini."
      />
    </fieldset>
  );
}
