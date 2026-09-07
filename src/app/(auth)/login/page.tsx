import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <section className="rounded-app-lg border border-border bg-surface p-8 shadow-sm shadow-brand-navy/5">
      <h1 className="text-2xl font-semibold tracking-tight text-brand-navy">Accès à l’application</h1>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        Utilisez les accès fournis par votre organisation.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
      <p className="mt-4 text-sm text-text-tertiary">
        La connexion sera activée lors du raccordement au service de session sécurisé.
      </p>
    </section>
  );
}
