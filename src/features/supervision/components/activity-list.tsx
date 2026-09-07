import { EmptyState } from "@/shared/ui/states";
import type { ActivityEvent } from "../model/supervision";

const actorKindLabels = {
  AGENT: "Agent",
  HUMAN: "Humain",
  SYSTEM: "Système",
  INTEGRATION: "Intégration",
} as const;

interface ActivityListProps {
  events: readonly ActivityEvent[];
  getWorkspaceName?: (workspaceId: string) => string | undefined;
  formatTimestamp: (timestamp: string) => string;
}

export function ActivityList({
  events,
  getWorkspaceName,
  formatTimestamp,
}: ActivityListProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="Aucune activité récente"
        description="L’activité fournie par le système apparaîtra ici."
      />
    );
  }

  return (
    <ol className="space-y-0 rounded-app-lg border border-border bg-surface px-5">
      {events.map((event) => {
        const workspaceName = getWorkspaceName?.(event.workspaceId);
        const actorName =
          event.actor.displayName ?? actorKindLabels[event.actor.kind];
        return (
          <li key={event.id} className="relative border-l border-border py-5 pl-5 first:pt-5">
            <span aria-hidden className="absolute -left-1 top-6 size-2 rounded-full bg-text-muted" />
            <p className="text-sm font-medium leading-6 text-text-primary">{event.summary}</p>
            <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-text-tertiary">
              <span>{actorName}</span>
              {workspaceName === undefined ? null : <span>· {workspaceName}</span>}
              <time dateTime={event.occurredAt}>· {formatTimestamp(event.occurredAt)}</time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
