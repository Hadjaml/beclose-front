import type { WorkspaceConfiguration } from "../model/workspace-configuration";

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
            <pre className="mt-2 overflow-x-auto rounded-app-md bg-surface-muted p-3 text-xs">
              {JSON.stringify(configuration.qualificationCriteria.criteria, null, 2)}
            </pre>
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
            <pre className="mt-2 overflow-x-auto rounded-app-md bg-surface-muted p-3 text-xs">
              {JSON.stringify(configuration.icpProfile.criteria, null, 2)}
            </pre>
          )}
        </dd>
      </div>
    </dl>
  );
}
