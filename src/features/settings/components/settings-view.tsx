import { EmptyState, NotAvailableState } from "@/shared/ui/states";
import type { Settings, SettingsAction } from "../model/settings";

export function SettingsView({
  settings,
  onAction,
}: {
  settings: Settings | null;
  onAction?: (action: SettingsAction) => void;
}) {
  if (settings === null) {
    return (
      <NotAvailableState />
    );
  }

  const hasVisibleSettings =
    settings.account !== undefined ||
    settings.preferences !== undefined ||
    settings.organizationName !== undefined ||
    (onAction !== undefined && settings.actions.length > 0);
  if (!hasVisibleSettings) {
    return (
      <EmptyState
        title="Aucun paramètre accessible"
        description="Aucun réglage n’est disponible avec vos permissions actuelles."
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {settings.account === undefined ? null : (
        <section className="rounded-app-lg border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold text-text-primary">Compte</h2>
          <p className="mt-3 text-sm font-medium text-text-primary">{settings.account.displayName}</p>
          <p className="mt-1 text-sm text-text-secondary">{settings.account.email}</p>
        </section>
      )}
      {settings.preferences === undefined ? null : (
        <section className="rounded-app-lg border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold text-text-primary">Préférences</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {settings.preferences.locale === undefined ? null : (
              <div>
                <dt className="text-text-secondary">Langue</dt>
                <dd className="font-medium text-text-primary">{settings.preferences.locale}</dd>
              </div>
            )}
            {settings.preferences.timezone === undefined ? null : (
              <div>
                <dt className="text-text-secondary">Fuseau horaire</dt>
                <dd className="font-medium text-text-primary">{settings.preferences.timezone}</dd>
              </div>
            )}
          </dl>
        </section>
      )}
      {onAction === undefined || settings.actions.length === 0 ? null : (
        <div className="flex flex-wrap gap-2 lg:col-span-2">
          {settings.actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onAction(action)}
              className="min-h-10 rounded-app-md border border-border-strong px-4 text-sm font-semibold text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
