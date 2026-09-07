import { PasswordResetForm } from "@/features/auth";

export default function ResetPasswordPage() {
  return (
    <section className="rounded-app-lg border border-border bg-surface p-8 shadow-sm shadow-brand-navy/5">
      <h1 className="text-2xl font-semibold text-brand-navy">Nouveau mot de passe</h1>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        Le lien de réinitialisation sera vérifié par le service d’authentification.
      </p>
      <div className="mt-6"><PasswordResetForm resetToken={null} /></div>
    </section>
  );
}
