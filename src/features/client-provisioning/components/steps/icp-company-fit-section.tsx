"use client";

import { icpFieldHints, type IcpCriteriaFormValue } from "@/features/client-configuration";
import { CheckboxField, NumericRangeField, SectionErrorsNote, TextField, type FieldErrors } from "@/shared/ui/forms";

type CompanyFitValue = IcpCriteriaFormValue["companyFit"];

export function IcpCompanyFitSection({
  value,
  onChange,
  errors,
}: {
  value: CompanyFitValue;
  onChange: (next: CompanyFitValue) => void;
  errors: FieldErrors;
}) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-base font-semibold text-text-primary">Adéquation entreprise</legend>
      <SectionErrorsNote errors={errors} prefix="companyFit" />

      <NumericRangeField
        id="icp-employee-range"
        label="Effectif"
        unit="salariés"
        showRejectBounds
        value={value.employeeRange}
        onChange={(next) =>
          onChange({
            ...value,
            employeeRange: {
              ...value.employeeRange,
              ...next,
              min: next.min ?? 0,
              max: next.max ?? 0,
            },
          })
        }
        hint={icpFieldHints.employeeRange.min}
      />
      <CheckboxField
        id="icp-employee-range-hard-filter"
        label="Filtre strict sur l'effectif (non appliqué aujourd'hui)"
        checked={value.employeeRange.hardFilter}
        onChange={(checked) => onChange({ ...value, employeeRange: { ...value.employeeRange, hardFilter: checked } })}
        hint={icpFieldHints.employeeRange.hardFilter}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="icp-annual-revenue"
          label="CA annuel minimum préféré (€)"
          type="text"
          value={String(value.annualRevenue.preferredMinEur)}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange({
              ...value,
              annualRevenue: { ...value.annualRevenue, preferredMinEur: Number.isFinite(parsed) ? parsed : 0 },
            });
          }}
          hint={icpFieldHints.annualRevenue.preferredMinEur}
        />
        <div className="flex items-end pb-2.5">
          <CheckboxField
            id="icp-annual-revenue-hard-filter"
            label="Filtre strict sur le CA (non appliqué aujourd'hui)"
            checked={value.annualRevenue.hardFilter}
            onChange={(checked) => onChange({ ...value, annualRevenue: { ...value.annualRevenue, hardFilter: checked } })}
            hint={icpFieldHints.annualRevenue.hardFilter}
          />
        </div>
        <TextField
          id="icp-average-customer-value"
          label="Valeur client moyenne visée (€)"
          type="text"
          value={String(value.averageCustomerValue.preferredMinEur)}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange({
              ...value,
              averageCustomerValue: {
                ...value.averageCustomerValue,
                preferredMinEur: Number.isFinite(parsed) ? parsed : 0,
              },
            });
          }}
          hint={icpFieldHints.averageCustomerValue.preferredMinEur}
        />
        <div className="flex items-end pb-2.5">
          <CheckboxField
            id="icp-average-customer-value-hard-filter"
            label="Filtre strict sur la valeur client (non appliqué aujourd'hui)"
            checked={value.averageCustomerValue.hardFilter}
            onChange={(checked) =>
              onChange({ ...value, averageCustomerValue: { ...value.averageCustomerValue, hardFilter: checked } })
            }
            hint={icpFieldHints.averageCustomerValue.hardFilter}
          />
        </div>
      </div>
      <TextField
        id="icp-average-customer-value-reason"
        label="Raison de ce seuil"
        value={value.averageCustomerValue.reason ?? ""}
        onChange={(event) =>
          onChange({
            ...value,
            averageCustomerValue: {
              ...value.averageCustomerValue,
              reason: event.target.value.trim() === "" ? null : event.target.value,
            },
          })
        }
        hint={icpFieldHints.averageCustomerValue.reason}
        optional
      />

      <div className="space-y-3">
        <CheckboxField
          id="icp-validated-offer-required"
          label="Offre commerciale validée requise"
          checked={value.validatedOfferRequired}
          onChange={(checked) => onChange({ ...value, validatedOfferRequired: checked })}
          hint={icpFieldHints.companyFit.validatedOfferRequired}
        />
        <CheckboxField
          id="icp-existing-customers-required"
          label="Clients existants requis"
          checked={value.existingCustomersRequired}
          onChange={(checked) => onChange({ ...value, existingCustomersRequired: checked })}
          hint={icpFieldHints.companyFit.existingCustomersRequired}
        />
        <CheckboxField
          id="icp-human-closing-capacity-required"
          label="Capacité de closing humaine requise"
          checked={value.humanClosingCapacityRequired}
          onChange={(checked) => onChange({ ...value, humanClosingCapacityRequired: checked })}
          hint={icpFieldHints.companyFit.humanClosingCapacityRequired}
        />
      </div>
    </fieldset>
  );
}
