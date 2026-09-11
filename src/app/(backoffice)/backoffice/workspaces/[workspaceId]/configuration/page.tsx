import { WorkspaceConfigurationSection } from "@/features/client-configuration";

export default function WorkspaceConfigurationPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Référentiel client</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Configuration
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Pitch, signature et grille de qualification telle qu’enregistrée par Beclose.
        </p>
      </header>

      <WorkspaceConfigurationSection />
    </div>
  );
}
