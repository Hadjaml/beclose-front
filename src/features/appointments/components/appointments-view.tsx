"use client";

import { useState } from "react";
import { EmptyState } from "@/shared/ui/states";
import type { CommercialBrief } from "@/features/commercial-handoff";
import type {
  AppointmentListItem,
  SchedulingProcess,
} from "../model/appointment";
import {
  AppointmentFilters,
  type AppointmentFilter,
} from "./appointment-filters";
import { AppointmentDetailPanel } from "./appointment-detail-panel";
import { AppointmentList } from "./appointment-list";
import { AppointmentsEmptyState } from "./appointments-empty-state";

export interface AppointmentDetailData {
  appointmentId: string;
  scheduling?: SchedulingProcess;
  brief?: CommercialBrief;
}

export interface AppointmentActionCallbacks {
  onViewProspect?: () => void;
  onViewConversation?: () => void;
  onViewBrief?: () => void;
  onAcknowledge?: () => void;
  onSelectSlot?: (slotId: string) => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}

type AppointmentsViewProps =
  | { items: null }
  | {
      items: readonly AppointmentListItem[];
      details: readonly AppointmentDetailData[];
      filter: AppointmentFilter;
      onFilterChange: (filter: AppointmentFilter) => void;
      formatDateTime: (timestamp: string, timezone?: string) => string;
      formatDuration: (minutes: number) => string;
      resolveActions?: (item: AppointmentListItem) => AppointmentActionCallbacks;
    };

export function AppointmentsView(props: AppointmentsViewProps) {
  const [activeAppointmentId, setActiveAppointmentId] = useState<string>();

  if (props.items === null) {
    return <AppointmentsEmptyState />;
  }

  if (props.items.length === 0) {
    return (
      <div className="space-y-4">
        <AppointmentFilters value={props.filter} onChange={props.onFilterChange} />
        <EmptyState
          title="Aucun rendez-vous dans cette vue"
          description="Choisissez une autre vue pour retrouver les rendez-vous disponibles."
        />
      </div>
    );
  }

  const fallbackItem = props.items[0];
  if (fallbackItem === undefined) {
    return null;
  }

  const activeItem =
    props.items.find(({ appointment }) => appointment.id === activeAppointmentId) ??
    fallbackItem;
  const detail = props.details.find(({ appointmentId }) => appointmentId === activeItem.appointment.id);
  const scheduling = detail?.scheduling;
  const actions = props.resolveActions?.(activeItem) ?? {};

  return (
    <div className="space-y-4">
      <AppointmentFilters value={props.filter} onChange={props.onFilterChange} />
      <AppointmentList
        items={props.items}
        activeAppointmentId={activeItem.appointment.id}
        formatDateTime={props.formatDateTime}
        onSelect={setActiveAppointmentId}
      />
      <AppointmentDetailPanel
        item={activeItem}
        formatDateTime={props.formatDateTime}
        formatDuration={props.formatDuration}
        {...(scheduling === undefined ? {} : { scheduling })}
        {...(detail?.brief === undefined ? {} : { brief: detail.brief })}
        {...(actions.onViewProspect === undefined ? {} : { onViewProspect: actions.onViewProspect })}
        {...(actions.onViewConversation === undefined ? {} : { onViewConversation: actions.onViewConversation })}
        {...(actions.onViewBrief === undefined ? {} : { onViewBrief: actions.onViewBrief })}
        {...(actions.onAcknowledge === undefined ? {} : { onAcknowledge: actions.onAcknowledge })}
        {...(actions.onSelectSlot === undefined ? {} : { onSelectSlot: actions.onSelectSlot })}
        {...(actions.onReschedule === undefined ? {} : { onReschedule: actions.onReschedule })}
        {...(actions.onCancel === undefined ? {} : { onCancel: actions.onCancel })}
      />
    </div>
  );
}
