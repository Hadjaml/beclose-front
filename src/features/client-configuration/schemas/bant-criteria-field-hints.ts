/**
 * French, business-oriented help text for each `BantCriteria` field —
 * copied verbatim from Beclose's own `Field(description=...)`
 * (`core/profiles/bant_schema.py`, EF-601/602, 2026-09-23). See
 * `icp-criteria-field-hints.ts` for the same rationale.
 */
export const bantFieldHints = {
  profileName: "Nom de cette grille BANT, affiché dans la liste des versions.",
  schemaVersion:
    "Version du schéma de cette grille (ex. « 1.0 ») — à ne pas confondre avec le numéro de version de la grille elle-même (géré automatiquement par Beclose).",
  notes: "Note libre sur cette version — usage interne, jamais montrée au prospect.",

  budget: {
    self: "Critère Budget : le prospect a-t-il les moyens ?",
    definition: "Explique en une phrase ce que signifie un budget suffisant pour vous — guide l'agent qui évalue la conversation.",
    statusValues:
      "Statuts possibles pour ce critère (ex. « confirmed », « unknown », « insufficient ») — vocabulaire libre, réutilisé ensuite dans les règles de qualification ci-dessous.",
    positiveSignals: "Ce qui, dans une conversation, indique un budget suffisant.",
    negativeSignals: "Ce qui, dans une conversation, indique un budget insuffisant.",
    questions: "Questions que l'agent peut poser pour clarifier le budget, si le sujet n'est pas venu naturellement.",
    explicitAmountRequired: "Faut-il un montant chiffré explicite pour considérer ce critère comme rempli, ou un accord de principe suffit-il ?",
  },
  authority: {
    self: "Critère Autorité : parle-t-on à la bonne personne ?",
    definition: "Explique en une phrase ce que signifie avoir le bon niveau de décision en face — guide l'agent.",
    statusValues: "Statuts possibles pour ce critère (ex. « decision_maker », « champion », « unknown »).",
    decisionMakerTitles: "Intitulés de poste considérés comme décideurs directs.",
    championTitles: "Intitulés de poste considérés comme relais internes (influents mais pas décideurs).",
    questions: "Questions que l'agent peut poser pour clarifier qui décide.",
  },
  need: {
    self: "Critère Besoin : le prospect a-t-il un vrai besoin ?",
    definition: "Explique en une phrase ce que signifie un besoin réel pour vous — guide l'agent.",
    statusValues: "Statuts possibles pour ce critère (ex. « strong », « moderate », « none »).",
    strongSignals: "Ce qui, dans une conversation, indique un besoin fort.",
    moderateSignals: "Ce qui, dans une conversation, indique un besoin réel mais pas urgent.",
    negativeSignals: "Ce qui, dans une conversation, indique une absence de besoin.",
    disqualifiers: "Signaux qui disqualifient le prospect sur ce critère, quel que soit le reste.",
    questions: "Questions que l'agent peut poser pour clarifier le besoin.",
  },
  timing: {
    self: "Critère Horizon : le prospect est-il prêt à agir dans un délai exploitable ?",
    definition: "Explique en une phrase ce que signifie un horizon d'achat exploitable pour vous.",
    statusValues: "Statuts possibles pour ce critère (ex. « immediate », « 3_6_months », « over_6_months », « unknown »).",
    qualifiedHorizonDays:
      "Nombre de jours en dessous duquel l'horizon indiqué par le prospect est considéré comme proche (utilisé pour la qualification).",
    nurtureHorizonDays:
      "Nombre de jours en dessous duquel l'horizon indiqué par le prospect justifie encore une relance différée plutôt qu'un abandon.",
    questions: "Questions que l'agent peut poser pour clarifier l'horizon d'achat.",
    negativeSignals: "Ce qui, dans une conversation, indique un horizon trop lointain ou incertain pour être exploitable.",
  },

  qualificationRules: {
    self: "Règles qui combinent les quatre statuts BANT en un verdict qualifié/relance différée/échec.",
    qualified: "Pour chaque critère (clé, ex. « budget »), la ou les valeurs de statut qui, réunies, font passer le prospect en qualifié.",
    nurture:
      "Pour chaque critère, la ou les valeurs de statut qui font basculer le prospect en relance différée plutôt qu'en qualifié ou en échec. Suffixer la clé par « _not » pour une condition en négation (ex. « budget_not »: [« insufficient »]).",
  },

  handoffRules: {
    self: "Conditions qui déclenchent un transfert immédiat vers l'équipe commerciale, sans attendre la fin de la qualification.",
    explicitMeetingRequest: "Une demande de rendez-vous explicite du prospect déclenche-t-elle la négociation de créneaux ?",
    strongNeedAndHumanRequest:
      "Un besoin fort accompagné d'une demande explicite d'échanger avec une personne déclenche-t-il un transfert immédiat vers l'équipe commerciale ?",
    strongBuyingIntent: "Une intention d'achat clairement exprimée déclenche-t-elle un transfert immédiat vers l'équipe commerciale ?",
  },

  nurtureRules: {
    self: "Règles de relance différée pour un prospect dont la conversation reste ouverte sans issue immédiate. Laisser vide pour ne jamais relancer automatiquement.",
    maxFollowUps: "Nombre maximum de relances envoyées sans réponse du prospect avant d'arrêter de le solliciter. Une réponse du prospect remet ce compteur à zéro.",
    followUpDelayDays:
      "Délai en jours avant la première relance, par statut d'horizon indiqué par le prospect (clé = une des valeurs de statut du critère « timing » ; valeur = nombre de jours). Les relances suivantes sont espacées du même délai. Un statut absent de cette liste n'est jamais relancé automatiquement.",
  },

  conversationPolicy: {
    self: "Style de conversation à adopter par l'agent de qualification.",
    avoidInterrogationStyle: "L'agent doit-il éviter d'enchaîner les questions comme un interrogatoire (une question à la fois, dans le fil de la conversation) ?",
    inferBeforeAsking: "L'agent doit-il essayer de déduire une information du contexte avant de la demander explicitement au prospect ?",
    preferContextualQuestions:
      "L'agent doit-il privilégier des questions qui rebondissent sur ce que le prospect vient de dire, plutôt que des questions génériques ?",
    explicitBudgetQuestionOnlyWhenNeeded: "L'agent doit-il éviter de demander un montant précis tant que ce n'est pas nécessaire pour trancher ?",
  },
} as const;
