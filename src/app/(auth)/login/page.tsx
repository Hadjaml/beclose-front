import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold text-zinc-500">Bewise</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">Accès à l’application</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Utilisez les accès fournis par votre organisation.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
      <p className="mt-4 text-sm text-zinc-500">
        La connexion sera activée lors du raccordement au service de session sécurisé.
      </p>
    </section>
  );
}
