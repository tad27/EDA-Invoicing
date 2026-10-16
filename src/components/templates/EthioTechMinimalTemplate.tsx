import React from 'react';
import { InvoiceData, CURRENCIES } from '../../types/invoice';
import { calculateInvoice, formatReadableDate } from '../../utils/calculations';
import { EthioLogo } from '../EthioLogo';
import { PaymentQRCodeBadge } from '../PaymentQRCodeBadge';

interface TemplateProps {
  invoice: InvoiceData;
}

export const EthioTechMinimalTemplate: React.FC<TemplateProps> = ({ invoice }) => {
  const calc = calculateInvoice(invoice);
  const currency = CURRENCIES[invoice.currency] || CURRENCIES.USD;
  const accent = invoice.customization.themeAccent || '#3D5AFE';

  // Status styling map
  const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    DRAFT: { bg: '#F5F5F0', text: '#8A8785', border: '#E6E6E3' },
    PENDING: { bg: '#EEF2FF', text: accent, border: accent },
    PAID: { bg: '#ECFDF5', text: '#059669', border: '#10B981' },
    OVERDUE: { bg: '#FEF2F2', text: '#DC2626', border: '#EF4444' },
  };
  const activeStatus = statusStyles[invoice.status] || statusStyles.PENDING;

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
      className={`relative w-full bg-white text-[#1A1A1A] p-8 md:p-12 min-h-[1050px] flex flex-col justify-between ${fontClass} selection:bg-[#3D5AFE]/10`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Subtle Pixel Matrix Watermark (Toggleable) */}
      {invoice.customization.showWatermark && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(${accent} 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
      )}

      {/* Top Header Section */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-[#E6E6E3]">
          {/* Logo & Agency Info */}
          <div className="flex-1">
            {invoice.customization.showLogo && (
              <div className={`flex items-center mb-4 ${logoAlignClass}`}>
                <EthioLogo
                  size={invoice.customization.logoSize}
                  accentColor={accent}
                  showWordmark={true}
                  textColor="text-[#000000]"
                />
              </div>
            )}
            <div className="text-xs text-[#8A8785] space-y-1">
              <p className="font-medium text-[#1A1A1A]">{invoice.agency.name}</p>
              <p>{invoice.agency.address}</p>
              <p>
                {invoice.agency.city}, {invoice.agency.country}
              </p>
              <p className="flex items-center gap-2">
                <span>{invoice.agency.email}</span>
                <span>·</span>
                <span>{invoice.agency.phone}</span>
              </p>
              {invoice.customization.showTaxId && invoice.agency.taxId && (
                <p className="tabular-nums">Tax ID: {invoice.agency.taxId}</p>
              )}
            </div>
          </div>

          {/* Invoice Meta Box */}
          <div className="flex flex-col items-start md:items-end justify-between">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold tracking-tight text-[#000000]">INVOICE</span>
              {invoice.customization.showStatusBadge && (
                <span
                  className="px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase rounded"
                  style={{
                    backgroundColor: activeStatus.bg,
                    color: activeStatus.text,
                    border: `1px solid ${activeStatus.border}`,
                  }}
                >
                  {invoice.status}
                </span>
              )}
            </div>

            <div className="text-xs space-y-1.5 text-left md:text-right">
              <div className="flex items-center md:justify-end gap-2">
                <span className="text-[#8A8785]">Invoice No:</span>
                <span className="font-semibold text-[#000000] tabular-nums">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <div className="flex items-center md:justify-end gap-2">
                <span className="text-[#8A8785]">Issue Date:</span>
                <span className="font-medium tabular-nums text-[#1A1A1A]">
                  {formatReadableDate(invoice.issueDate)}
                </span>
              </div>
              <div className="flex items-center md:justify-end gap-2">
                <span className="text-[#8A8785]">Due Date:</span>
                <span className="font-medium tabular-nums text-[#1A1A1A]">
                  {formatReadableDate(invoice.dueDate)}
                </span>
              </div>
              {invoice.client.poNumber && (
                <div className="flex items-center md:justify-end gap-2">
                  <span className="text-[#8A8785]">PO Reference:</span>
                  <span className="font-mono text-[11px] tabular-nums">
                    {invoice.client.poNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bill To & Project Context Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-7 border-b border-[#E6E6E3] text-xs">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8A8785] block mb-2">
              Billed To
            </span>
            <h4 className="text-sm font-semibold text-[#000000] mb-1">{invoice.client.company}</h4>
            <p className="text-[#1A1A1A] font-medium">{invoice.client.name}</p>
            <p className="text-[#8A8785]">{invoice.client.address}</p>
            <p className="text-[#8A8785]">
              {invoice.client.city}, {invoice.client.country}
            </p>
            <p className="text-[#8A8785] mt-1">{invoice.client.email}</p>
            {invoice.customization.showTaxId && invoice.client.taxId && (
              <p className="text-[#8A8785] mt-0.5 tabular-nums">VAT: {invoice.client.taxId}</p>
            )}
          </div>

          <div className="bg-[#F5F5F0] p-4 rounded-lg flex flex-col justify-between border border-[#E6E6E3]/60">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8A8785] block mb-1">
                Payment Terms & Scope
              </span>
              <p className="text-[#1A1A1A] text-xs leading-relaxed">
                {invoice.payment.paymentTerms || 'Payment due upon receipt.'}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#E6E6E3] flex items-center justify-between">
              <span className="text-[#8A8785] text-[11px]">Billing Currency</span>
              <span className="font-semibold text-xs text-[#000000]">{currency.name}</span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#000000] text-[11px] uppercase tracking-wider font-semibold text-[#8A8785]">
                <th className="py-3 pr-4 w-1/2">Item Description</th>
                <th className="py-3 px-3 text-right">Qty / Hrs</th>
                <th className="py-3 px-3 text-right">Rate</th>
                <th className="py-3 pl-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E3]">
              {invoice.items.map((item, index) => {
                const itemTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                return (
                  <tr key={item.id || index} className="group hover:bg-[#F5F5F0]/50 transition-colors">
                    <td className="py-4 pr-4 align-top">
                      <div className="font-medium text-xs text-[#000000] leading-snug">
                        {item.description}
                      </div>
                      {item.scope && (
                        <div className="text-[11px] text-[#8A8785] mt-1 leading-normal">
                          {item.scope}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-3 text-right align-top text-xs tabular-nums text-[#1A1A1A] font-medium">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-3 text-right align-top text-xs tabular-nums text-[#8A8785]">
                      {currency.format(item.rate)}
                    </td>
                    <td className="py-4 pl-3 text-right align-top text-xs tabular-nums font-semibold text-[#000000]">
                      {currency.format(itemTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculations / Summary Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-4 pb-8 border-t border-[#E6E6E3]">
          {/* Notes & Bank Details */}
          <div className="w-full md:w-7/12 text-xs space-y-4">
            {invoice.customization.showBankDetails && (
              <div className="bg-[#F5F5F0]/80 p-4 rounded-lg border border-[#E6E6E3] space-y-1.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-2 h-2 rounded-sm"
                    style={{ backgroundColor: accent }}
                  />
                  <span className="font-semibold text-xs text-[#000000]">Wire / Settlement Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-[#8A8785]">
                  <p>
                    <span className="text-[#1A1A1A] font-medium">Bank:</span> {invoice.payment.bankName}
                  </p>
                  <p>
                    <span className="text-[#1A1A1A] font-medium">Account Name:</span> {invoice.payment.accountName}
                  </p>
                  <p>
                    <span className="text-[#1A1A1A] font-medium">Account No:</span>{' '}
                    <span className="tabular-nums font-mono text-black">{invoice.payment.accountNumber}</span>
                  </p>
                  {invoice.payment.swiftBic && (
                    <p>
                      <span className="text-[#1A1A1A] font-medium">SWIFT:</span>{' '}
                      <span className="font-mono text-black">{invoice.payment.swiftBic}</span>
                    </p>
                  )}
                  {invoice.payment.iban && (
                    <p className="col-span-full">
                      <span className="text-[#1A1A1A] font-medium">IBAN:</span>{' '}
                      <span className="font-mono text-black">{invoice.payment.iban}</span>
                    </p>
                  )}
                  {invoice.payment.telebirrNumber && (
                    <p className="col-span-full">
                      <span className="text-[#1A1A1A] font-medium">Telebirr:</span>{' '}
                      <span className="tabular-nums font-mono text-[#3D5AFE] font-medium">
                        {invoice.payment.telebirrNumber}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {invoice.payment.qrPayment?.enabled && (
              <PaymentQRCodeBadge invoice={invoice} accentColor={accent} />
            )}

            {invoice.customization.showNotes && invoice.payment.notes && (
              <div className="text-[11px] text-[#8A8785] leading-relaxed">
                <span className="font-semibold text-[#1A1A1A] block mb-0.5">Special Instructions:</span>
                {invoice.payment.notes}
              </div>
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="w-full md:w-5/12 bg-[#F5F5F0] rounded-xl p-5 border border-[#E6E6E3] space-y-2.5">
            <div className="flex justify-between text-xs text-[#8A8785]">
              <span>Subtotal</span>
              <span className="font-medium text-[#1A1A1A] tabular-nums">
                {calc.formattedSubtotal}
              </span>
            </div>

            {invoice.discountRate > 0 && (
              <div className="flex justify-between text-xs text-[#059669]">
                <span>
                  Discount {invoice.discountType === 'percentage' ? `(${invoice.discountRate}%)` : ''}
                </span>
                <span className="font-medium tabular-nums">-{calc.formattedDiscount}</span>
              </div>
            )}

            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-xs text-[#8A8785]">
                <span>Tax / VAT ({invoice.taxRate}%)</span>
                <span className="font-medium text-[#1A1A1A] tabular-nums">
                  {calc.formattedTax}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-[#E6E6E3] flex justify-between items-baseline">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#000000] block">
                  Total Due
                </span>
                <span className="text-[10px] text-[#8A8785] font-mono">{invoice.currency}</span>
              </div>
              <span
                className="text-2xl font-bold tabular-nums tracking-tight"
                style={{ color: accent }}
              >
                {calc.formattedGrandTotal}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Signature & Ethio Brand Endnote */}
      <div className="relative z-10 pt-6 border-t border-[#E6E6E3] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8A8785] gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1A1A1A]">Ethio Design</span>
          <span>·</span>
          <span>Addis Ababa, Ethiopia</span>
          <span>·</span>
          <a
            href={`https://${invoice.agency.website}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline text-[#3D5AFE]"
          >
            {invoice.agency.website}
          </a>
        </div>
        <div className="text-right">
          <span>Official Agency Invoice & Tax Voucher</span>
        </div>
      </div>
    </div>
  );
};
