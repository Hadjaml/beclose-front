import Link from "next/link";
import { LoginPage, safeLoginRedirect } from "@/features/auth";

export default async function LoginRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { redirectTo } = await searchParams;
  const returnTo = safeLoginRedirect(typeof redirectTo === "string" ? redirectTo : undefined);

  return (
    <section className="rounded-app-lg border border-border bg-surface p-8 shadow-sm shadow-brand-navy/5">
      <h1 className="text-2xl font-semibold tracking-tight text-brand-navy">Accès à l’application</h1>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        Utilisez les accès fournis par votre organisation.
      </p>
      <div className="mt-6">
        <LoginPage
          redirectTo={returnTo}
          forgotPasswordAction={
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-brand-blue-violet hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          }
        />
      </div>
    </section>
  );
}
