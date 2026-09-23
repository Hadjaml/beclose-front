/**
 * French, business-oriented help text for each `IcpProfileCriteria` field —
 * copied verbatim from Beclose's own `Field(description=...)`
 * (`core/profiles/icp_schema.py`, EF-601/602, 2026-09-23), the text Beclose
 * exposes through its OpenAPI docs for exactly this purpose ("c'est ce
 * texte qu'expose l'OpenAPI de l'API pour que le frontend l'affiche sous
 * chaque champ de formulaire"). Not reworded — Beclose owns this text; if
 * it changes there, copy the update here rather than drift.
 */
export const icpFieldHints = {
  profileName: "Nom de ce profil ICP, affiché dans la liste des versions (ex. « Profil Bewise V1 »).",
  purpose: "Résumé en une ou deux phrases de l'usage de ce profil : quel type de client il sert à cibler, et pourquoi.",
  schemaVersion:
    "Version du schéma de ce profil (ex. « 1.0 ») — suit les évolutions de structure, à ne pas confondre avec le numéro de version du profil lui-même (géré automatiquement par Beclose).",
  notes: "Note libre sur cette version (ex. pourquoi elle a été créée) — usage interne, jamais montrée au prospect.",

  market: {
    businessModel:
      "Types de clientèle visée par vos clients (ex. « B2B », « B2C ») — décrit le modèle commercial recherché chez le prospect, pas le vôtre.",
    geographies: "Zones géographiques ciblées pour le sourcing (ex. « France », « Île-de-France »).",
    salesMotion:
      "Manière dont ces entreprises vendent habituellement (ex. « vente directe », « cycle long », « appel d'offres ») — aide à repérer si elles ont une vraie force commerciale en place.",
  },

  employeeRange: {
    min: "Effectif minimum préféré (nombre de salariés). En dessous, l'entreprise est tolérée jusqu'à la borne de rejet basse mais pas privilégiée.",
    max: "Effectif maximum préféré. Au-dessus, l'entreprise est tolérée jusqu'à la borne de rejet haute mais pas privilégiée.",
    hardFilter: "Champ conservé pour compatibilité avec d'anciens profils, non appliqué aujourd'hui par le sourcing — laisser à false.",
    rejectBelow:
      "Effectif en dessous duquel l'entreprise est définitivement écartée. Laisser vide pour n'appliquer aucune borne basse stricte (seule la fourchette préférée compte).",
    rejectAbove:
      "Effectif au-dessus duquel l'entreprise est définitivement écartée. Laisser vide pour n'appliquer aucune borne haute stricte (seule la fourchette préférée compte).",
  },
  annualRevenue: {
    preferredMinEur:
      "Chiffre d'affaires annuel minimum préféré, en euros. Non exploité aujourd'hui par le sourcing (aucune source de données publique ne le fournit) — champ conservé pour une future intégration.",
    hardFilter: "Si activé, exclurait les entreprises sous ce seuil — non appliqué aujourd'hui, faute de donnée disponible au sourcing.",
  },
  averageCustomerValue: {
    preferredMinEur:
      "Valeur moyenne visée d'un client de cette entreprise, en euros — indicateur indirect de sa capacité à investir dans une prestation comme la vôtre.",
    hardFilter: "Si activé, exclurait les entreprises sous ce seuil — non appliqué aujourd'hui, faute de donnée disponible au sourcing.",
    reason: "Explication libre du choix de ce seuil, pour se souvenir du raisonnement plus tard. Facultatif.",
  },
  companyFit: {
    validatedOfferRequired:
      "Le prospect doit-il déjà avoir une offre commerciale validée (produit/service prêt à vendre) pour être qualifié plus tard ? Critère évalué en conversation, pas au sourcing.",
    existingCustomersRequired: "Le prospect doit-il déjà avoir des clients existants ? Critère évalué en conversation, pas au sourcing.",
    humanClosingCapacityRequired:
      "Le prospect doit-il disposer de quelqu'un en interne capable de conclure (« closer ») les rendez-vous obtenus ? Critère évalué en conversation, pas au sourcing.",
  },

  prioritySector: {
    id: "Identifiant technique du secteur (ex. « commercial_cleaning »), libre — sert de clé interne.",
    labelFr:
      "Libellé en français du secteur (ex. « nettoyage professionnel »), utilisé pour trouver les bons codes NAF au sourcing. Un secteur sans libellé est ignoré au sourcing.",
  },
  prioritySectorTier: {
    tier: "Rang de priorité de ce groupe de secteurs (1 = prioritaire, sourcé par défaut ; 2, 3... = secondaire, sourcé seulement si explicitement demandé).",
    sectors: "Secteurs regroupés dans ce rang de priorité.",
  },

  commercialMaturity: {
    preferredLevel: "Niveau de maturité commerciale idéal, parmi ceux listés dans « levels ».",
    levels:
      'Échelle des niveaux de maturité commerciale possibles, avec leur définition (ex. {"debutant": "...", "structure": "..."}).',
    targetLevels: "Niveaux considérés comme de bons candidats.",
    preferredLevels: "Niveaux considérés comme les meilleurs candidats — sous-ensemble de « niveaux ciblés ».",
    excludedLevels: "Niveaux qui excluent le prospect.",
  },

  prospectability: {
    companyAccountsIdentifiable: "Peut-on identifier facilement les entreprises de cette cible (ex. via un annuaire, un secteur clair) ?",
    decisionMakersIdentifiable: "Peut-on identifier facilement qui décide, dans ce type d'entreprise ?",
    supportedChannels: "Canaux de prospection envisageables pour cette cible (ex. « email », « linkedin »).",
    needDiscoverableThroughConversation:
      "Le besoin de ce prospect peut-il se révéler au fil d'une conversation, même s'il n'est pas exprimé dès le premier contact ?",
    commercialValueOfMeetingRequired:
      "Un rendez-vous avec ce prospect a-t-il une valeur commerciale suffisante pour justifier l'effort de qualification ?",
    humanAvailableToCloseRequired: "Faut-il qu'une personne soit disponible côté client pour transformer le rendez-vous obtenu ?",
  },

  decisionMakers: {
    primary: "Intitulés de poste des décideurs principaux visés (ex. « Directeur général », « Gérant »).",
    secondary: "Intitulés de poste des décideurs secondaires, à défaut d'un décideur principal identifié.",
    potentialChampions:
      "Intitulés de poste des personnes susceptibles de porter le sujet en interne sans être elles-mêmes décideuses (ex. « Responsable RH »).",
  },

  positiveSignals:
    "Signaux qui renforcent la conviction qu'une entreprise correspond à la cible (ex. « recrute activement », « vient de lever des fonds ») — usage interne, jamais montrés au prospect.",
  negativeSignals:
    "Signaux qui affaiblissent la conviction qu'une entreprise correspond à la cible, sans l'exclure automatiquement (ex. « activité très saisonnière »).",
  hardDisqualifiers: "Signaux qui excluent une entreprise sans discussion possible, quel que soit le reste (ex. « secteur interdit »).",
} as const;
