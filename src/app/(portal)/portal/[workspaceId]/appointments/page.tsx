import { AppointmentsView } from "@/features/appointments";

export default function PortalAppointmentsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Échanges commerciaux</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Rendez-vous</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Consultez les rendez-vous qualifiés et les informations utiles à leur préparation.
        </p>
      </header>
      <AppointmentsView items={null} />
    </div>
  );
}
