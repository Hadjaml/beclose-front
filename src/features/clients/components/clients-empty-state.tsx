import Link from "next/link";
import { EmptyState } from "@/shared/ui/states";

export function ClientsEmptyState() {
  return (
    <EmptyState
      title="Aucun client pour le moment"
      description="Commencez par rassembler les informations nécessaires pour préparer un premier workspace client."
      action={
        <Link href="/backoffice/clients/new" className="mt-2 rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950">
          Onboarder un client
        </Link>
      }
    />
  );
}
