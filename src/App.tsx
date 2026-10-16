import React, { useState, useRef, useEffect } from 'react';
import { InvoiceData, InvoiceTemplateId } from './types/invoice';
import { DEFAULT_INVOICE, SAMPLE_PRESETS } from './data/sampleInvoices';
import { EthioLogo } from './components/EthioLogo';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceMetaEditor } from './components/editor/InvoiceMetaEditor';
import { ClientAgencyEditor } from './components/editor/ClientAgencyEditor';
import { LineItemsEditor } from './components/editor/LineItemsEditor';
import { TaxDiscountEditor } from './components/editor/TaxDiscountEditor';
import { PaymentEditor } from './components/editor/PaymentEditor';
import { CustomizationPanel } from './components/editor/CustomizationPanel';
import { calculateInvoice, generateInvoiceSummaryText } from './utils/calculations';
import { downloadInvoiceJSON, importInvoiceJSON, copyTextToClipboard } from './utils/fileExport';
import {
  Printer,
  Download,
  Upload,
  Copy,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
  LayoutTemplate,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem('ethio_design_invoice_active');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_INVOICE;
      }
    }
    return DEFAULT_INVOICE;
  });

  const [activeTab, setActiveTab] = useState<
    'items' | 'client' | 'meta' | 'taxes' | 'payment' | 'customizer'
  >('items');

  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [previewScale, setPreviewScale] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('ethio_design_invoice_active', JSON.stringify(invoice));
    } catch {
      // Storage quota or disabled
    }
  }, [invoice]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    downloadInvoiceJSON(invoice);
    showToast('Invoice JSON downloaded successfully');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importInvoiceJSON(file)
      .then((imported) => {
        setInvoice(imported);
        showToast('Invoice data imported successfully');
      })
      .catch((err) => {
        showToast(`Import error: ${err.message}`);
      })
      .finally(() => {
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
  };

  const handleCopySummary = async () => {
    const summary = generateInvoiceSummaryText(invoice);
    const success = await copyTextToClipboard(summary);
    if (success) {
      showToast('Invoice breakdown copied to clipboard');
    } else {
      showToast('Failed to copy to clipboard');
    }
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setInvoice(preset.data);
      showToast(`Loaded "${preset.name}" preset`);
    }
  };

  const handleReset = () => {
    setInvoice(DEFAULT_INVOICE);
    showToast('Reset to default invoice template');
  };

  const calc = calculateInvoice(invoice);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-space selection:bg-[#3D5AFE]/30 selection:text-white">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] border border-[#3D5AFE] text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200 no-print">
          <CheckCircle2 className="w-4 h-4 text-[#3D5AFE]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJSON}
        accept=".json"
        className="hidden"
      />

      {/* 1. TOP BAR CONTRACT */}
      <header className="no-print flex items-center justify-between gap-8 px-6 py-3.5 bg-[#000000] border-b border-[#1A1A1A] sticky top-0 z-40">
        {/* Zone 1: Single text element Brand mark with Ethio Design logo */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <EthioLogo size="sm" showWordmark={true} accentColor={invoice.customization.themeAccent} />
        </div>

        {/* Zone 2: 4 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#8A8785]">
          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'items' ? 'text-white' : 'hover:text-white'
            }`}
          >
            Invoice Items
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customizer')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'customizer' ? 'text-white' : 'hover:text-white'
            }`}
          >
            Theme & Styles
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'client' ? 'text-white' : 'hover:text-white'
            }`}
          >
            Client Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'payment' ? 'text-white' : 'hover:text-white'
            }`}
          >
            Settlement
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3D5AFE] rounded-lg hover:bg-[#3D5AFE]/90 transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </header>

      {/* 2. SECONDARY WORKSPACE TOOLBAR */}
      <div className="no-print bg-[#1A1A1A] border-b border-white/5 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Preset Selector & Quick Meta */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#8A8785]">
            <span className="font-semibold text-white">{invoice.invoiceNumber}</span>
            <span>·</span>
            <span className="text-[#3D5AFE] font-medium">{calc.formattedGrandTotal}</span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Preset Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-[11px] text-[#8A8785] mr-1">Presets:</span>
            {SAMPLE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleLoadPreset(p.id)}
                className="px-2 py-0.5 text-[11px] bg-[#000000] border border-white/10 hover:border-white/20 rounded text-[#8A8785] hover:text-white transition-colors cursor-pointer"
                title={p.subtitle}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Actions Cluster: JSON Export/Import, Copy, Reset, Scale */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded-lg transition-colors cursor-pointer"
            title="Copy plain text invoice summary"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Text</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded-lg transition-colors cursor-pointer"
            title="Download invoice JSON data"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save JSON</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded-lg transition-colors cursor-pointer"
            title="Upload existing invoice JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load JSON</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1 text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded-lg transition-colors cursor-pointer"
            title="Reset to default template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Zoom controls for preview */}
          <div className="hidden lg:flex items-center gap-1 ml-2 pl-2 border-l border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setPreviewScale((s) => Math.max(0.7, s - 0.1))}
              className="p-1 text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 rounded transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-[#8A8785] w-10 text-center">
              {Math.round(previewScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setPreviewScale((s) => Math.min(1.2, s + 0.1))}
              className="p-1 text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 rounded transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Bar (Only shown on small screens) */}
      <div className="no-print lg:hidden p-2 bg-[#000000] border-b border-white/10 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileView === 'editor'
              ? 'bg-[#3D5AFE] text-white shadow-sm'
              : 'bg-[#1A1A1A] text-[#8A8785]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileView === 'preview'
              ? 'bg-[#3D5AFE] text-white shadow-sm'
              : 'bg-[#1A1A1A] text-[#8A8785]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* 3. MAIN SPLIT-SCREEN WORKSPACE */}
      <main className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: THE BUILDER & EDITOR */}
        <section
          className={`editor-panel w-full lg:w-[480px] xl:w-[540px] shrink-0 border-r border-[#1A1A1A] bg-[#000000] flex flex-col overflow-y-auto ${
            mobileView === 'editor' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Editor Sub-Navigation Tabs */}
          <div className="no-print sticky top-0 bg-[#000000] z-20 border-b border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'items', label: 'Items', count: invoice.items.length },
                { id: 'customizer', label: 'Theme & Style' },
                { id: 'meta', label: 'Dates & Status' },
                { id: 'client', label: 'Client & Agency' },
                { id: 'taxes', label: 'Taxes' },
                { id: 'payment', label: 'Payment Terms' },
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#3D5AFE] text-white shadow-sm'
                        : 'text-[#8A8785] hover:text-white hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="text-[10px] opacity-80 font-mono">({tab.count})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Editor Form */}
          <div className="p-4 sm:p-6 space-y-5">
            {activeTab === 'items' && (
              <LineItemsEditor invoice={invoice} onChange={setInvoice} />
            )}

            {activeTab === 'customizer' && (
              <CustomizationPanel invoice={invoice} onChange={setInvoice} />
            )}

            {activeTab === 'meta' && (
              <InvoiceMetaEditor invoice={invoice} onChange={setInvoice} />
            )}

            {activeTab === 'client' && (
              <ClientAgencyEditor invoice={invoice} onChange={setInvoice} />
            )}

            {activeTab === 'taxes' && (
              <TaxDiscountEditor invoice={invoice} onChange={setInvoice} />
            )}

            {activeTab === 'payment' && (
              <PaymentEditor invoice={invoice} onChange={setInvoice} />
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: LIVE INVOICE PREVIEW CANVAS */}
        <section
          className={`flex-1 bg-[#121212] overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start ${
            mobileView === 'preview' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Active Template Notice & Quick Switcher */}
          <div className="no-print w-full max-w-[850px] mb-4 flex items-center justify-between text-xs text-[#8A8785]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3D5AFE]" />
              <span className="text-white font-medium">
                {invoice.customization.template === 'ethio-tech'
                  ? 'Ethio Tech Minimal'
                  : invoice.customization.template === 'agency-elegant'
                  ? 'Agency Elegant'
                  : 'Compact Statement'}
              </span>
              <span>·</span>
              <span className="capitalize">{invoice.customization.typographyMode.replace('-', ' ')}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: 'ethio-tech', label: 'Tech' },
                  { id: 'agency-elegant', label: 'Elegant' },
                  { id: 'compact-statement', label: 'Compact' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    setInvoice((prev) => ({
                      ...prev,
                      customization: { ...prev.customization, template: t.id },
                    }))
                  }
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    invoice.customization.template === t.id
                      ? 'bg-[#3D5AFE] text-white'
                      : 'bg-[#1A1A1A] text-[#8A8785] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Render The Live Preview */}
          <InvoicePreview invoice={invoice} scale={previewScale} />
        </section>
      </main>
    </div>
  );
}
