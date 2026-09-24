import { StateLayout } from "./state-layout";

/**
 * For a screen whose data is not wired to any backend yet. Deliberately not
 * an `EmptyState`: "nothing yet, it will appear here" invites the user to
 * wait for data that cannot arrive. The screen stays visible (it is
 * planned), but says plainly that it does nothing in this version.
 */
export function NotAvailableState({ description }: { description?: string }) {
  return (
    <StateLayout
      title="Non disponible dans cette version"
      description={
        description ??
        "Cette section n’est pas encore raccordée : elle n’affiche aucune donnée et n’en affichera pas avant une prochaine version."
      }
    />
  );
}
