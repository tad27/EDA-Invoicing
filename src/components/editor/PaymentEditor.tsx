import React from 'react';
import { InvoiceData } from '../../types/invoice';
import { CreditCard, Landmark, Smartphone, MessageSquare } from 'lucide-react';

interface Props {
  invoice: InvoiceData;
  onChange: (updater: (prev: InvoiceData) => InvoiceData) => void;
}

export const PaymentEditor: React.FC<Props> = ({ invoice, onChange }) => {
  const updatePayment = (key: keyof InvoiceData['payment'], value: string) => {
    onChange((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [key]: value,
      },
    }));
  };

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-[#3D5AFE]" />
          <h3 className="text-sm font-medium text-white tracking-wide">
            Settlement & Payment Details
          </h3>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Bank Name</label>
            <input
              type="text"
              value={invoice.payment.bankName}
              onChange={(e) => updatePayment('bankName', e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
              placeholder="Commercial Bank of Ethiopia (CBE)"
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Beneficiary / Account Name</label>
            <input
              type="text"
              value={invoice.payment.accountName}
              onChange={(e) => updatePayment('accountName', e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
              placeholder="Ethio Design PLC"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Account Number</label>
            <input
              type="text"
              value={invoice.payment.accountNumber}
              onChange={(e) => updatePayment('accountNumber', e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono"
              placeholder="1000-2849-5829-109"
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">SWIFT / BIC (Optional)</label>
            <input
              type="text"
              value={invoice.payment.swiftBic || ''}
              onChange={(e) => updatePayment('swiftBic', e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono"
              placeholder="CBETETAA"
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Telebirr / Mobile Money</label>
            <input
              type="text"
              value={invoice.payment.telebirrNumber || ''}
              onChange={(e) => updatePayment('telebirrNumber', e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono"
              placeholder="+251 91 123 4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Payment Terms Clause</label>
          <input
            type="text"
            value={invoice.payment.paymentTerms}
            onChange={(e) => updatePayment('paymentTerms', e.target.value)}
            className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
            placeholder="Payment due within 30 days of issue date."
          />
        </div>

        <div>
          <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Special Notes / Thank You</label>
          <textarea
            rows={2}
            value={invoice.payment.notes}
            onChange={(e) => updatePayment('notes', e.target.value)}
            className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors resize-none"
            placeholder="Thank you for choosing Ethio Design."
          />
        </div>
      </div>
    </div>
  );
};
