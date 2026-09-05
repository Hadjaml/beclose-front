import { PasswordResetRequestForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold text-zinc-500">Bewise</p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-950">Mot de passe oublié</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Demandez un lien de réinitialisation si cette option est activée pour votre compte.
      </p>
      <div className="mt-6"><PasswordResetRequestForm /></div>
    </section>
  );
}
