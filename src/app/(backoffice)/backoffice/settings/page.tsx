import { SettingsView } from "@/features/settings";

export default function BackofficeSettingsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Préférences Bewise</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Paramètres</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Retrouvez uniquement les réglages liés à votre compte et à l’organisation Bewise.
        </p>
      </header>
      <SettingsView settings={null} />
    </div>
  );
}
