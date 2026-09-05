import { TeamView } from "@/features/team";

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Accès Bewise</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Équipe</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Gérez les membres, leurs accès aux workspaces et leurs permissions effectives.
        </p>
      </header>
      <TeamView team={null} />
    </div>
  );
}
