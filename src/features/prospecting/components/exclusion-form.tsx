"use client";

import { useState, type FormEvent } from "react";
import type { ExclusionDraft } from "../model/prospecting";
import { exclusionDraftSchema } from "../schemas/review-schemas";

export interface ExclusionReasonOption {
  code: string;
  label: string;
}

interface ExclusionFormProps {
  reasons: readonly ExclusionReasonOption[];
  onSubmit: (draft: ExclusionDraft) => void;
  onCancel: () => void;
}

export function ExclusionForm({ reasons, onSubmit, onCancel }: ExclusionFormProps) {
  const [error, setError] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = exclusionDraftSchema.safeParse({
      type: formData.get("type"),
      reasonCode: formData.get("reasonCode"),
      comment: formData.get("comment"),
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Vérifiez les informations saisies.");
      return;
    }

    setError(undefined);
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold text-zinc-900">Durée de l’exclusion</legend>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <label className="flex items-center gap-2">
            <input type="radio" name="type" value="TEMPORARY" defaultChecked />
            Temporaire
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="type" value="PERMANENT" />
            Définitive
          </label>
        </div>
      </fieldset>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-zinc-900">Motif</span>
        <select
          name="reasonCode"
          defaultValue=""
          className="min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900"
        >
          <option value="" disabled>Choisir un motif</option>
          {reasons.map((reason) => (
            <option key={reason.code} value={reason.code}>{reason.label}</option>
          ))}
        </select>
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-zinc-900">
          Commentaire <span className="font-normal text-zinc-500">— facultatif</span>
        </span>
        <textarea
          name="comment"
          rows={3}
          className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm leading-6 text-zinc-900"
        />
      </label>
      {error === undefined ? null : <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onCancel} className="min-h-10 rounded-lg px-4 text-sm font-semibold text-zinc-700">
          Annuler
        </button>
        <button type="submit" className="min-h-10 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white">
          Confirmer l’exclusion
        </button>
      </div>
    </form>
  );
}
