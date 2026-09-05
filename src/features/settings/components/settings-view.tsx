import { EmptyState } from "@/shared/ui/states";
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
      <EmptyState
        title="Aucun paramètre disponible"
        description="Les paramètres de compte et préférences autorisés apparaîtront ici."
      />
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
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Compte</h2>
          <p className="mt-3 text-sm font-medium text-zinc-900">{settings.account.displayName}</p>
          <p className="mt-1 text-sm text-zinc-600">{settings.account.email}</p>
        </section>
      )}
      {settings.preferences === undefined ? null : (
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Préférences</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {settings.preferences.locale === undefined ? null : (
              <div>
                <dt className="text-zinc-600">Langue</dt>
                <dd className="font-medium text-zinc-950">{settings.preferences.locale}</dd>
              </div>
            )}
            {settings.preferences.timezone === undefined ? null : (
              <div>
                <dt className="text-zinc-600">Fuseau horaire</dt>
                <dd className="font-medium text-zinc-950">{settings.preferences.timezone}</dd>
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
              className="min-h-10 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
