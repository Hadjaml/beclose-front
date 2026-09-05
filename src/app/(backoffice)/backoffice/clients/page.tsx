import { ClientsEmptyState } from "@/features/clients";

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Organisations clientes</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Clients</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">Suivez ici la préparation et l’état des systèmes de chaque client.</p>
      </header>
      <ClientsEmptyState />
    </div>
  );
}
