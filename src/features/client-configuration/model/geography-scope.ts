export interface GeographyScopeInput {
  status: string;
  regions: readonly string[];
  departements: readonly string[];
  unrecognized: readonly string[];
}

export interface GeographyScopeDescription {
  tone: "info" | "warning" | "neutral";
  text: string;
}

/**
 * What the sourcing REALLY applies from the ICP's geography (Beclose,
 * 24/09/2026): `national` (no filter), `restricted` (INSEE region/department
 * codes applied) or `unsupported` (a value is not recognised, or regions and
 * departments are mixed: nothing is applied and the run covers all of
 * France). A status added later is stated as unknown — never guessed.
 */
export function describeGeographyScope(scope: GeographyScopeInput): GeographyScopeDescription {
  switch (scope.status) {
    case "national":
      return { tone: "info", text: "France entière : aucun filtre géographique." };
    case "restricted": {
      const parts = [
        scope.regions.length > 0 ? `régions (codes INSEE) ${scope.regions.join(", ")}` : null,
        scope.departements.length > 0 ? `départements ${scope.departements.join(", ")}` : null,
      ].filter((part): part is string => part !== null);
      return { tone: "info", text: `Zone appliquée : ${parts.join(" ; ")}.` };
    }
    case "unsupported": {
      const values = scope.unrecognized.length > 0 ? ` (${scope.unrecognized.join(", ")})` : "";
      return {
        tone: "warning",
        text: `La zone de l’ICP${values} n’est pas appliquée : le sourcing n’est pas restreint géographiquement (toute la France). Utilisez « France », le nom officiel d’une région ou un code de département, sans mélanger région et département.`,
      };
    }
    default:
      return { tone: "neutral", text: `Zone géographique : statut inconnu (${scope.status}).` };
  }
}
