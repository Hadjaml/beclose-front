import Link from "next/link";
import { EmptyState } from "@/shared/ui/states";

export function ClientsEmptyState() {
  return (
    <EmptyState
      title="Aucun client pour le moment"
      description="Commencez par rassembler les informations nécessaires pour préparer un premier workspace client."
      action={
        <Link href="/backoffice/clients/new" className="brand-gradient-action brand-gradient-hover mt-2 rounded-app-md px-5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet">
          Onboarder un client
        </Link>
      }
    />
  );
}
