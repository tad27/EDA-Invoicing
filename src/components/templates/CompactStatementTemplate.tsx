import React from 'react';
import { InvoiceData, CURRENCIES } from '../../types/invoice';
import { calculateInvoice, formatReadableDate } from '../../utils/calculations';
import { EthioLogo } from '../EthioLogo';

interface TemplateProps {
  invoice: InvoiceData;
}

export const CompactStatementTemplate: React.FC<TemplateProps> = ({ invoice }) => {
  const calc = calculateInvoice(invoice);
  const currency = CURRENCIES[invoice.currency] || CURRENCIES.USD;
  const accent = invoice.customization.themeAccent || '#3D5AFE';

  const fontClass =
    invoice.customization.typographyMode === 'mono-code'
      ? 'font-mono-code'
      : invoice.customization.typographyMode === 'sans-clean'
      ? 'font-sans-clean'
      : 'font-space';

  const logoAlignClass =
    invoice.customization.logoPosition === 'center'
      ? 'justify-center text-center'
      : invoice.customization.logoPosition === 'right'
      ? 'justify-end text-right'
      : 'justify-start text-left';

  return (
    <div
      className={`relative w-full bg-white text-[#1A1A1A] p-6 md:p-8 min-h-[1050px] flex flex-col justify-between ${fontClass} selection:bg-[#3D5AFE]/10 text-xs`}
      style={{ boxSizing: 'border-box' }}
    >
      <div className="relative z-10">
        {/* Compact Header Bar */}
        <div className="bg-[#1A1A1A] text-white p-4 rounded-t-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {invoice.customization.showLogo && (
              <div className={`flex items-center ${logoAlignClass}`}>
                <EthioLogo
                  size="sm"
                  accentColor={accent}
                  showWordmark={true}
                  textColor="text-white"
                  badgeBgColor="#000000"
                />
              </div>
            )}
            <span className="text-white/40 text-[11px] hidden sm:inline">|</span>
            <span className="text-white/70 text-[11px] font-mono hidden sm:inline">
              ENGINEERING & DESIGN STATEMENT
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-white/80">
              INV: <span className="text-white font-bold">{invoice.invoiceNumber}</span>
            </span>
            {invoice.customization.showStatusBadge && (
              <span
                className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider font-mono"
                style={{
                  backgroundColor: accent,
                  color: '#FFFFFF',
                }}
              >
                {invoice.status}
              </span>
            )}
          </div>
        </div>

        {/* 4-Box Technical Metadata Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-x border-b border-[#E6E6E3] bg-[#F5F5F0] divide-x divide-y md:divide-y-0 divide-[#E6E6E3] text-[11px]">
          <div className="p-3">
            <span className="text-[#8A8785] block text-[10px] uppercase font-semibold">Issue Date</span>
            <span className="font-mono text-[#1A1A1A] font-medium">
              {invoice.issueDate}
            </span>
          </div>
          <div className="p-3">
            <span className="text-[#8A8785] block text-[10px] uppercase font-semibold">Due Date</span>
            <span className="font-mono text-[#1A1A1A] font-medium">
              {invoice.dueDate}
            </span>
          </div>
          <div className="p-3">
            <span className="text-[#8A8785] block text-[10px] uppercase font-semibold">PO Reference</span>
            <span className="font-mono text-[#1A1A1A] font-medium">
              {invoice.client.poNumber || 'N/A'}
            </span>
          </div>
          <div className="p-3">
            <span className="text-[#8A8785] block text-[10px] uppercase font-semibold">Total Amount</span>
            <span className="font-bold tabular-nums text-[#000000]" style={{ color: accent }}>
              {calc.formattedGrandTotal}
            </span>
          </div>
        </div>

        {/* Two-Column Client & Vendor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-[#E6E6E3]">
          <div className="border border-[#E6E6E3] p-3 rounded bg-white">
            <span className="text-[10px] uppercase font-bold text-[#8A8785] block mb-1">
              Provider / Agency
            </span>
            <p className="font-bold text-[#000000]">{invoice.agency.name}</p>
            <p className="text-[#8A8785] text-[11px]">{invoice.agency.address}, {invoice.agency.city}, {invoice.agency.country}</p>
            <p className="text-[#8A8785] text-[11px]">{invoice.agency.email} · {invoice.agency.phone}</p>
            {invoice.customization.showTaxId && invoice.agency.taxId && (
              <p className="text-[#8A8785] text-[10px] font-mono mt-0.5">TIN: {invoice.agency.taxId}</p>
            )}
          </div>

          <div className="border border-[#E6E6E3] p-3 rounded bg-white">
            <span className="text-[10px] uppercase font-bold text-[#8A8785] block mb-1">
              Client / Account
            </span>
            <p className="font-bold text-[#000000]">{invoice.client.company}</p>
            <p className="text-[#1A1A1A] text-[11px]">Attn: {invoice.client.name}</p>
            <p className="text-[#8A8785] text-[11px]">{invoice.client.address}, {invoice.client.city}</p>
            <p className="text-[#8A8785] text-[11px]">{invoice.client.email}</p>
            {invoice.customization.showTaxId && invoice.client.taxId && (
              <p className="text-[#8A8785] text-[10px] font-mono mt-0.5">VAT: {invoice.client.taxId}</p>
            )}
          </div>
        </div>

        {/* High-Density Statement Table */}
        <div className="mt-3">
          <table className="w-full text-left border border-[#E6E6E3] border-collapse text-xs">
            <thead>
              <tr className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider font-mono">
                <th className="p-2.5 w-12 text-center">#</th>
                <th className="p-2.5">Task Description & Deliverable Scope</th>
                <th className="p-2.5 text-right w-20">Units/Hrs</th>
                <th className="p-2.5 text-right w-24">Unit Rate</th>
                <th className="p-2.5 text-right w-28">Net ({currency.code})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E3]">
              {invoice.items.map((item, index) => {
                const itemTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                return (
                  <tr
                    key={item.id || index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F0]/60'}
                  >
                    <td className="p-2.5 text-center font-mono text-[11px] text-[#8A8785] align-top">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="p-2.5 align-top">
                      <div className="font-semibold text-black text-xs">{item.description}</div>
                      {item.scope && (
                        <div className="text-[11px] text-[#8A8785] font-mono mt-0.5">
                          {item.scope}
                        </div>
                      )}
                    </td>
                    <td className="p-2.5 text-right font-mono align-top tabular-nums font-medium text-black">
                      {item.quantity}
                    </td>
                    <td className="p-2.5 text-right font-mono align-top tabular-nums text-[#8A8785]">
                      {currency.format(item.rate)}
                    </td>
                    <td className="p-2.5 text-right font-mono align-top tabular-nums font-bold text-black">
                      {currency.format(itemTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dense Totals & Wire Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-4">
          <div className="md:col-span-7 border border-[#E6E6E3] p-3 rounded bg-[#F5F5F0]/50 space-y-2">
            {invoice.customization.showBankDetails && (
              <div>
                <span className="text-[10px] uppercase font-bold text-[#000000] block mb-1">
                  Settlement Instructions
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                  <div>
                    <span className="text-[#8A8785]">Bank:</span> {invoice.payment.bankName}
                  </div>
                  <div>
                    <span className="text-[#8A8785]">Account:</span>{' '}
                    <span className="font-mono font-bold text-black">{invoice.payment.accountNumber}</span>
                  </div>
                  {invoice.payment.swiftBic && (
                    <div>
                      <span className="text-[#8A8785]">SWIFT:</span>{' '}
                      <span className="font-mono text-black">{invoice.payment.swiftBic}</span>
                    </div>
                  )}
                  {invoice.payment.telebirrNumber && (
                    <div>
                      <span className="text-[#8A8785]">Telebirr:</span>{' '}
                      <span className="font-mono text-[#3D5AFE] font-medium">{invoice.payment.telebirrNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {invoice.customization.showNotes && invoice.payment.notes && (
              <div className="pt-2 border-t border-[#E6E6E3] text-[11px] text-[#8A8785]">
                <span className="font-semibold text-black">Note:</span> {invoice.payment.notes}
              </div>
            )}
          </div>

          <div className="md:col-span-5 border border-[#E6E6E3] p-3 rounded bg-white space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8A8785]">Items Subtotal:</span>
              <span className="font-mono font-medium tabular-nums">{calc.formattedSubtotal}</span>
            </div>
            {invoice.discountRate > 0 && (
              <div className="flex justify-between text-[11px] text-[#059669]">
                <span>Discount ({invoice.discountRate}%):</span>
                <span className="font-mono font-medium tabular-nums">-{calc.formattedDiscount}</span>
              </div>
            )}
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8A8785]">VAT/Tax ({invoice.taxRate}%):</span>
                <span className="font-mono font-medium tabular-nums">{calc.formattedTax}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#000000] flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-black">Total Due:</span>
              <span className="text-lg font-bold font-mono tabular-nums" style={{ color: accent }}>
                {calc.formattedGrandTotal}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statement Footer */}
      <div className="pt-4 mt-6 border-t border-[#E6E6E3] flex justify-between items-center text-[10px] text-[#8A8785] font-mono">
        <span>ETHIO DESIGN · ITEMIZED STATEMENT</span>
        <span>PAGE 1 OF 1</span>
      </div>
    </div>
  );
};
