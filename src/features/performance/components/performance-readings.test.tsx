import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { approvalMetricsSchema } from "../schemas/approval-metrics-schema";
import { precisionSchema } from "../schemas/precision-schema";
import { ApprovalMetricsView } from "./approval-metrics-view";
import { PrecisionView } from "./precision-view";

const precision = precisionSchema.parse({
  transmitted: 40,
  booked: 10,
  handedOffStrongNeed: 22,
  handedOffTechnical: 8,
  converted: 2,
  automatic: { qualifiedByGrid: 30, qualifiedShare: 0.75 },
  manual: { won: 2, lost: 1, unknown: 37, outcomeCoverage: 0.075, winRateAmongKnown: 0.6667 },
});

const criterion = {
  windowSize: 20,
  maxCorrectionRate: 0.1,
  windowsRequired: 2,
  windowRates: [0.05, 0.1],
  sufficientData: true,
  met: true,
};
const metrics = approvalMetricsSchema.parse({
  decided: 40,
  acceptedAsIs: 36,
  corrected: 3,
  rejected: 1,
  pending: 1,
  correctionRate: 0.1,
  criterion,
});

describe("PrecisionView", () => {
  it("states that no single precision figure exists, and shows each component apart", () => {
    render(<PrecisionView precision={precision} />);
    expect(screen.getByText(/aucun chiffre unique n’est affiché/)).toBeInTheDocument();
    expect(screen.getByText("Qualifiés selon la grille BANT")).toBeInTheDocument();
    expect(screen.getByText("Taux de closing des issues déclarées")).toBeInTheDocument();
  });

  it("shows the coverage next to the closing rate, so 67 % is never read alone", () => {
    render(<PrecisionView precision={precision} />);
    expect(screen.getByText("67 %")).toBeInTheDocument();
    expect(screen.getByText(/3 issues déclarées sur 40 leads transmis/)).toBeInTheDocument();
    expect(screen.getByText(/2 gagnés sur 3 issues déclarées/)).toBeInTheDocument();
    expect(screen.getByText(/37 n’ont aucune issue déclarée/)).toBeInTheDocument();
    expect(screen.getByText(/Ce n’est pas une précision/)).toBeInTheDocument();
  });

  it("shows — (not 0 %) when there is nothing to measure yet", () => {
    const empty = precisionSchema.parse({
      transmitted: 0,
      booked: 0,
      handedOffStrongNeed: 0,
      handedOffTechnical: 0,
      converted: 0,
      automatic: { qualifiedByGrid: 0, qualifiedShare: null },
      manual: { won: 0, lost: 0, unknown: 0, outcomeCoverage: null, winRateAmongKnown: null },
    });
    render(<PrecisionView precision={empty} />);
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(3);
    expect(screen.queryByText("0 %")).not.toBeInTheDocument();
    expect(screen.getByText("Aucune issue déclarée : rien à calculer.")).toBeInTheDocument();
  });

  it("flags handed-off-for-technical-reasons as not a signal of relevance", () => {
    render(<PrecisionView precision={precision} />);
    expect(screen.getByText(/pas un signal de pertinence/)).toBeInTheDocument();
  });
});

describe("ApprovalMetricsView", () => {
  it("presents the finding as informative only — nothing automated", () => {
    render(<ApprovalMetricsView metrics={metrics} />);
    expect(screen.getByText("Constat : taux de correction durablement faible")).toBeInTheDocument();
    expect(screen.getByText(/purement informatif : rien n’est automatisé/)).toBeInTheDocument();
    expect(screen.getByText(/propositions, pas encore validées/)).toBeInTheDocument();
  });

  it("says there is not enough data instead of concluding", () => {
    const thin = approvalMetricsSchema.parse({
      ...metrics,
      decided: 5,
      criterion: { ...criterion, windowRates: [], sufficientData: false, met: false },
    });
    render(<ApprovalMetricsView metrics={thin} />);
    expect(screen.getByText("Constat : pas assez de messages décidés pour conclure")).toBeInTheDocument();
    expect(screen.getByText(/Aucune fenêtre complète/)).toBeInTheDocument();
  });

  it("distinguishes 'not durably low' from 'not enough data'", () => {
    const high = approvalMetricsSchema.parse({
      ...metrics,
      correctionRate: 0.4,
      criterion: { ...criterion, windowRates: [0.4, 0.3], met: false },
    });
    render(<ApprovalMetricsView metrics={high} />);
    expect(screen.getByText("Constat : taux de correction pas (encore) durablement faible")).toBeInTheDocument();
  });

  it("shows — for the rate until a message is decided", () => {
    const none = approvalMetricsSchema.parse({
      ...metrics,
      decided: 0,
      acceptedAsIs: 0,
      corrected: 0,
      rejected: 0,
      correctionRate: null,
      criterion: { ...criterion, windowRates: [], sufficientData: false, met: false },
    });
    render(<ApprovalMetricsView metrics={none} />);
    expect(screen.getByText("Aucun message décidé pour l’instant.")).toBeInTheDocument();
  });
});
