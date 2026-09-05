import {
  portalProspectingVisibility,
  ProspectingView,
} from "@/features/prospecting";

export default function PortalProspectsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Prospects intéressants</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Prospects</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Consultez les prospects retenus et les informations utiles à leur suivi.
        </p>
      </header>
      <ProspectingView prospects={null} visibility={portalProspectingVisibility} />
    </div>
  );
}
