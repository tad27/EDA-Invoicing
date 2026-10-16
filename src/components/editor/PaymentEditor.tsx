import React, { useState, useEffect } from 'react';
import { InvoiceData, QRPaymentProvider } from '../../types/invoice';
import { calculateInvoice } from '../../utils/calculations';
import { generatePaymentQRCode, getPaymentTargetUrl } from '../../utils/qrGenerator';
import { Landmark, QrCode, Copy, Check, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  invoice: InvoiceData;
  onChange: (updater: (prev: InvoiceData) => InvoiceData) => void;
}

export const PaymentEditor: React.FC<Props> = ({ invoice, onChange }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const qrConfig = invoice.payment.qrPayment || {
    enabled: false,
    provider: 'stripe',
    accountOrUrl: '',
    note: '',
  };

  const calc = calculateInvoice(invoice);
  const targetUrl = getPaymentTargetUrl(invoice);

  // Generate QR code whenever payment config, invoice total, or currency changes
  useEffect(() => {
    let isMounted = true;
    if (qrConfig.enabled && qrConfig.accountOrUrl) {
      generatePaymentQRCode(invoice).then((url) => {
        if (isMounted) setQrDataUrl(url);
      });
    } else {
      setQrDataUrl('');
    }
    return () => {
      isMounted = false;
    };
  }, [
    qrConfig.enabled,
    qrConfig.provider,
    qrConfig.accountOrUrl,
    calc.grandTotal,
    invoice.currency,
    invoice.invoiceNumber,
  ]);

  const updatePayment = (key: keyof InvoiceData['payment'], value: any) => {
    onChange((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [key]: value,
      },
    }));
  };

  const updateQrConfig = (key: keyof typeof qrConfig, value: any) => {
    onChange((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        qrPayment: {
          ...(prev.payment.qrPayment || {
            enabled: true,
            provider: 'stripe',
            accountOrUrl: '',
            note: '',
          }),
          [key]: value,
        },
      },
    }));
  };

  const handleCopyUrl = () => {
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const providers: Array<{ id: QRPaymentProvider; name: string; placeholder: string; hint: string }> = [
    {
      id: 'stripe',
      name: 'Stripe Link',
      placeholder: 'https://buy.stripe.com/your_link_id',
      hint: 'Appends client reference & exact invoice total automatically',
    },
    {
      id: 'paypal',
      name: 'PayPal.me',
      placeholder: 'yourcompany (or https://paypal.me/yourcompany)',
      hint: `Auto-generates https://paypal.me/{handle}/${calc.grandTotal.toFixed(2)}${invoice.currency}`,
    },
    {
      id: 'telebirr',
      name: 'Telebirr (ETB)',
      placeholder: '+251 91 123 4567 or Merchant Code',
      hint: 'Generates Telebirr instant transfer payload for Ethiopian mobile wallet',
    },
    {
      id: 'bank',
      name: 'Bank / EPC SEPA',
      placeholder: 'IBAN number (e.g. ET21CBET0000100028495829)',
      hint: 'Standard European Payments Council QR format for mobile banking apps',
    },
    {
      id: 'custom_url',
      name: 'Custom URL',
      placeholder: 'https://pay.example.com?amount={amount}&cur={currency}',
      hint: 'Supports {amount}, {currency}, {invoice} dynamic placeholders',
    },
  ];

  const activeProviderMeta = providers.find((p) => p.id === qrConfig.provider) || providers[0];

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-xl border border-white/10 space-y-6">
      {/* 1. Bank & Wire Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#3D5AFE]" />
            <h3 className="text-sm font-medium text-white tracking-wide">
              Bank Wire & Settlement
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
            <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Special Notes / Deliverable Clause</label>
            <textarea
              rows={2}
              value={invoice.payment.notes}
              onChange={(e) => updatePayment('notes', e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors resize-none"
              placeholder="Thank you for partnering with EDA Invoicing."
            />
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC QR PAYMENT SECTION */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#3D5AFE]" />
            <div>
              <h3 className="text-sm font-medium text-white tracking-wide">
                QR Payment & Dynamic Checkout
              </h3>
              <p className="text-[11px] text-[#8A8785]">
                Generate scannable QR code for PayPal, Stripe, Telebirr or Bank transfer
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={qrConfig.enabled}
              onChange={(e) => updateQrConfig('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#000000] border border-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3D5AFE]"></div>
          </label>
        </div>

        {qrConfig.enabled && (
          <div className="p-4 bg-[#000000] rounded-xl border border-white/10 space-y-4 animate-in fade-in duration-200">
            {/* Provider Tabs */}
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1.5 font-medium">
                Payment Channel / Provider
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {providers.map((p) => {
                  const active = qrConfig.provider === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => updateQrConfig('provider', p.id)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg text-center transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#3D5AFE] text-white shadow-sm'
                          : 'bg-[#1A1A1A] text-[#8A8785] hover:text-white'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Provider Input & Hint */}
            <div className="space-y-1.5">
              <label className="block text-[11px] text-[#8A8785] font-medium">
                {qrConfig.provider === 'paypal'
                  ? 'PayPal Username or Link'
                  : qrConfig.provider === 'stripe'
                  ? 'Stripe Payment Link URL'
                  : qrConfig.provider === 'telebirr'
                  ? 'Telebirr Merchant Account / Phone'
                  : qrConfig.provider === 'bank'
                  ? 'Bank IBAN for SEPA QR'
                  : 'Custom Payment Endpoint'}
              </label>
              <input
                type="text"
                value={qrConfig.accountOrUrl}
                onChange={(e) => updateQrConfig('accountOrUrl', e.target.value)}
                placeholder={activeProviderMeta.placeholder}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono"
              />
              <p className="text-[10px] text-[#8A8785] flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-[#3D5AFE]" />
                <span>{activeProviderMeta.hint}</span>
              </p>
            </div>

            {/* Note on QR badge */}
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">
                Instruction Caption (Printed next to QR)
              </label>
              <input
                type="text"
                value={qrConfig.note || ''}
                onChange={(e) => updateQrConfig('note', e.target.value)}
                placeholder="Scan with camera to settle invoice securely"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
              />
            </div>

            {/* Live QR Code Preview Card */}
            <div className="p-3 bg-[#1A1A1A] rounded-lg border border-white/10 flex flex-col sm:flex-row items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow shrink-0">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Payment QR Code"
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center text-[10px] text-gray-400 text-center p-1">
                    Enter valid account link
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1.5 text-xs text-left w-full">
                <div className="flex items-center gap-1.5 text-[#3D5AFE] font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dynamic Total Bound: {calc.formattedGrandTotal}</span>
                </div>
                <p className="text-[11px] text-[#8A8785] line-clamp-2 font-mono break-all">
                  {targetUrl || 'Payload preview will appear here'}
                </p>

                {targetUrl && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#000000] border border-white/10 hover:border-white/20 rounded text-[11px] text-[#8A8785] hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUrl ? 'Copied' : 'Copy Pay Link'}</span>
                    </button>
                    {targetUrl.startsWith('http') && (
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#000000] border border-white/10 hover:border-white/20 rounded text-[11px] text-[#8A8785] hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Test Link</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
