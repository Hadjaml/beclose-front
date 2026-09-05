import { EmptyState } from "@/shared/ui/states";

export function AppointmentsEmptyState() {
  return (
    <EmptyState
      title="Aucun rendez-vous pour le moment"
      description="Les rendez-vous qualifiés apparaîtront ici lorsque le système de prise de rendez-vous sera connecté."
    />
  );
}
