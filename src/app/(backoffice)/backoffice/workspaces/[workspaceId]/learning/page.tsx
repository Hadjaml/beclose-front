import { LearningOverview } from "@/features/learning";

export default function WorkspaceLearningPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Validation humaine</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Apprentissage
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Suivez ce que Bewise apprend à partir des recommandations confirmées ou corrigées.
        </p>
      </header>

      <LearningOverview domains={null} />
    </div>
  );
}
