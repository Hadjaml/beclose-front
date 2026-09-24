import type { ArchiveResult } from "../api/clients-api";
import type { ClientSummary } from "../schemas/client-summary-schema";
import { ClientRow } from "./client-row";
import { ClientsEmptyState } from "./clients-empty-state";

export function ClientsList({
  clients,
  onArchived,
}: {
  clients: readonly ClientSummary[];
  onArchived?: (result: ArchiveResult) => void;
}) {
  if (clients.length === 0) {
    return <ClientsEmptyState />;
  }

  return (
    <ul className="divide-y divide-border rounded-app-lg border border-border bg-surface">
      {clients.map((client) => (
        <ClientRow
          key={client.workspaceId}
          client={client}
          {...(onArchived === undefined ? {} : { onArchived })}
        />
      ))}
    </ul>
  );
}
