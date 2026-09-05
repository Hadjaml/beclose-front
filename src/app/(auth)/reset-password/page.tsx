import { PasswordResetForm } from "@/features/auth";

export default function ResetPasswordPage() {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold text-zinc-500">Bewise</p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-950">Nouveau mot de passe</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Le lien de réinitialisation sera vérifié par le service d’authentification.
      </p>
      <div className="mt-6"><PasswordResetForm resetToken={null} /></div>
    </section>
  );
}
