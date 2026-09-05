export default function PortalPage() {
  return (
    <section aria-labelledby="portal-title" className="max-w-3xl">
      <p className="text-sm font-semibold text-zinc-500">Intervention client</p>
      <h2 id="portal-title" className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
        Éléments à valider
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Les éléments nécessitant une intervention humaine apparaîtront ici lorsqu’ils seront fournis par le backend.
      </p>
    </section>
  );
}
