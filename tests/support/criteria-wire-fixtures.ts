/** Real (snake_case) shapes as stored by Beclose, rich enough to exercise
 * every nested structure the form flattens into editable lists. */
export const bantCriteriaWire = {
  custom_criteria: { sector_fit: "ok", weights: { a: 1 } },
  schema_version: "1.0",
  profile_name: "Bewise BANT V0",
  budget: {
    definition: "Le prospect a-t-il un budget identifiable ?",
    status_values: ["validated", "probable", "unknown", "insufficient"],
    positive_signals: ["Budget annoncé"],
    negative_signals: ["Refus de discuter budget"],
    questions: ["Quel budget avez-vous prévu ?"],
    explicit_amount_required: false,
  },
  authority: {
    definition: "Le contact peut-il décider ou influencer ?",
    status_values: ["decision_maker", "champion", "influencer", "unknown", "no_authority"],
    decision_maker_titles: ["CEO", "Dirigeant"],
    champion_titles: ["Responsable commercial"],
    questions: ["Qui décide en interne ?"],
  },
  need: {
    definition: "Le besoin est-il réel et exprimé ?",
    status_values: ["strong", "moderate", "weak", "none"],
    strong_signals: ["Recherche active de solution"],
    moderate_signals: ["Intérêt exprimé"],
    negative_signals: ["Aucun besoin exprimé"],
    disqualifiers: ["Déjà équipé et satisfait"],
    questions: ["Quel est votre besoin principal ?"],
  },
  timing: {
    definition: "Le prospect a-t-il un horizon de décision ?",
    status_values: ["0_90_days", "3_6_months", "over_6_months", "unknown"],
    qualified_horizon_days: 90,
    nurture_horizon_days: 180,
    questions: ["Quand comptez-vous avancer ?"],
    negative_signals: ["Aucun horizon défini"],
  },
  qualification_rules: {
    qualified: { need: ["strong", "moderate"], timing: ["0_90_days"] },
    nurture: { need: ["moderate"], timing: ["3_6_months"] },
  },
  handoff_rules: {
    explicit_meeting_request: true,
    strong_need_and_human_request: true,
    strong_buying_intent: true,
  },
  nurture_rules: {
    max_follow_ups: 3,
    follow_up_delay_days: { "3_6_months": 30, over_6_months: 60 },
  },
  conversation_policy: {
    avoid_interrogation_style: true,
    infer_before_asking: true,
    prefer_contextual_questions: true,
    explicit_budget_question_only_when_needed: true,
  },
};

export const icpCriteriaWire = {
  schema_version: "1.0",
  profile_name: "Bewise ICP V0",
  purpose: "Cibler les PME B2B avec un besoin de prospection outbound.",
  market: {
    business_model: ["B2B services"],
    geographies: ["France"],
    sales_motion: ["Outbound"],
  },
  company_fit: {
    employee_range: { min: 10, max: 150, hard_filter: false, reject_below: 5, reject_above: 300 },
    annual_revenue: { preferred_min_eur: 500000, hard_filter: false },
    average_customer_value: { preferred_min_eur: 2000, hard_filter: false, reason: "Panier rentable" },
    validated_offer_required: true,
    existing_customers_required: true,
    human_closing_capacity_required: true,
  },
  priority_sectors: [
    { tier: 1, sectors: [{ id: "building_maintenance", label_fr: "Rénovation" }, { id: "saas", label_fr: null }] },
    { tier: 2, sectors: [{ id: "industry", label_fr: "Industrie" }] },
  ],
  commercial_maturity: {
    preferred_level: "M2",
    levels: { M2: "Structuré", M3: "Équipe commerciale" },
    target_levels: ["M1", "M2", "M3"],
    preferred_levels: ["M2"],
    excluded_levels: ["M0"],
  },
  prospectability: {
    company_accounts_identifiable: true,
    decision_makers_identifiable: true,
    supported_channels: ["email"],
    need_discoverable_through_conversation: true,
    commercial_value_of_meeting_required: true,
    human_available_to_close_required: true,
  },
  decision_makers: {
    primary: ["Dirigeant"],
    secondary: ["Responsable commercial"],
    potential_champions: ["Assistant de direction"],
  },
  positive_signals: ["Croissance récente"],
  negative_signals: ["Baisse d'effectif"],
  hard_disqualifiers: ["Liquidation judiciaire"],
};


