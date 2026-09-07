import { PasswordResetRequestForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  return (
    <section className="rounded-app-lg border border-border bg-surface p-8 shadow-sm shadow-brand-navy/5">
      <h1 className="text-2xl font-semibold text-brand-navy">Mot de passe oublié</h1>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        Demandez un lien de réinitialisation si cette option est activée pour votre compte.
      </p>
      <div className="mt-6"><PasswordResetRequestForm /></div>
    </section>
  );
}
