import { AppointmentsView } from "@/features/appointments";

export default function WorkspaceAppointmentsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Passage au commercial</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Rendez-vous
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Suivez les rendez-vous qualifiés et préparez la prise en charge commerciale.
        </p>
      </header>

      <AppointmentsView items={null} />
    </div>
  );
}
