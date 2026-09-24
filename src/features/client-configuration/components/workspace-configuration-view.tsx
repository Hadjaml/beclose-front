import type { WorkspaceConfiguration } from "../model/workspace-configuration";
import { BantCriteriaView } from "./bant-criteria-view";
import { ConfigurationStatusBanner } from "./configuration-status-banner";
import { IcpCriteriaView } from "./icp-criteria-view";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-app-lg border border-border bg-surface p-5">
      <dt className="text-sm font-semibold text-text-primary">{label}</dt>
      <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">{value}</dd>
    </div>
  );
}

export function WorkspaceConfigurationView({
  configuration,
}: {
  configuration: WorkspaceConfiguration;
}) {
  return (
    <div className="space-y-4">
      <ConfigurationStatusBanner
        workspaceId={configuration.workspaceId}
        configuration={configuration}
      />
      <dl className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom" value={configuration.name} />
        <Field
          label="Telegram"
          value={configuration.telegramChatId === null ? "Non configuré" : "Configuré"}
        />
        <Field label="Pitch" value={configuration.pitch ?? "Non renseigné"} />
        <Field label="Signature" value={configuration.signature ?? "Non renseignée"} />
        <div className="rounded-app-lg border border-border bg-surface p-5 sm:col-span-2">
          <dt className="text-sm font-semibold text-text-primary">
            Grille de qualification (BANT)
            {configuration.qualificationCriteria === null
              ? null
              : ` — version ${configuration.qualificationCriteria.version}`}
          </dt>
          <dd className="mt-2 text-sm leading-6 text-text-secondary">
            {configuration.qualificationCriteria === null ? (
              "Non définie."
            ) : (
              <div className="mt-2">
                <BantCriteriaView criteria={configuration.qualificationCriteria.criteria} />
              </div>
            )}
          </dd>
        </div>
        <div className="rounded-app-lg border border-border bg-surface p-5 sm:col-span-2">
          <dt className="text-sm font-semibold text-text-primary">
            Profil ICP (ciblage)
            {configuration.icpProfile === null
              ? null
              : ` — « ${configuration.icpProfile.name} » v${configuration.icpProfile.version}`}
          </dt>
          <dd className="mt-2 text-sm leading-6 text-text-secondary">
            {configuration.icpProfile === null ? (
              "Non défini."
            ) : (
              <div className="mt-2">
                <IcpCriteriaView criteria={configuration.icpProfile.criteria} />
              </div>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
