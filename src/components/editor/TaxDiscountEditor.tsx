import React from 'react';
import { InvoiceData } from '../../types/invoice';
import { calculateInvoice } from '../../utils/calculations';
import { Percent, Receipt, Tag } from 'lucide-react';

interface Props {
  invoice: InvoiceData;
  onChange: (updater: (prev: InvoiceData) => InvoiceData) => void;
}

export const TaxDiscountEditor: React.FC<Props> = ({ invoice, onChange }) => {
  const calc = calculateInvoice(invoice);

  const handleTaxChange = (rate: number) => {
    onChange((prev) => ({
      ...prev,
      taxRate: rate,
    }));
  };

  const handleDiscountChange = (rate: number) => {
    onChange((prev) => ({
      ...prev,
      discountRate: rate,
    }));
  };

  const setDiscountType = (type: 'percentage' | 'fixed') => {
    onChange((prev) => ({
      ...prev,
      discountType: type,
    }));
  };

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-[#3D5AFE]" />
          <h3 className="text-sm font-medium text-white tracking-wide">Taxes & Adjustments</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tax Rate % */}
        <div className="space-y-2">
          <label className="block text-[11px] text-[#8A8785] font-medium">Tax / VAT Rate (%)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={invoice.taxRate}
              onChange={(e) => handleTaxChange(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono tabular-nums"
            />
            <span className="text-xs text-[#8A8785] font-mono">%</span>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1">
            {[0, 8.5, 15, 20].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleTaxChange(rate)}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  invoice.taxRate === rate
                    ? 'bg-[#3D5AFE] border-[#3D5AFE] text-white font-medium'
                    : 'bg-[#000000] border-white/10 text-[#8A8785] hover:text-white'
                }`}
              >
                {rate === 0 ? '0% Ex.' : rate === 15 ? '15% ET' : `${rate}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Discount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] text-[#8A8785] font-medium">Discount</label>
            <div className="flex items-center gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => setDiscountType('percentage')}
                className={`px-1.5 py-0.5 rounded ${
                  invoice.discountType === 'percentage'
                    ? 'bg-[#3D5AFE] text-white'
                    : 'text-[#8A8785] hover:text-white'
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                className={`px-1.5 py-0.5 rounded ${
                  invoice.discountType === 'fixed'
                    ? 'bg-[#3D5AFE] text-white'
                    : 'text-[#8A8785] hover:text-white'
                }`}
              >
                Fixed
              </button>
            </div>
          </div>

          <input
            type="number"
            min="0"
            step={invoice.discountType === 'percentage' ? '1' : '50'}
            value={invoice.discountRate}
            onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono tabular-nums"
          />

          <div className="flex flex-wrap gap-1">
            {[0, 5, 10, 15].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleDiscountChange(d)}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  invoice.discountRate === d
                    ? 'bg-[#3D5AFE] border-[#3D5AFE] text-white font-medium'
                    : 'bg-[#000000] border-white/10 text-[#8A8785] hover:text-white'
                }`}
              >
                {d === 0 ? 'None' : `${d}%`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary preview strip */}
      <div className="p-3 bg-[#000000] rounded-xl border border-white/10 space-y-1 text-xs">
        <div className="flex justify-between text-[#8A8785]">
          <span>Calculated Subtotal</span>
          <span className="font-mono tabular-nums text-white">{calc.formattedSubtotal}</span>
        </div>
        {invoice.discountRate > 0 && (
          <div className="flex justify-between text-[#059669]">
            <span>Applied Discount</span>
            <span className="font-mono tabular-nums">-{calc.formattedDiscount}</span>
          </div>
        )}
        {invoice.taxRate > 0 && (
          <div className="flex justify-between text-[#8A8785]">
            <span>Calculated Tax</span>
            <span className="font-mono tabular-nums text-white">{calc.formattedTax}</span>
          </div>
        )}
        <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white text-sm">
          <span>Grand Total</span>
          <span className="font-mono tabular-nums text-[#3D5AFE]">{calc.formattedGrandTotal}</span>
        </div>
      </div>
    </div>
  );
};
