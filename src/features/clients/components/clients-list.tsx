import Link from "next/link";
import type { ClientSummary } from "../schemas/client-summary-schema";
import { ClientsEmptyState } from "./clients-empty-state";

export function ClientsList({ clients }: { clients: readonly ClientSummary[] }) {
  if (clients.length === 0) {
    return <ClientsEmptyState />;
  }

  return (
    <ul className="divide-y divide-border rounded-app-lg border border-border bg-surface">
      {clients.map((client) => (
        <li key={client.workspaceId}>
          <Link
            href={`/backoffice/workspaces/${client.workspaceId}`}
            className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary">{client.name}</p>
              {client.pitch === null ? null : (
                <p className="mt-1 truncate text-sm text-text-secondary">{client.pitch}</p>
              )}
            </div>
            <span className="shrink-0 text-xs text-text-tertiary">
              {client.telegramChatId === null ? "Telegram non configuré" : "Telegram configuré"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
