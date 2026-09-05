"use client";

import { useState } from "react";
import type { Prospect, ProspectStatus } from "../model/prospecting";
import { BatchActionBar } from "./batch-action-bar";
import { ProspectDetailPanel } from "./prospect-detail-panel";
import { ProspectTable } from "./prospect-table";
import { ProspectingEmptyState } from "./prospecting-empty-state";
import { ProspectingToolbar } from "./prospecting-toolbar";

export interface ProspectingVisibility {
  showReviewSelection: boolean;
  showScore: boolean;
  showRecommendation: boolean;
  showRecommendedChannel: boolean;
  showScoringAnalysis: boolean;
  showContactStrategy: boolean;
  showHistory: boolean;
}

export const backofficeProspectingVisibility: ProspectingVisibility = {
  showReviewSelection: true,
  showScore: true,
  showRecommendation: true,
  showRecommendedChannel: true,
  showScoringAnalysis: true,
  showContactStrategy: true,
  showHistory: true,
};

export const portalProspectingVisibility: ProspectingVisibility = {
  showReviewSelection: false,
  showScore: false,
  showRecommendation: false,
  showRecommendedChannel: true,
  showScoringAnalysis: false,
  showContactStrategy: true,
  showHistory: true,
};

type ProspectingViewProps = {
  visibility?: ProspectingVisibility;
} & (
  | { prospects: null }
  | {
      prospects: readonly Prospect[];
      searchValue: string;
      status: ProspectStatus | "";
      onSearchChange: (value: string) => void;
      onStatusChange: (status: ProspectStatus | "") => void;
      onBatchValidate?: (ids: ReadonlySet<string>) => void;
      onBatchVerify?: (ids: ReadonlySet<string>) => void;
      onBatchExclude?: (ids: ReadonlySet<string>) => void;
    }
);

export function ProspectingView(props: ProspectingViewProps) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [activeProspect, setActiveProspect] = useState<Prospect | null>(null);

  if (props.prospects === null || props.prospects.length === 0) {
    return <ProspectingEmptyState />;
  }

  const visibility = props.visibility ?? backofficeProspectingVisibility;
  const onBatchValidate = props.onBatchValidate;
  const onBatchVerify = props.onBatchVerify;
  const onBatchExclude = props.onBatchExclude;
  const canReview =
    visibility.showReviewSelection &&
    onBatchValidate !== undefined &&
    onBatchVerify !== undefined &&
    onBatchExclude !== undefined;

  return (
    <div className="space-y-4">
      <ProspectingToolbar
        searchValue={props.searchValue}
        status={props.status}
        onSearchChange={props.onSearchChange}
        onStatusChange={props.onStatusChange}
      />
      {canReview ? <BatchActionBar
        selectionCount={selectedIds.size}
        onValidate={() => onBatchValidate(selectedIds)}
        onVerify={() => onBatchVerify(selectedIds)}
        onExclude={() => onBatchExclude(selectedIds)}
      /> : null}
      <div className={activeProspect === null ? "block" : "grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.75fr)]"}>
        <ProspectTable
          prospects={props.prospects}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onOpenProspect={setActiveProspect}
          showSelection={canReview}
          showScore={visibility.showScore}
          showRecommendation={visibility.showRecommendation}
          showRecommendedChannel={visibility.showRecommendedChannel}
        />
        <ProspectDetailPanel
          prospect={activeProspect}
          onClose={() => setActiveProspect(null)}
          showScoringAnalysis={visibility.showScoringAnalysis}
          showContactStrategy={visibility.showContactStrategy}
          showHistory={visibility.showHistory}
        />
      </div>
    </div>
  );
}
