"use client";

import { useState } from "react";
import type { Prospect, ProspectStatus } from "../model/prospecting";
import { BatchActionBar } from "./batch-action-bar";
import { ProspectDetailPanel } from "./prospect-detail-panel";
import { ProspectTable } from "./prospect-table";
import { ProspectingEmptyState } from "./prospecting-empty-state";
import { ProspectingToolbar } from "./prospecting-toolbar";

type ProspectingViewProps =
  | { prospects: null }
  | {
      prospects: readonly Prospect[];
      searchValue: string;
      status: ProspectStatus | "";
      onSearchChange: (value: string) => void;
      onStatusChange: (status: ProspectStatus | "") => void;
      onBatchValidate: (ids: ReadonlySet<string>) => void;
      onBatchVerify: (ids: ReadonlySet<string>) => void;
      onBatchExclude: (ids: ReadonlySet<string>) => void;
    };

export function ProspectingView(props: ProspectingViewProps) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [activeProspect, setActiveProspect] = useState<Prospect | null>(null);

  if (props.prospects === null || props.prospects.length === 0) {
    return <ProspectingEmptyState />;
  }

  return (
    <div className="space-y-4">
      <ProspectingToolbar
        searchValue={props.searchValue}
        status={props.status}
        onSearchChange={props.onSearchChange}
        onStatusChange={props.onStatusChange}
      />
      <BatchActionBar
        selectionCount={selectedIds.size}
        onValidate={() => props.onBatchValidate(selectedIds)}
        onVerify={() => props.onBatchVerify(selectedIds)}
        onExclude={() => props.onBatchExclude(selectedIds)}
      />
      <div className={activeProspect === null ? "block" : "grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.75fr)]"}>
        <ProspectTable
          prospects={props.prospects}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onOpenProspect={setActiveProspect}
        />
        <ProspectDetailPanel prospect={activeProspect} onClose={() => setActiveProspect(null)} />
      </div>
    </div>
  );
}
