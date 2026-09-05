import { GlobalSupervisionView } from "@/features/supervision";

export default function BackofficePage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Supervision globale</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Back Office Bewise
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Identifiez les workspaces qui demandent une attention et les décisions à prendre.
        </p>
      </header>
      <GlobalSupervisionView supervision={null} />
    </div>
  );
}
