import { NotAvailableState } from "@/shared/ui/states";

/** Shown when the appointments source is not wired (`items === null`) —
 * "aucun rendez-vous" would be false: one may exist that this screen cannot
 * read (audit C01/C03). */
export function AppointmentsEmptyState() {
  return (
    <NotAvailableState description="La lecture des rendez-vous n’est pas encore raccordée : un rendez-vous confirmé peut exister sans apparaître ici." />
  );
}
