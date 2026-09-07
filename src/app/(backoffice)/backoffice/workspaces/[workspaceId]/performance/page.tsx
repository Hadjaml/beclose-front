import { PerformanceView } from "@/features/performance";

export default function WorkspacePerformancePage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Résultats et amélioration</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Performance
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Comprenez les résultats obtenus, les écarts observés et les améliorations recommandées.
        </p>
      </header>
      <PerformanceView performance={null} />
    </div>
  );
}
