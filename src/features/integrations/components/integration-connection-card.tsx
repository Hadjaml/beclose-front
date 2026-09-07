import type { ReactNode } from "react";
import type {
  IntegrationAction,
  IntegrationConnection,
  IntegrationProvider,
} from "../model/integration";
import { IntegrationStatusBadge } from "./integration-status-badge";

interface IntegrationConnectionCardProps {
  provider: IntegrationProvider;
  connection: IntegrationConnection | null;
  renderAction?: (
    connection: IntegrationConnection,
    action: IntegrationAction,
  ) => ReactNode;
}

export function IntegrationConnectionCard({
  provider,
  connection,
  renderAction,
}: IntegrationConnectionCardProps) {
  return (
    <article className="rounded-app-lg border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-text-primary">{provider.name}</h3>
          {provider.description === undefined ? null : (
            <p className="mt-1 text-sm leading-6 text-text-secondary">{provider.description}</p>
          )}
        </div>
        <IntegrationStatusBadge status={connection?.status ?? "NOT_CONNECTED"} />
      </div>

      {connection?.accountLabel === undefined ? null : (
        <p className="mt-4 text-sm text-text-secondary">
          Compte connecté : <span className="font-medium text-text-primary">{connection.accountLabel}</span>
        </p>
      )}
      {connection?.ownerLabel === undefined ? null : (
        <p className="mt-1 text-sm text-text-secondary">Responsable : {connection.ownerLabel}</p>
      )}

      {connection?.capabilities.length ? (
        <section className="mt-4" aria-label="Capacités disponibles">
          <h4 className="text-sm font-semibold text-text-primary">Capacités</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {connection.capabilities.map((capability) => (
              <li
                key={capability.key}
                className={
                  capability.enabled
                    ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800"
                    : "rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-tertiary"
                }
              >
                {capability.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {connection?.attentionMessage === undefined ? null : (
        <p className="mt-4 rounded-app-md bg-amber-50 p-3 text-sm text-amber-950">
          {connection.attentionMessage}
        </p>
      )}
      {connection?.errorMessage === undefined ? null : (
        <p className="mt-4 rounded-app-md bg-red-50 p-3 text-sm text-red-800">
          {connection.errorMessage}
        </p>
      )}

      {connection === null || renderAction === undefined ? null : (
        <div className="mt-4 flex flex-wrap gap-2">
          {connection.actions.map((action) => renderAction(connection, action))}
        </div>
      )}
    </article>
  );
}
