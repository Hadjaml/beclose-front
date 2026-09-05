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
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">Factures de l’abonnement</caption>
        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600">
          <tr>
            <th scope="col" className="px-4 py-3">Facture</th>
            <th scope="col" className="px-4 py-3">Montant</th>
            <th scope="col" className="px-4 py-3">Statut</th>
            <th scope="col" className="px-4 py-3"><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-4 py-4 font-medium text-zinc-950">{invoice.number ?? invoice.id}</td>
              <td className="px-4 py-4 text-zinc-700">
                {invoice.amount.formattedAmount ?? `${invoice.amount.amount} ${invoice.amount.currency}`}
              </td>
              <td className="px-4 py-4 text-zinc-700">{invoiceStatusLabels[invoice.status]}</td>
              <td className="px-4 py-4 text-right">{renderAction?.(invoice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
