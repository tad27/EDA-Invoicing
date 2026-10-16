import { InvoiceData, CURRENCIES } from '../types/invoice';

export interface InvoiceCalculations {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  grandTotal: number;
  formattedSubtotal: string;
  formattedDiscount: string;
  formattedTax: string;
  formattedGrandTotal: string;
}

export function calculateInvoice(invoice: InvoiceData): InvoiceCalculations {
  const currencyConfig = CURRENCIES[invoice.currency] || CURRENCIES.USD;

  // Calculate items subtotal
  const subtotal = invoice.items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

  // Discount
  let discountAmount = 0;
  if (invoice.discountType === 'fixed') {
    discountAmount = Math.min(invoice.discountRate, subtotal);
  } else {
    discountAmount = (subtotal * (invoice.discountRate || 0)) / 100;
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // Tax
  const taxAmount = (taxableAmount * (invoice.taxRate || 0)) / 100;

  // Grand Total
  const grandTotal = taxableAmount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    grandTotal,
    formattedSubtotal: currencyConfig.format(subtotal),
    formattedDiscount: currencyConfig.format(discountAmount),
    formattedTax: currencyConfig.format(taxAmount),
    formattedGrandTotal: currencyConfig.format(grandTotal),
  };
}

export function formatReadableDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function generateInvoiceSummaryText(invoice: InvoiceData): string {
  const calc = calculateInvoice(invoice);
  const currency = CURRENCIES[invoice.currency];

  const lines = [
    `========================================`,
    `ETHIO DESIGN — INVOICE ${invoice.invoiceNumber}`,
    `========================================`,
    `Status:      ${invoice.status}`,
    `Issue Date:  ${invoice.issueDate}`,
    `Due Date:    ${invoice.dueDate}`,
    `Client:      ${invoice.client.company} (${invoice.client.name})`,
    `Currency:    ${invoice.currency} (${currency.symbol})`,
    ``,
    `LINE ITEMS:`,
    ...invoice.items.map(
      (item, idx) =>
        `${idx + 1}. ${item.description} — ${item.quantity} hrs/qty @ ${currency.format(
          item.rate
        )} = ${currency.format(item.quantity * item.rate)}`
    ),
    ``,
    `----------------------------------------`,
    `Subtotal:    ${calc.formattedSubtotal}`,
    invoice.discountRate > 0 ? `Discount:   -${calc.formattedDiscount} (${invoice.discountRate}%)` : null,
    `Tax/VAT:     ${calc.formattedTax} (${invoice.taxRate}%)`,
    `GRAND TOTAL: ${calc.formattedGrandTotal}`,
    `----------------------------------------`,
    `Payment to:  ${invoice.payment.bankName}`,
    `Account:     ${invoice.payment.accountName} (${invoice.payment.accountNumber})`,
    invoice.payment.swiftBic ? `SWIFT/BIC:   ${invoice.payment.swiftBic}` : null,
    invoice.payment.telebirrNumber ? `Telebirr:    ${invoice.payment.telebirrNumber}` : null,
    `========================================`,
  ].filter(Boolean);

  return lines.join('\n');
}
