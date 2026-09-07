import type { ReactNode } from "react";
import { EmptyState } from "@/shared/ui/states";
import {
  clientConfigurationSections,
  type ClientConfiguration,
  type ClientConfigurationSectionId,
} from "../model/client-configuration";
import { ConfigurationSection } from "./configuration-section";

interface ClientConfigurationViewProps {
  configuration: ClientConfiguration | null;
  renderSummary?: (
    sectionId: ClientConfigurationSectionId,
    value: ClientConfiguration[ClientConfigurationSectionId],
  ) => ReactNode;
  renderAction?: (sectionId: ClientConfigurationSectionId) => ReactNode;
  renderSaveStatus?: (sectionId: ClientConfigurationSectionId) => ReactNode;
}

export function ClientConfigurationView({
  configuration,
  renderSummary,
  renderAction,
  renderSaveStatus,
}: ClientConfigurationViewProps) {
  if (configuration === null) {
    return (
      <EmptyState
        title="Aucune configuration disponible"
        description="Les informations permanentes de ce workspace apparaîtront ici lorsqu’elles auront été enregistrées."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {clientConfigurationSections.map((section) => (
        <ConfigurationSection
          key={section.id}
          id={section.id}
          title={section.label}
          description={section.description}
          action={renderAction?.(section.id)}
          saveStatus={renderSaveStatus?.(section.id)}
        >
          {renderSummary?.(section.id, configuration[section.id]) ?? (
            <p className="text-sm leading-6 text-text-secondary">
              Les informations de cette section sont disponibles.
            </p>
          )}
        </ConfigurationSection>
      ))}
    </div>
  );
}
