import type { ReactNode } from "react";
import { EmptyState } from "@/shared/ui/states";
import type { Notification } from "../model/notification";

export function NotificationList({
  notifications,
  formatTimestamp,
  renderDestination,
  onMarkAsRead,
}: {
  notifications: readonly Notification[] | null;
  formatTimestamp?: (timestamp: string) => string;
  renderDestination?: (notification: Notification) => ReactNode;
  onMarkAsRead?: (notification: Notification) => void;
}) {
  if (notifications === null || notifications.length === 0) {
    return (
      <EmptyState
        title="Aucune notification"
        description="Les informations qui nécessitent votre attention apparaîtront ici."
      />
    );
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {notifications.map((notification) => (
        <li key={notification.id} className="p-4">
          <div className="flex items-start gap-3">
            <span
              className={
                notification.state === "UNREAD"
                  ? "mt-1.5 size-2 shrink-0 rounded-full bg-zinc-950"
                  : "mt-1.5 size-2 shrink-0 rounded-full bg-zinc-300"
              }
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <span className="sr-only">
                {notification.state === "UNREAD" ? "Notification non lue. " : "Notification lue. "}
              </span>
              <p className="text-sm font-semibold text-zinc-950">{notification.title}</p>
              {notification.summary === undefined ? null : (
                <p className="mt-1 text-sm leading-6 text-zinc-600">{notification.summary}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <time dateTime={notification.occurredAt}>
                  {formatTimestamp?.(notification.occurredAt) ?? notification.occurredAt}
                </time>
                {renderDestination?.(notification)}
                {notification.state === "UNREAD" && onMarkAsRead !== undefined ? (
                  <button
                    type="button"
                    onClick={() => onMarkAsRead(notification)}
                    className="font-semibold text-zinc-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    Marquer comme lue
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
