import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface-muted p-6">
      <section className="w-full max-w-xl rounded-app-lg border border-border bg-surface p-8 text-center">
        <p className="text-sm font-semibold text-text-tertiary">Page introuvable</p>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary">
          Cette page n’est pas disponible
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Vérifiez l’adresse ou revenez à l’accueil.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-10 items-center rounded-app-md bg-brand-navy px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
        >
          Revenir à l’accueil
        </Link>
      </section>
    </main>
  );
}
