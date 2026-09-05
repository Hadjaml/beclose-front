import { SubscriptionsOverview } from "@/features/subscriptions";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Suivi contractuel</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Abonnements</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Supervisez les abonnements, renouvellements et usages nécessitant une attention.
        </p>
      </header>
      <SubscriptionsOverview subscriptions={null} />
    </div>
  );
}
