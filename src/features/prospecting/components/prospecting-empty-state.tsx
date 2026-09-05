import { EmptyState } from "@/shared/ui/states";

export function ProspectingEmptyState() {
  return (
    <EmptyState
      title="Aucun prospect pour le moment"
      description="Les prospects correspondant à la cible apparaîtront ici lorsque le sourcing sera disponible."
    />
  );
}
