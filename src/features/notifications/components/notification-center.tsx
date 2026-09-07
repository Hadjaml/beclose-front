"use client";

import type { ReactNode } from "react";
import type { Notification } from "../model/notification";
import { NotificationList } from "./notification-list";

export function NotificationCenter({
  notifications,
  formatTimestamp,
  onMarkAsRead,
  renderDestination,
}: {
  notifications: readonly Notification[] | null;
  formatTimestamp?: (timestamp: string) => string;
  onMarkAsRead?: (notification: Notification) => void;
  renderDestination?: (notification: Notification) => ReactNode;
}) {
  const unreadCount =
    notifications?.filter((notification) => notification.state === "UNREAD").length ?? 0;

  return (
    <details className="relative">
      <summary className="flex min-h-10 cursor-pointer list-none items-center rounded-app-md border border-border-strong px-3 text-sm font-semibold text-text-primary hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet">
        Notifications{unreadCount === 0 ? "" : ` (${unreadCount})`}
      </summary>
      <div className="absolute right-0 z-40 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-app-lg border border-border bg-surface shadow-xl">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-text-primary">Notifications</h2>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          <NotificationList
            notifications={notifications}
            {...(formatTimestamp === undefined ? {} : { formatTimestamp })}
            {...(onMarkAsRead === undefined ? {} : { onMarkAsRead })}
            {...(renderDestination === undefined ? {} : { renderDestination })}
          />
        </div>
      </div>
    </details>
  );
}
