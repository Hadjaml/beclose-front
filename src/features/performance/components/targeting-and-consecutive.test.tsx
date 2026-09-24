import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { approvalMetricsSchema } from "../schemas/approval-metrics-schema";
import { precisionSchema } from "../schemas/precision-schema";
import { ApprovalMetricsView } from "./approval-metrics-view";
import { PrecisionView } from "./precision-view";

const base = {
  transmitted: 40,
  booked: 10,
  handedOffStrongNeed: 22,
  handedOffTechnical: 8,
  converted: 2,
  automatic: { qualifiedByGrid: 30, qualifiedShare: 0.75 },
  manual: { won: 2, lost: 1, unknown: 37, outcomeCoverage: 0.075, winRateAmongKnown: 0.6667 },
};
const targeting = {
  sourced: 100,
  notRecorded: 12,
  conform: 40,
  tolerated: 10,
  nonConform: 20,
  unknown: 30,
  measurable: 70,
  conformShare: 0.5714,
  coverage: 0.7,
  byIcpVersion: [
    { profileId: "p1", version: 2, sourced: 60, conform: 30, tolerated: 5, nonConform: 10, unknown: 15 },
    { profileId: "p0", version: 1, sourced: 40, conform: 10, tolerated: 5, nonConform: 10, unknown: 15 },
  ],
};

describe("PrecisionView — targeting: conformity of the SOURCED companies to the ICP", () => {
  it("shows the conform share next to its coverage, apart from the BANT proxy", () => {
    render(<PrecisionView precision={precisionSchema.parse({ ...base, targeting })} />);

    expect(screen.getByText("Ciblage : entreprises sourcées conformes à l’ICP")).toBeInTheDocument();
    expect(screen.getByText("57 %")).toBeInTheDocument();
    expect(screen.getByText(/couverture 70 %/)).toBeInTheDocument();
    // The BANT proxy stays its own, separately labelled measure.
    expect(screen.getByText("Qualifiés selon la grille BANT")).toBeInTheDocument();
  });

  it("shows unknown (headcount band unknown) apart and never as a failure; notRecorded apart too", () => {
    render(<PrecisionView precision={precisionSchema.parse({ ...base, targeting })} />);

    expect(screen.getAllByText("Inconnues").length).toBeGreaterThan(0);
    expect(screen.getByText(/tranche d’effectif inconnue/i)).toBeInTheDocument();
    expect(screen.getByText("Sans version d’ICP enregistrée")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText(/jamais comptées comme conformes/)).toBeInTheDocument();
  });

  it("explains 'tolérées' as outside the preferred range but inside the reject bounds", () => {
    render(<PrecisionView precision={precisionSchema.parse({ ...base, targeting })} />);
    expect(screen.getByText(/hors de la fourchette préférée mais dans les bornes de rejet/)).toBeInTheDocument();
  });

  it("lists each ICP version the companies were sourced with", () => {
    render(<PrecisionView precision={precisionSchema.parse({ ...base, targeting })} />);

    expect(screen.getByText("Version 2")).toBeInTheDocument();
    expect(screen.getByText("Version 1")).toBeInTheDocument();
  });

  it("null shares read as '—', never as 0 %", () => {
    const empty = { ...targeting, sourced: 0, conform: 0, tolerated: 0, nonConform: 0, unknown: 0, measurable: 0, conformShare: null, coverage: null, byIcpVersion: [] };
    render(<PrecisionView precision={precisionSchema.parse({ ...base, targeting: empty })} />);

    expect(screen.getByText(/Rien de mesurable pour l’instant/)).toBeInTheDocument();
    expect(screen.queryByText("0 %")).not.toBeInTheDocument();
  });

  it("shows no targeting block at all on a backend that does not send it", () => {
    render(<PrecisionView precision={precisionSchema.parse(base)} />);
    expect(screen.queryByText("Ciblage : entreprises sourcées conformes à l’ICP")).not.toBeInTheDocument();
  });
});

const criterion = { windowSize: 20, maxCorrectionRate: 0.1, windowsRequired: 2, windowRates: [0.05, 0.1], sufficientData: true, met: true };
const metricsBase = { decided: 40, acceptedAsIs: 36, corrected: 3, rejected: 1, pending: 1, correctionRate: 0.1, criterion };

describe("ApprovalMetricsView — consecutive validations without correction", () => {
  it("bases the finding on `consecutive.met`, with the counter, the required number and the minimum volume", () => {
    const metrics = approvalMetricsSchema.parse({
      ...metricsBase,
      criterion: { ...criterion, met: false },
      consecutive: { count: 31, required: 20, minimumVolume: 30, decided: 40, sufficientVolume: true, met: true },
    });
    render(<ApprovalMetricsView metrics={metrics} />);

    expect(screen.getByText("Constat : critère atteint")).toBeInTheDocument();
    expect(screen.getByText(/31 validations consécutives sans correction/)).toBeInTheDocument();
    expect(screen.getByText(/20 requises/)).toBeInTheDocument();
    expect(screen.getByText(/volume minimum de 30/)).toBeInTheDocument();
    expect(screen.getByText(/remis à zéro par une correction ou un rejet/)).toBeInTheDocument();
    expect(screen.getByText(/paramètres.*provisoires/i)).toBeInTheDocument();
  });

  it("says the volume is insufficient rather than 'not met' when too few messages were decided", () => {
    const metrics = approvalMetricsSchema.parse({
      ...metricsBase,
      consecutive: { count: 12, required: 20, minimumVolume: 30, decided: 12, sufficientVolume: false, met: false },
    });
    render(<ApprovalMetricsView metrics={metrics} />);

    expect(screen.getByText("Constat : pas assez de messages décidés pour conclure")).toBeInTheDocument();
  });

  it("not met with enough volume: not (yet) reached, with the current streak", () => {
    const metrics = approvalMetricsSchema.parse({
      ...metricsBase,
      consecutive: { count: 5, required: 20, minimumVolume: 30, decided: 50, sufficientVolume: true, met: false },
    });
    render(<ApprovalMetricsView metrics={metrics} />);

    expect(screen.getByText("Constat : critère pas encore atteint")).toBeInTheDocument();
    expect(screen.getByText(/5 validations consécutives sans correction/)).toBeInTheDocument();
  });

  it("keeps the window criterion as an indicative reading, and stays nothing-automated", () => {
    const metrics = approvalMetricsSchema.parse({
      ...metricsBase,
      consecutive: { count: 31, required: 20, minimumVolume: 30, decided: 40, sufficientVolume: true, met: true },
    });
    render(<ApprovalMetricsView metrics={metrics} />);

    expect(screen.getByText(/Indicatif : fenêtres de 20 messages/)).toBeInTheDocument();
    expect(screen.getByText(/rien n’est automatisé/)).toBeInTheDocument();
  });

  it("falls back to the window criterion on a backend without `consecutive`", () => {
    render(<ApprovalMetricsView metrics={approvalMetricsSchema.parse(metricsBase)} />);
    expect(screen.getByText("Constat : taux de correction durablement faible")).toBeInTheDocument();
  });
});
