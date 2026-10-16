import React, { useState, useRef, useEffect } from 'react';
import { InvoiceData, InvoiceTemplateId } from './types/invoice';
import { DEFAULT_INVOICE, INITIAL_INVOICES_COLLECTION } from './data/sampleInvoices';
import { EthioLogo } from './components/EthioLogo';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceMetaEditor } from './components/editor/InvoiceMetaEditor';
import { ClientAgencyEditor } from './components/editor/ClientAgencyEditor';
import { LineItemsEditor } from './components/editor/LineItemsEditor';
import { TaxDiscountEditor } from './components/editor/TaxDiscountEditor';
import { PaymentEditor } from './components/editor/PaymentEditor';
import { CustomizationPanel } from './components/editor/CustomizationPanel';
import { LandingPage } from './components/landing/LandingPage';
import { InvoiceListPage } from './components/invoices/InvoiceListPage';
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
  CheckCircle2,
  Eye,
  Edit3,
  Plus,
  List,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

type AppView = 'landing' | 'list' | 'studio';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Invoices Collection (CRUD State)
  const [invoices, setInvoices] = useState<InvoiceData[]>(() => {
    try {
      const savedCollection = localStorage.getItem('eda_invoices_collection');
      if (savedCollection) {
        const parsed = JSON.parse(savedCollection);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading invoices collection:', e);
    }
    return INITIAL_INVOICES_COLLECTION;
  });

  // Active Invoice in the Studio
  const [activeInvoice, setActiveInvoice] = useState<InvoiceData>(() => {
    try {
      const savedActive = localStorage.getItem('eda_active_invoice');
      if (savedActive) {
        return JSON.parse(savedActive);
      }
    } catch {
      // fallback
    }
    return INITIAL_INVOICES_COLLECTION[0] || DEFAULT_INVOICE;
  });

  // Studio Sub-Tabs
  const [studioTab, setStudioTab] = useState<
    'items' | 'customizer' | 'meta' | 'client' | 'taxes' | 'payment'
  >('items');

  const [mobileStudioMode, setMobileStudioMode] = useState<'editor' | 'preview'>('editor');
  const [previewScale, setPreviewScale] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync collection to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eda_invoices_collection', JSON.stringify(invoices));
    } catch (e) {
      console.error('Failed to sync invoices collection', e);
    }
  }, [invoices]);

  // Sync active invoice to localStorage & invoices collection
  useEffect(() => {
    try {
      localStorage.setItem('eda_active_invoice', JSON.stringify(activeInvoice));
      // Also update in collection if exists
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === activeInvoice.id ? activeInvoice : inv))
      );
    } catch (e) {
      console.error('Failed to sync active invoice', e);
    }
  }, [activeInvoice]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // CRUD Operations
  const handleCreateNewInvoice = (newInv?: InvoiceData) => {
    const inv: InvoiceData =
      newInv || {
        ...DEFAULT_INVOICE,
        id: `inv-${Date.now()}`,
        invoiceNumber: `ETH-2026-${String(invoices.length + 101).padStart(3, '0')}`,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

    setInvoices((prev) => [inv, ...prev]);
    setActiveInvoice(inv);
    setCurrentView('studio');
    showToast(`Created invoice #${inv.invoiceNumber}`);
  };

  const handleUpdateInvoice = (updated: InvoiceData) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updated.id ? updated : inv))
    );
    if (activeInvoice.id === updated.id) {
      setActiveInvoice(updated);
    }
    showToast(`Updated invoice #${updated.invoiceNumber}`);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    if (activeInvoice.id === id) {
      const remaining = invoices.filter((inv) => inv.id !== id);
      if (remaining.length > 0) {
        setActiveInvoice(remaining[0]);
      } else {
        setActiveInvoice(DEFAULT_INVOICE);
      }
    }
    showToast('Invoice deleted');
  };

  const handleCloneInvoice = (inv: InvoiceData) => {
    const cloned: InvoiceData = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: `ETH-2026-${String(invoices.length + 101).padStart(3, '0')}`,
      status: 'DRAFT',
      issueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInvoices((prev) => [cloned, ...prev]);
    setActiveInvoice(cloned);
    setCurrentView('studio');
    showToast(`Cloned into #${cloned.invoiceNumber}`);
  };

  const handleSelectInvoice = (inv: InvoiceData, initialView: 'editor' | 'preview' = 'editor') => {
    setActiveInvoice(inv);
    setMobileStudioMode(initialView);
    setCurrentView('studio');
  };

  const handlePrint = (targetInvoice?: InvoiceData) => {
    if (targetInvoice && targetInvoice.id !== activeInvoice.id) {
      setActiveInvoice(targetInvoice);
      setTimeout(() => {
        window.print();
      }, 150);
    } else {
      window.print();
    }
  };

  const handleExportJSON = () => {
    downloadInvoiceJSON(activeInvoice);
    showToast('Invoice JSON downloaded');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importInvoiceJSON(file)
      .then((imported) => {
        const id = imported.id || `inv-${Date.now()}`;
        const normalized = { ...imported, id };
        setInvoices((prev) => [normalized, ...prev.filter((i) => i.id !== id)]);
        setActiveInvoice(normalized);
        setCurrentView('studio');
        showToast('Invoice JSON imported successfully');
      })
      .catch((err) => {
        showToast(`Import error: ${err.message}`);
      })
      .finally(() => {
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
  };

  const handleCopySummary = async () => {
    const summary = generateInvoiceSummaryText(activeInvoice);
    const success = await copyTextToClipboard(summary);
    if (success) {
      showToast('Invoice breakdown copied to clipboard');
    } else {
      showToast('Failed to copy to clipboard');
    }
  };

  const calc = calculateInvoice(activeInvoice);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-space selection:bg-[#3D5AFE]/30 selection:text-white">
      {/* Toast Notification */}
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

      {/* 1. TOP BAR (Conforming to Top Bar Contract) */}
      <header className="no-print flex items-center justify-between gap-8 px-6 py-3.5 bg-[#000000] border-b border-[#1A1A1A] sticky top-0 z-40">
        {/* Zone 1: Single text element Brand mark with EDA Invoicing logo */}
        <button
          type="button"
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 cursor-pointer text-left focus:outline-none"
        >
          <EthioLogo
            size="sm"
            showWordmark={true}
            wordmarkText="EDA Invoicing"
            accentColor={activeInvoice.customization.themeAccent}
          />
        </button>

        {/* Zone 2: 4 Single-line Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#8A8785]">
          <button
            type="button"
            onClick={() => setCurrentView('landing')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'landing' ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('list')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'list' ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            <span>Invoices</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white/10 rounded-full font-mono">
              {invoices.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('studio')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'studio' ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Studio Builder
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentView('studio');
              setStudioTab('payment');
            }}
            className="transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-white"
          >
            QR Settlement
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView === 'studio' ? (
            <button
              type="button"
              onClick={() => handlePrint()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3D5AFE] rounded-lg hover:bg-[#3D5AFE]/90 transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF / Print</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleCreateNewInvoice()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3D5AFE] rounded-lg hover:bg-[#3D5AFE]/90 transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. RENDER ACTIVE VIEW */}
      {currentView === 'landing' && (
        <LandingPage
          onOpenStudio={(template) => {
            if (template) {
              setActiveInvoice((prev) => ({
                ...prev,
                customization: { ...prev.customization, template },
              }));
            }
            setCurrentView('studio');
          }}
          onOpenList={() => setCurrentView('list')}
        />
      )}

      {currentView === 'list' && (
        <InvoiceListPage
          invoices={invoices}
          onSelectInvoice={handleSelectInvoice}
          onCreateInvoice={handleCreateNewInvoice}
          onUpdateInvoice={handleUpdateInvoice}
          onDeleteInvoice={handleDeleteInvoice}
          onCloneInvoice={handleCloneInvoice}
          onPrintInvoice={(inv) => handlePrint(inv)}
        />
      )}

      {currentView === 'studio' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Secondary Workspace Toolbar for Studio */}
          <div className="no-print bg-[#1A1A1A] border-b border-white/5 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left: Back to List + Active Invoice Info */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Invoices</span>
              </button>

              <div className="h-4 w-px bg-white/10" />

              <div className="flex items-center gap-1.5 text-xs text-[#8A8785]">
                <span className="font-semibold text-white">{activeInvoice.invoiceNumber}</span>
                <span>·</span>
                <span className="text-[#3D5AFE] font-medium">{calc.formattedGrandTotal}</span>
                <span>·</span>
                <span className="text-white/70">{activeInvoice.client.company}</span>
              </div>
            </div>

            {/* Right: Actions Cluster */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded-lg transition-colors cursor-pointer"
                title="Copy plain text summary"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Text</span>
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded-lg transition-colors cursor-pointer"
                title="Download JSON backup"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save JSON</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded-lg transition-colors cursor-pointer"
                title="Upload JSON"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Load JSON</span>
              </button>

              <button
                type="button"
                onClick={() => handleCreateNewInvoice()}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-white bg-[#3D5AFE] rounded-lg hover:bg-[#3D5AFE]/90 transition-colors cursor-pointer"
                title="Create another invoice"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New</span>
              </button>

              {/* Zoom Controls */}
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

          {/* Mobile View Toggle Bar */}
          <div className="no-print lg:hidden p-2 bg-[#000000] border-b border-white/10 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setMobileStudioMode('editor')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                mobileStudioMode === 'editor'
                  ? 'bg-[#3D5AFE] text-white shadow-sm'
                  : 'bg-[#1A1A1A] text-[#8A8785]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileStudioMode('preview')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                mobileStudioMode === 'preview'
                  ? 'bg-[#3D5AFE] text-white shadow-sm'
                  : 'bg-[#1A1A1A] text-[#8A8785]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          {/* Split-Screen Studio Workspace */}
          <main className="flex-1 flex overflow-hidden">
            {/* LEFT COLUMN: THE BUILDER & EDITOR */}
            <section
              className={`editor-panel w-full lg:w-[480px] xl:w-[540px] shrink-0 border-r border-[#1A1A1A] bg-[#000000] flex flex-col overflow-y-auto ${
                mobileStudioMode === 'editor' ? 'block' : 'hidden lg:flex'
              }`}
            >
              {/* Studio Sub-Navigation Tabs */}
              <div className="no-print sticky top-0 bg-[#000000] z-20 border-b border-white/10 px-4 py-2.5">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  {[
                    { id: 'items', label: 'Items', count: activeInvoice.items.length },
                    { id: 'payment', label: 'Settlement & QR' },
                    { id: 'customizer', label: 'Theme & Style' },
                    { id: 'meta', label: 'Dates & Status' },
                    { id: 'client', label: 'Client Profile' },
                    { id: 'taxes', label: 'Taxes & Discount' },
                  ].map((tab) => {
                    const active = studioTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStudioTab(tab.id as any)}
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
                {studioTab === 'items' && (
                  <LineItemsEditor invoice={activeInvoice} onChange={setActiveInvoice} />
                )}

                {studioTab === 'payment' && (
                  <PaymentEditor invoice={activeInvoice} onChange={setActiveInvoice} />
                )}

                {studioTab === 'customizer' && (
                  <CustomizationPanel invoice={activeInvoice} onChange={setActiveInvoice} />
                )}

                {studioTab === 'meta' && (
                  <InvoiceMetaEditor invoice={activeInvoice} onChange={setActiveInvoice} />
                )}

                {studioTab === 'client' && (
                  <ClientAgencyEditor invoice={activeInvoice} onChange={setActiveInvoice} />
                )}

                {studioTab === 'taxes' && (
                  <TaxDiscountEditor invoice={activeInvoice} onChange={setActiveInvoice} />
                )}
              </div>
            </section>

            {/* RIGHT COLUMN: LIVE INVOICE PREVIEW CANVAS */}
            <section
              className={`flex-1 bg-[#121212] overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start ${
                mobileStudioMode === 'preview' ? 'block' : 'hidden lg:flex'
              }`}
            >
              {/* Template notice & quick template toggle */}
              <div className="no-print w-full max-w-[850px] mb-4 flex items-center justify-between text-xs text-[#8A8785]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3D5AFE]" />
                  <span className="text-white font-medium capitalize">
                    {activeInvoice.customization.template.replace('-', ' ')}
                  </span>
                  <span>·</span>
                  <span className="capitalize">
                    {activeInvoice.customization.typographyMode.replace('-', ' ')}
                  </span>
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
                        setActiveInvoice((prev) => ({
                          ...prev,
                          customization: { ...prev.customization, template: t.id },
                        }))
                      }
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        activeInvoice.customization.template === t.id
                          ? 'bg-[#3D5AFE] text-white'
                          : 'bg-[#1A1A1A] text-[#8A8785] hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Paper */}
              <InvoicePreview invoice={activeInvoice} scale={previewScale} />
            </section>
          </main>
        </div>
      )}
    </div>
  );
}
