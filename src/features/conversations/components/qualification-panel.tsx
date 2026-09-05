import {
  qualificationKnowledgeLabels,
  type ProgressiveQualification,
  type QualificationField,
} from "../model/conversation";

function QualificationRow({
  label,
  field,
}: {
  label: string;
  field: QualificationField;
}) {
  return (
    <div className="border-b border-zinc-100 py-3 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <dt className="text-sm font-medium text-zinc-900">{label}</dt>
        <dd className="text-sm font-semibold text-zinc-600">
          {qualificationKnowledgeLabels[field.state]}
        </dd>
      </div>
      {field.information === undefined ? null : (
        <dd className="mt-1 text-sm leading-6 text-zinc-600">{field.information}</dd>
      )}
    </div>
  );
}

interface QualificationPanelProps {
  qualification: ProgressiveQualification;
}

export function QualificationPanel({ qualification }: QualificationPanelProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-zinc-950">Qualification progressive</h3>
      <p className="mt-1 text-sm leading-6 text-zinc-600">
        Ces repères résument ce qui est connu, inconnu ou reste à confirmer.
      </p>
      <dl className="mt-3">
        <QualificationRow label="Budget" field={qualification.budget} />
        <QualificationRow label="Pouvoir de décision" field={qualification.authority} />
        <QualificationRow label="Besoin" field={qualification.need} />
        <QualificationRow label="Timing" field={qualification.timing} />
        {qualification.customCriteria?.map((criterion) => (
          <QualificationRow
            key={criterion.id ?? criterion.label}
            label={criterion.label}
            field={criterion}
          />
        ))}
      </dl>
      {qualification.interestLevel === undefined ? null : (
        <p className="mt-3 text-sm text-zinc-700">
          Niveau d’intérêt : <strong>{qualification.interestLevel}</strong>
        </p>
      )}
    </section>
  );
}
