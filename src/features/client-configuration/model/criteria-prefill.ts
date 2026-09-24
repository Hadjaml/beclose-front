import type { BantCriteriaWire } from "../schemas/bant-criteria-wire-schema";
import type { BantCriteriaFormValue } from "../schemas/bant-criteria-form-schema";
import type { IcpCriteriaWire } from "../schemas/icp-criteria-wire-schema";
import type { IcpCriteriaFormValue } from "../schemas/icp-criteria-form-schema";

/**
 * Prefills the creation form with the ACTIVE version, so correcting a
 * profile does not mean retyping ~50 fields. It is still a NEW version: the
 * API is append-only on purpose, nothing is edited in place.
 *
 * The parsed active version (`*WireSchema`, already camelCased) and the form
 * draft share the same keys; only the free-form maps differ, which the form
 * edits as ordered lists of pairs (see `toIcpCriteriaPayload` /
 * `toBantCriteriaPayload`, the inverse). Arrays are copied so editing the
 * draft can never mutate cached query data.
 */
export function icpDraftFromActive({
  name,
  criteria,
}: {
  name: string;
  criteria: IcpCriteriaWire;
}): IcpCriteriaFormValue {
  return {
    schemaVersion: criteria.schemaVersion,
    profileName: name,
    purpose: criteria.purpose,
    market: {
      businessModel: [...criteria.market.businessModel],
      geographies: [...criteria.market.geographies],
      salesMotion: [...criteria.market.salesMotion],
    },
    companyFit: {
      employeeRange: { ...criteria.companyFit.employeeRange },
      annualRevenue: { ...criteria.companyFit.annualRevenue },
      averageCustomerValue: { ...criteria.companyFit.averageCustomerValue },
      validatedOfferRequired: criteria.companyFit.validatedOfferRequired,
      existingCustomersRequired: criteria.companyFit.existingCustomersRequired,
      humanClosingCapacityRequired: criteria.companyFit.humanClosingCapacityRequired,
    },
    prioritySectors: criteria.prioritySectors.map((group) => ({
      tier: group.tier,
      sectors: group.sectors.map((sector) => ({ id: sector.id, labelFr: sector.labelFr })),
    })),
    commercialMaturity: {
      preferredLevel: criteria.commercialMaturity.preferredLevel,
      levels: Object.entries(criteria.commercialMaturity.levels).map(([key, description]) => ({
        key,
        description,
      })),
      targetLevels: [...criteria.commercialMaturity.targetLevels],
      preferredLevels: [...criteria.commercialMaturity.preferredLevels],
      excludedLevels: [...criteria.commercialMaturity.excludedLevels],
    },
    prospectability: {
      ...criteria.prospectability,
      supportedChannels: [...criteria.prospectability.supportedChannels],
    },
    decisionMakers: {
      primary: [...criteria.decisionMakers.primary],
      secondary: [...criteria.decisionMakers.secondary],
      potentialChampions: [...criteria.decisionMakers.potentialChampions],
    },
    positiveSignals: [...criteria.positiveSignals],
    negativeSignals: [...criteria.negativeSignals],
    hardDisqualifiers: [...criteria.hardDisqualifiers],
  };
}

const rulePairs = (rules: Record<string, string[]>) =>
  Object.entries(rules).map(([key, values]) => ({ key, values: [...values] }));

export function bantDraftFromActive({
  name,
  criteria,
}: {
  name: string;
  criteria: BantCriteriaWire;
}): BantCriteriaFormValue {
  return {
    schemaVersion: criteria.schemaVersion,
    profileName: name,
    budget: {
      definition: criteria.budget.definition,
      statusValues: [...criteria.budget.statusValues],
      questions: [...criteria.budget.questions],
      positiveSignals: [...criteria.budget.positiveSignals],
      negativeSignals: [...criteria.budget.negativeSignals],
      explicitAmountRequired: criteria.budget.explicitAmountRequired,
    },
    authority: {
      definition: criteria.authority.definition,
      statusValues: [...criteria.authority.statusValues],
      questions: [...criteria.authority.questions],
      decisionMakerTitles: [...criteria.authority.decisionMakerTitles],
      championTitles: [...criteria.authority.championTitles],
    },
    need: {
      definition: criteria.need.definition,
      statusValues: [...criteria.need.statusValues],
      questions: [...criteria.need.questions],
      strongSignals: [...criteria.need.strongSignals],
      moderateSignals: [...criteria.need.moderateSignals],
      negativeSignals: [...criteria.need.negativeSignals],
      disqualifiers: [...criteria.need.disqualifiers],
    },
    timing: {
      definition: criteria.timing.definition,
      statusValues: [...criteria.timing.statusValues],
      questions: [...criteria.timing.questions],
      qualifiedHorizonDays: criteria.timing.qualifiedHorizonDays,
      nurtureHorizonDays: criteria.timing.nurtureHorizonDays,
      negativeSignals: [...criteria.timing.negativeSignals],
    },
    qualificationRules: {
      qualified: rulePairs(criteria.qualificationRules.qualified),
      nurture: rulePairs(criteria.qualificationRules.nurture),
    },
    handoffRules: { ...criteria.handoffRules },
    nurtureRules:
      criteria.nurtureRules === null
        ? null
        : {
            maxFollowUps: criteria.nurtureRules.maxFollowUps,
            followUpDelayDays: Object.entries(criteria.nurtureRules.followUpDelayDays).map(
              ([key, days]) => ({ key, days }),
            ),
          },
    conversationPolicy: { ...criteria.conversationPolicy },
    customCriteria: criteria.customCriteria === null ? null : structuredClone(criteria.customCriteria),
  };
}
