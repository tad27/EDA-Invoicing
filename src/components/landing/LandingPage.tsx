import React, { useState } from 'react';
import { EthioLogo } from '../EthioLogo';
import { DEFAULT_INVOICE, SAMPLE_PRESETS } from '../../data/sampleInvoices';
import { InvoicePreview } from '../InvoicePreview';
import { InvoiceTemplateId } from '../../types/invoice';
import {
  ArrowRight,
  QrCode,
  FileCheck2,
  Layers,
  Sparkles,
  Printer,
  ShieldCheck,
  Zap,
  Globe2,
  CheckCircle2,
  CreditCard,
  Building2,
  DollarSign,
  ChevronRight,
} from 'lucide-react';

interface Props {
  onOpenStudio: (template?: InvoiceTemplateId) => void;
  onOpenList: () => void;
}

export const LandingPage: React.FC<Props> = ({ onOpenStudio, onOpenList }) => {
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<InvoiceTemplateId>('ethio-tech');

  const previewInvoice = {
    ...DEFAULT_INVOICE,
    customization: {
      ...DEFAULT_INVOICE.customization,
      template: activePreviewTemplate,
    },
  };

  return (
    <div className="w-full bg-[#000000] text-white font-space selection:bg-[#3D5AFE]/30 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle matrix grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#3D5AFE 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
          {/* Studio Brand Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-white/10 rounded-full text-xs text-[#8A8785]">
            <span className="w-2 h-2 rounded-full bg-[#3D5AFE]" />
            <span className="text-white font-medium">EDA Invoicing Studio</span>
            <span>·</span>
            <span>Next-Gen Web Design Agency Billing</span>
          </div>

          {/* Marquee Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white text-balance leading-[1.1]">
            Precision Invoicing & Dynamic Settlement for Web Studios
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#8A8785] max-w-2xl mx-auto font-normal leading-relaxed text-balance">
            Craft pixel-accurate invoices, generate instant QR payment channels with Stripe, PayPal & Telebirr, and switch between three agency templates in real time.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onOpenStudio()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold text-white bg-[#3D5AFE] rounded-xl hover:bg-[#3D5AFE]/90 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Launch Invoicing Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenList}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold text-white bg-[#1A1A1A] border border-white/10 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
            >
              <span>Manage Invoices Dashboard</span>
            </button>
          </div>

          {/* Micro Trust Indicators */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-[#8A8785]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5AFE]" />
              <span>Multi-Currency (USD, EUR, ETB)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5AFE]" />
              <span>Dynamic QR Checkouts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5AFE]" />
              <span>Zero-Clutter PDF Print</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5AFE]" />
              <span>Installable PWA (iPhone / Android)</span>
            </div>
          </div>
        </div>

        {/* 2. LIVE INTERACTIVE TEMPLATE SHOWCASE */}
        <div className="mt-16 max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#3D5AFE] font-semibold block">
                Interactive Template Engine
              </span>
              <h3 className="text-base font-medium text-white">
                Live Preview One of Three Bespoke Agency Layouts
              </h3>
            </div>

            {/* Template Selector Pills */}
            <div className="flex items-center p-1 bg-[#1A1A1A] border border-white/10 rounded-xl">
              {(
                [
                  { id: 'ethio-tech', label: 'Ethio Tech Minimal' },
                  { id: 'agency-elegant', label: 'Agency Elegant' },
                  { id: 'compact-statement', label: 'Compact Statement' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActivePreviewTemplate(t.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activePreviewTemplate === t.id
                      ? 'bg-[#3D5AFE] text-white shadow-sm'
                      : 'text-[#8A8785] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Container Frame */}
          <div className="bg-[#121212] p-4 sm:p-8 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex justify-center">
            <div className="w-full max-w-[800px] scale-[0.88] sm:scale-100 origin-top">
              <InvoicePreview invoice={previewInvoice} scale={1} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES BENTO GRID */}
      <section className="px-6 py-20 bg-[#121212] border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#3D5AFE] font-semibold">
              Engineered For Modern Agencies
            </span>
            <h2 className="text-3xl font-medium tracking-tight text-white">
              Every detail tuned for creative service billing
            </h2>
            <p className="text-xs text-[#8A8785] leading-relaxed">
              Designed around the real workflow of web development sprints, Figma design systems, retainer hours, and cross-border client wire transfers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Dynamic QR Code (Spans 2 cols on medium) */}
            <div className="md:col-span-2 bg-[#1A1A1A] p-8 rounded-2xl border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#3D5AFE]/20 text-[#3D5AFE] flex items-center justify-center mb-4">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Dynamic QR Code Settlement
                </h3>
                <p className="text-xs text-[#8A8785] leading-relaxed max-w-xl">
                  Generate camera-scannable QR codes dynamically bound to the invoice grand total and currency. Directly supports Stripe Checkout, PayPal.me handles, Telebirr mobile wallet, and European EPC SEPA banking transfers.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#000000] rounded-xl border border-white/5">
                  <span className="font-semibold text-white block">Stripe Link</span>
                  <span className="text-[10px] text-[#8A8785]">Total + Ref Bound</span>
                </div>
                <div className="p-3 bg-[#000000] rounded-xl border border-white/5">
                  <span className="font-semibold text-white block">PayPal.me</span>
                  <span className="text-[10px] text-[#8A8785]">1-Click URL</span>
                </div>
                <div className="p-3 bg-[#000000] rounded-xl border border-white/5">
                  <span className="font-semibold text-white block">Telebirr ETB</span>
                  <span className="text-[10px] text-[#8A8785]">Ethiopian Wallet</span>
                </div>
                <div className="p-3 bg-[#000000] rounded-xl border border-white/5">
                  <span className="font-semibold text-white block">EPC Banking</span>
                  <span className="text-[10px] text-[#8A8785]">SEPA QR Standard</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Multi-Currency */}
            <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#3D5AFE]/20 text-[#3D5AFE] flex items-center justify-center mb-4">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Multi-Currency Engine
                </h3>
                <p className="text-xs text-[#8A8785] leading-relaxed">
                  Bill clients globally in USD ($), EUR (€), GBP (£), or domestically in Ethiopian Birr (ETB) with localized symbol placement, tax rules, and VAT rates.
                </p>
              </div>

              <div className="p-3 bg-[#000000] rounded-xl border border-white/5 text-xs text-[#8A8785] space-y-1">
                <div className="flex justify-between">
                  <span>Domestic VAT:</span>
                  <span className="text-white font-mono">15% (ET)</span>
                </div>
                <div className="flex justify-between">
                  <span>EU Cross-border:</span>
                  <span className="text-white font-mono">0% Reverse</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: 3 Bespoke Layouts */}
            <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#3D5AFE]/20 text-[#3D5AFE] flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Three Layout Personas
                </h3>
                <p className="text-xs text-[#8A8785] leading-relaxed">
                  Switch effortlessly between Tech Minimal, Agency Elegant, and Compact Statement depending on whether you're billing an enterprise contract or an hourly sprint.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenStudio()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3D5AFE] hover:underline"
              >
                <span>Customize in Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bento Card 4: Full CRUD Invoices Manager (Spans 2 cols) */}
            <div className="md:col-span-2 bg-[#1A1A1A] p-8 rounded-2xl border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#3D5AFE]/20 text-[#3D5AFE] flex items-center justify-center mb-4">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Complete CRUD Pipeline & History
                </h3>
                <p className="text-xs text-[#8A8785] leading-relaxed max-w-xl">
                  Manage all agency invoices with full add, edit, duplicate, search, and delete capabilities. Changes persist automatically in local storage with instant JSON import and backup export.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenList}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#3D5AFE] rounded-lg hover:bg-[#3D5AFE]/90 transition-colors cursor-pointer"
                >
                  Open Invoices List
                </button>
                <button
                  type="button"
                  onClick={() => onOpenStudio()}
                  className="px-4 py-2 text-xs font-medium text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  Create New Record
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUANTITATIVE PROOF & STUDIO METRICS */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-[#1A1A1A] rounded-2xl border border-white/10 space-y-1">
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums">
              $2.8M+
            </span>
            <p className="text-xs text-[#8A8785]">Invoiced Deliverables</p>
          </div>
          <div className="p-6 bg-[#1A1A1A] rounded-2xl border border-white/10 space-y-1">
            <span className="text-3xl sm:text-4xl font-bold text-[#3D5AFE] font-mono tabular-nums">
              100%
            </span>
            <p className="text-xs text-[#8A8785]">Print & PDF Fidelity</p>
          </div>
          <div className="p-6 bg-[#1A1A1A] rounded-2xl border border-white/10 space-y-1">
            <span className="text-3xl sm:text-4xl font-bold text-emerald-400 font-mono tabular-nums">
              &lt; 2s
            </span>
            <p className="text-xs text-[#8A8785]">Instant QR Generation</p>
          </div>
          <div className="p-6 bg-[#1A1A1A] rounded-2xl border border-white/10 space-y-1">
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums">
              4
            </span>
            <p className="text-xs text-[#8A8785]">Currencies: USD, EUR, ETB, GBP</p>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="px-6 py-20 bg-[#121212] border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
            Ready to elevate your agency invoicing?
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8785] max-w-xl mx-auto leading-relaxed">
            Start right now with preloaded deliverables, switch templates with zero lag, and send clean, scannable invoices to your clients.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onOpenStudio()}
              className="px-6 py-3.5 text-xs font-semibold text-white bg-[#3D5AFE] rounded-xl hover:bg-[#3D5AFE]/90 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              Launch EDA Invoicing Studio
            </button>
            <button
              type="button"
              onClick={onOpenList}
              className="px-6 py-3.5 text-xs font-medium text-white bg-[#1A1A1A] border border-white/10 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
            >
              View Invoices List
            </button>
          </div>
        </div>
      </section>

      {/* 6. QUIET FOOTER */}
      <footer className="px-6 py-10 bg-[#000000] border-t border-white/10 text-xs text-[#8A8785]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <EthioLogo size="sm" showWordmark={true} wordmarkText="EDA Invoicing" />
            <span>·</span>
            <span>Ethio Design Creative Technologies PLC</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onOpenStudio()}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Studio
            </button>
            <button
              type="button"
              onClick={onOpenList}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Invoices
            </button>
            <span>Addis Ababa, Ethiopia</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
