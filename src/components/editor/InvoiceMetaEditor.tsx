import React from 'react';
import { InvoiceData, InvoiceStatus, CurrencyCode, CURRENCIES } from '../../types/invoice';
import { Calendar, Hash, DollarSign, Flag } from 'lucide-react';

interface Props {
  invoice: InvoiceData;
  onChange: (updater: (prev: InvoiceData) => InvoiceData) => void;
}

export const InvoiceMetaEditor: React.FC<Props> = ({ invoice, onChange }) => {
  const statuses: InvoiceStatus[] = ['DRAFT', 'PENDING', 'PAID', 'OVERDUE'];
  const currencies: CurrencyCode[] = ['USD', 'EUR', 'ETB', 'GBP'];

  const handleFieldChange = (field: keyof InvoiceData, value: any) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-[#3D5AFE]" />
          <h3 className="text-sm font-medium text-white tracking-wide">Invoice & Metadata</h3>
        </div>
        <span className="text-[11px] font-mono text-[#8A8785] tabular-nums">
          ID: {invoice.invoiceNumber}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Invoice Number</label>
          <input
            type="text"
            value={invoice.invoiceNumber}
            onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
            className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono"
            placeholder="ETH-2026-001"
          />
        </div>

        <div>
          <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Currency</label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#000000] rounded-lg border border-white/10">
            {currencies.map((curr) => {
              const active = invoice.currency === curr;
              return (
                <button
                  key={curr}
                  type="button"
                  onClick={() => handleFieldChange('currency', curr)}
                  className={`py-1 text-xs font-medium rounded transition-colors ${
                    active
                      ? 'bg-[#3D5AFE] text-white shadow-sm'
                      : 'text-[#8A8785] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {curr}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Issue Date</label>
          <input
            type="date"
            value={invoice.issueDate}
            onChange={(e) => handleFieldChange('issueDate', e.target.value)}
            className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Due Date</label>
          <input
            type="date"
            value={invoice.dueDate}
            onChange={(e) => handleFieldChange('dueDate', e.target.value)}
            className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
          />
        </div>
      </div>

      {/* Status Badges Selector */}
      <div>
        <label className="block text-[11px] text-[#8A8785] mb-1.5 font-medium">
          Payment Status Flag
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#000000] rounded-lg border border-white/10">
          {statuses.map((s) => {
            const active = invoice.status === s;
            const statusColor =
              s === 'PAID'
                ? 'bg-emerald-600 text-white'
                : s === 'OVERDUE'
                ? 'bg-red-600 text-white'
                : s === 'PENDING'
                ? 'bg-[#3D5AFE] text-white'
                : 'bg-white/20 text-white';

            return (
              <button
                key={s}
                type="button"
                onClick={() => handleFieldChange('status', s)}
                className={`py-1.5 px-2 text-xs font-semibold rounded text-center transition-all ${
                  active
                    ? `${statusColor} shadow`
                    : 'text-[#8A8785] hover:text-white hover:bg-white/5'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
