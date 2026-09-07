import { ClientsSupervisionView } from "@/features/clients";

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Organisations clientes</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">Clients</h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">Suivez ici la préparation et l’état des systèmes de chaque client.</p>
      </header>
      <ClientsSupervisionView workspaces={null} />
    </div>
  );
}
