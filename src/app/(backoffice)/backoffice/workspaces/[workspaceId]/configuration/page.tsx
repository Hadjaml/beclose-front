import { ClientConfigurationView } from "@/features/client-configuration";

export default function WorkspaceConfigurationPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Référentiel client</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Configuration
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Retrouvez et mettez à jour chaque partie de la configuration de façon indépendante.
        </p>
      </header>

      <ClientConfigurationView configuration={null} />
    </div>
  );
}
