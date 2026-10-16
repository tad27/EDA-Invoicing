import React, { useState, useEffect } from 'react';
import { InvoiceData } from '../types/invoice';
import { calculateInvoice } from '../utils/calculations';
import { generatePaymentQRCode } from '../utils/qrGenerator';
import { QrCode } from 'lucide-react';

interface Props {
  invoice: InvoiceData;
  compact?: boolean;
  accentColor?: string;
}

export const PaymentQRCodeBadge: React.FC<Props> = ({
  invoice,
  compact = false,
  accentColor = '#3D5AFE',
}) => {
  const [qrSrc, setQrSrc] = useState<string>('');
  const qrConfig = invoice.payment.qrPayment;

  const calc = calculateInvoice(invoice);

  useEffect(() => {
    let isMounted = true;
    if (qrConfig?.enabled && qrConfig?.accountOrUrl) {
      generatePaymentQRCode(invoice).then((url) => {
        if (isMounted) setQrSrc(url);
      });
    } else {
      setQrSrc('');
    }
    return () => {
      isMounted = false;
    };
  }, [
    qrConfig?.enabled,
    qrConfig?.provider,
    qrConfig?.accountOrUrl,
    calc.grandTotal,
    invoice.currency,
    invoice.invoiceNumber,
  ]);

  if (!qrConfig?.enabled || !qrSrc) {
    return null;
  }

  const providerNames: Record<string, string> = {
    stripe: 'Stripe Instant Checkout',
    paypal: 'PayPal Business Pay',
    telebirr: 'Telebirr Mobile Payment',
    bank: 'SEPA / Banking EPC QR',
    custom_url: 'Instant Online Pay',
  };

  const providerLabel = providerNames[qrConfig.provider] || 'Instant Checkout';

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 bg-[#F5F5F0] border border-[#E6E6E3] rounded-lg">
        <div className="p-1 bg-white rounded border border-[#E6E6E3] shrink-0">
          <img src={qrSrc} alt="Payment QR" className="w-14 h-14 object-contain" />
        </div>
        <div className="text-[10px] space-y-0.5">
          <span className="font-bold text-[#000000] block uppercase tracking-wider">
            Scan To Settle
          </span>
          <p className="font-semibold" style={{ color: accentColor }}>
            {calc.formattedGrandTotal}
          </p>
          <span className="text-[#8A8785] block">{providerLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-[#F5F5F0] border border-[#E6E6E3] rounded-xl flex items-center gap-4">
      <div className="p-1.5 bg-white rounded-lg border border-[#E6E6E3] shadow-xs shrink-0">
        <img src={qrSrc} alt="Scan To Pay" className="w-20 h-20 object-contain" />
      </div>
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#000000]">
            Scan to Pay Online
          </span>
        </div>
        <p className="text-sm font-bold tabular-nums" style={{ color: accentColor }}>
          {calc.formattedGrandTotal}
        </p>
        <p className="text-[11px] text-[#8A8785] leading-snug">
          {qrConfig.note || `Point your phone camera to settle invoice via ${providerLabel}.`}
        </p>
      </div>
    </div>
  );
};
