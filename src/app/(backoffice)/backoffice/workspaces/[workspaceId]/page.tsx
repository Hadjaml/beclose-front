interface BackofficeWorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function BackofficeWorkspacePage({ params }: BackofficeWorkspacePageProps) {
  const { workspaceId } = await params;

  return (
    <section aria-labelledby="workspace-title" className="max-w-3xl py-2">
      <p className="text-sm font-semibold text-zinc-500">Vue opérateur Bewise</p>
      <h2 id="workspace-title" className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
        Espace du workspace {workspaceId}
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Les informations métier de ce workspace seront ajoutées dans une phase ultérieure.
      </p>
    </section>
  );
}
