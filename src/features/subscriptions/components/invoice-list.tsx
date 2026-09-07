import {
  invoiceStatusLabels,
  type Invoice,
} from "../model/subscription";

export function InvoiceList({
  invoices,
  renderAction,
}: {
  invoices: readonly Invoice[];
  renderAction?: (invoice: Invoice) => React.ReactNode;
}) {
  if (invoices.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-app-lg border border-border">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">Factures de l’abonnement</caption>
        <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-text-secondary">
          <tr>
            <th scope="col" className="px-4 py-3">Facture</th>
            <th scope="col" className="px-4 py-3">Montant</th>
            <th scope="col" className="px-4 py-3">Statut</th>
            <th scope="col" className="px-4 py-3"><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-4 py-4 font-medium text-text-primary">{invoice.number ?? invoice.id}</td>
              <td className="px-4 py-4 text-text-secondary">
                {invoice.amount.formattedAmount ?? `${invoice.amount.amount} ${invoice.amount.currency}`}
              </td>
              <td className="px-4 py-4 text-text-secondary">{invoiceStatusLabels[invoice.status]}</td>
              <td className="px-4 py-4 text-right">{renderAction?.(invoice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
