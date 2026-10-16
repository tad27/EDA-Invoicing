import QRCode from 'qrcode';
import { InvoiceData } from '../types/invoice';
import { calculateInvoice } from './calculations';

export function getPaymentTargetUrl(invoice: InvoiceData): string {
  const qr = invoice.payment.qrPayment;
  if (!qr || !qr.accountOrUrl) return '';

  const calc = calculateInvoice(invoice);
  const total = calc.grandTotal.toFixed(2);
  const rawTotal = Math.round(calc.grandTotal);
  const currency = invoice.currency;
  const input = qr.accountOrUrl.trim();

  switch (qr.provider) {
    case 'paypal': {
      // If user provided a username or link, e.g. "ethiodesign" or "paypal.me/ethiodesign"
      const cleanHandle = input.replace(/^https?:\/\/(www\.)?paypal\.me\//i, '').replace(/^@/, '');
      return `https://paypal.me/${cleanHandle}/${total}${currency}`;
    }
    case 'stripe': {
      // If it's a Stripe payment link, append client reference / amount query if supported
      if (input.startsWith('http')) {
        const delimiter = input.includes('?') ? '&' : '?';
        return `${input}${delimiter}client_reference_id=${encodeURIComponent(invoice.invoiceNumber)}&amount=${total}`;
      }
      return `https://buy.stripe.com/${input}?client_reference_id=${encodeURIComponent(invoice.invoiceNumber)}`;
    }
    case 'telebirr': {
      // Telebirr merchant / QR payment URI
      return `telebirr://pay?receiver=${encodeURIComponent(input)}&amount=${total}&currency=${currency}&ref=${encodeURIComponent(invoice.invoiceNumber)}`;
    }
    case 'bank': {
      // EPC QR Code (European Payments Council) standard format for SEPA transfers
      const iban = qr.accountOrUrl.replace(/\s+/g, '');
      const swift = invoice.payment.swiftBic || '';
      const beneficiary = invoice.payment.accountName || invoice.agency.name;
      return [
        'BCD',
        '002',
        '1',
        'SCT',
        swift,
        beneficiary,
        iban,
        `${currency}${total}`,
        '',
        encodeURIComponent(invoice.invoiceNumber),
        `Invoice ${invoice.invoiceNumber}`,
      ].join('\n');
    }
    case 'custom_url':
    default: {
      return input
        .replace('{amount}', total)
        .replace('{currency}', currency)
        .replace('{invoice}', invoice.invoiceNumber);
    }
  }
}

export async function generatePaymentQRCode(invoice: InvoiceData): Promise<string> {
  const payload = getPaymentTargetUrl(invoice);
  if (!payload) return '';

  try {
    const dataUrl = await QRCode.toDataURL(payload, {
      width: 320,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating payment QR code:', err);
    return '';
  }
}
