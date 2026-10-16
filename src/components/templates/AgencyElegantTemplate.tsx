import React from 'react';
import { InvoiceData, CURRENCIES } from '../../types/invoice';
import { calculateInvoice, formatReadableDate } from '../../utils/calculations';
import { EthioLogo } from '../EthioLogo';
import { PaymentQRCodeBadge } from '../PaymentQRCodeBadge';

interface TemplateProps {
  invoice: InvoiceData;
}

export const AgencyElegantTemplate: React.FC<TemplateProps> = ({ invoice }) => {
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
      className={`relative w-full bg-white text-[#1A1A1A] p-10 md:p-16 min-h-[1050px] flex flex-col justify-between ${fontClass} selection:bg-[#3D5AFE]/10`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Background Watermark if enabled */}
      {invoice.customization.showWatermark && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-12 border-b border-[#E6E6E3]">
          <div>
            {invoice.customization.showLogo && (
              <div className={`mb-4 flex items-center ${logoAlignClass}`}>
                <EthioLogo
                  size={invoice.customization.logoSize}
                  accentColor={accent}
                  showWordmark={true}
                  textColor="text-[#000000]"
                />
              </div>
            )}
            <p className="text-xs text-[#8A8785] tracking-widest uppercase font-medium">
              Studio & Creative Direction
            </p>
          </div>

          <div className="text-left md:text-right">
            <h1 className="text-3xl font-light tracking-tight text-[#000000] mb-2">
              Invoice #{invoice.invoiceNumber}
            </h1>
            <div className="flex items-center md:justify-end gap-3 text-xs text-[#8A8785]">
              <span>Issued {formatReadableDate(invoice.issueDate)}</span>
              <span>·</span>
              <span>Due {formatReadableDate(invoice.dueDate)}</span>
              {invoice.customization.showStatusBadge && (
                <>
                  <span>·</span>
                  <span className="font-medium text-[#000000] uppercase tracking-wider">
                    {invoice.status}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Addresses / Context Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-10 border-b border-[#E6E6E3] text-xs">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#8A8785] mb-2 font-medium">
              Issued By
            </p>
            <p className="font-medium text-[#000000]">{invoice.agency.name}</p>
            <p className="text-[#8A8785] mt-1">{invoice.agency.address}</p>
            <p className="text-[#8A8785]">
              {invoice.agency.city}, {invoice.agency.country}
            </p>
            <p className="text-[#8A8785] mt-2">{invoice.agency.email}</p>
            {invoice.customization.showTaxId && invoice.agency.taxId && (
              <p className="text-[#8A8785] mt-0.5 tabular-nums">Tax ID: {invoice.agency.taxId}</p>
            )}
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#8A8785] mb-2 font-medium">
              Client
            </p>
            <p className="font-medium text-[#000000]">{invoice.client.company}</p>
            <p className="text-[#1A1A1A]">{invoice.client.name}</p>
            <p className="text-[#8A8785] mt-1">{invoice.client.address}</p>
            <p className="text-[#8A8785]">
              {invoice.client.city}, {invoice.client.country}
            </p>
            <p className="text-[#8A8785] mt-2">{invoice.client.email}</p>
            {invoice.customization.showTaxId && invoice.client.taxId && (
              <p className="text-[#8A8785] mt-0.5 tabular-nums">VAT: {invoice.client.taxId}</p>
            )}
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#8A8785] mb-2 font-medium">
              Payment Terms
            </p>
            <p className="text-[#1A1A1A] leading-relaxed">
              {invoice.payment.paymentTerms || 'Net 30 days.'}
            </p>
            {invoice.client.poNumber && (
              <p className="mt-3 text-[#8A8785]">
                Reference:{' '}
                <span className="font-mono text-black font-medium">{invoice.client.poNumber}</span>
              </p>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="py-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6E6E3] text-[11px] uppercase tracking-widest text-[#8A8785]">
                <th className="py-4 pr-6 font-normal">Deliverable</th>
                <th className="py-4 px-4 text-right font-normal">Quantity</th>
                <th className="py-4 px-4 text-right font-normal">Rate</th>
                <th className="py-4 pl-6 text-right font-normal">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E3]/60">
              {invoice.items.map((item, index) => {
                const itemTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                return (
                  <tr key={item.id || index} className="group">
                    <td className="py-5 pr-6 align-top">
                      <div className="text-sm font-normal text-[#000000]">
                        {item.description}
                      </div>
                      {item.scope && (
                        <div className="text-xs text-[#8A8785] mt-1 font-light leading-relaxed">
                          {item.scope}
                        </div>
                      )}
                    </td>
                    <td className="py-5 px-4 text-right align-top text-xs tabular-nums text-[#8A8785]">
                      {item.quantity}
                    </td>
                    <td className="py-5 px-4 text-right align-top text-xs tabular-nums text-[#8A8785]">
                      {currency.format(item.rate)}
                    </td>
                    <td className="py-5 pl-6 text-right align-top text-sm tabular-nums font-medium text-[#000000]">
                      {currency.format(itemTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals & Wire in Airy Two-Column Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-[#E6E6E3]">
          {/* Wire details */}
          <div className="text-xs text-[#8A8785] space-y-4">
            {invoice.customization.showBankDetails && (
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#8A8785] mb-2 font-medium">
                  Direct Bank Remittance
                </p>
                <div className="space-y-1 text-xs">
                  <p>
                    <span className="text-[#1A1A1A]">Beneficiary:</span> {invoice.payment.accountName}
                  </p>
                  <p>
                    <span className="text-[#1A1A1A]">Bank:</span> {invoice.payment.bankName}
                  </p>
                  <p>
                    <span className="text-[#1A1A1A]">Account No:</span>{' '}
                    <span className="font-mono text-black">{invoice.payment.accountNumber}</span>
                  </p>
                  {invoice.payment.swiftBic && (
                    <p>
                      <span className="text-[#1A1A1A]">SWIFT / BIC:</span>{' '}
                      <span className="font-mono text-black">{invoice.payment.swiftBic}</span>
                    </p>
                  )}
                  {invoice.payment.telebirrNumber && (
                    <p>
                      <span className="text-[#1A1A1A]">Telebirr:</span>{' '}
                      <span className="font-mono text-[#3D5AFE]">{invoice.payment.telebirrNumber}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {invoice.payment.qrPayment?.enabled && (
              <div className="pt-2">
                <PaymentQRCodeBadge invoice={invoice} accentColor={accent} />
              </div>
            )}

            {invoice.customization.showNotes && invoice.payment.notes && (
              <p className="text-xs italic text-[#8A8785] leading-relaxed pt-2">
                "{invoice.payment.notes}"
              </p>
            )}
          </div>

          {/* Calculations */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-[#8A8785]">
              <span>Subtotal</span>
              <span className="tabular-nums text-[#1A1A1A]">{calc.formattedSubtotal}</span>
            </div>

            {invoice.discountRate > 0 && (
              <div className="flex justify-between text-xs text-[#059669]">
                <span>Discount ({invoice.discountRate}%)</span>
                <span className="tabular-nums">-{calc.formattedDiscount}</span>
              </div>
            )}

            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-xs text-[#8A8785]">
                <span>VAT / Tax ({invoice.taxRate}%)</span>
                <span className="tabular-nums text-[#1A1A1A]">{calc.formattedTax}</span>
              </div>
            )}

            <div className="pt-4 border-t border-[#000000] flex justify-between items-baseline">
              <span className="text-sm font-light uppercase tracking-wider text-[#000000]">
                Total Payable
              </span>
              <span className="text-3xl font-light tabular-nums tracking-tight text-[#000000]">
                {calc.formattedGrandTotal}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Studio Footer */}
      <div className="relative z-10 pt-10 mt-12 border-t border-[#E6E6E3] flex justify-between items-center text-[11px] text-[#8A8785]">
        <span>Ethio Design Studio · Addis Ababa</span>
        <span className="tabular-nums font-mono text-[10px]">
          REF: {invoice.invoiceNumber}
        </span>
      </div>
    </div>
  );
};
