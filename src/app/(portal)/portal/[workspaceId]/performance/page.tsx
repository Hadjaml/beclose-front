import {
  PerformanceView,
  portalPerformanceVisibility,
} from "@/features/performance";

export default function PortalPerformancePage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Vos résultats</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Performance</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Retrouvez les résultats utiles au pilotage de votre acquisition.
        </p>
      </header>
      <PerformanceView performance={null} visibility={portalPerformanceVisibility} />
    </div>
  );
}
