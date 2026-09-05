import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50 p-6">
      <section className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-zinc-500">Page introuvable</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-950">
          Cette page n’est pas disponible
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Vérifiez l’adresse ou revenez à l’accueil.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
        >
          Revenir à l’accueil
        </Link>
      </section>
    </main>
  );
}
