import { SettingsView } from "@/features/settings";

export default function PortalSettingsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Votre compte</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-primary">Paramètres</h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Gérez les préférences auxquelles vous êtes autorisé à accéder.
        </p>
      </header>
      <SettingsView settings={null} />
    </div>
  );
}
