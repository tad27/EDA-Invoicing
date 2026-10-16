import React, { useState } from 'react';
import { InvoiceData, InvoiceTemplateId } from '../types/invoice';
import { InvoicePreview } from './InvoicePreview';
import { calculateInvoice } from '../utils/calculations';
import {
  Printer,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileText,
  Palette,
  Check,
  ShieldCheck,
  Download,
} from 'lucide-react';

interface Props {
  invoice: InvoiceData;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTemplate: (template: InvoiceTemplateId) => void;
  onPrintNow: () => void;
}

export const PrintPreviewModal: React.FC<Props> = ({
  invoice,
  isOpen,
  onClose,
  onUpdateTemplate,
  onPrintNow,
}) => {
  const [zoom, setZoom] = useState<number>(0.9);
  const [isMonochrome, setIsMonochrome] = useState<boolean>(false);

  if (!isOpen) return null;

  const calc = calculateInvoice(invoice);

  // If monochrome preview requested
  const displayInvoice = isMonochrome
    ? {
        ...invoice,
        customization: {
          ...invoice.customization,
          themeAccent: '#000000',
        },
      }
    : invoice;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md font-space animate-in fade-in duration-200 no-print">
      {/* 1. Modal Top Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-[#1A1A1A] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#3D5AFE]/20 text-[#3D5AFE] flex items-center justify-center">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Print Preview — {invoice.invoiceNumber}
            </h3>
            <p className="text-[11px] text-[#8A8785]">
              {invoice.client.company} · {calc.formattedGrandTotal}
            </p>
          </div>
        </div>

        {/* Center: Template & Mode Quick Switchers */}
        <div className="hidden md:flex items-center gap-2">
          {/* Template pills */}
          <div className="flex items-center p-1 bg-[#000000] rounded-lg border border-white/10 text-xs">
            {(
              [
                { id: 'ethio-tech', label: 'Tech Minimal' },
                { id: 'agency-elegant', label: 'Elegant' },
                { id: 'compact-statement', label: 'Compact' },
              ] as const
            ).map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onUpdateTemplate(tpl.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  invoice.customization.template === tpl.id
                    ? 'bg-[#3D5AFE] text-white shadow-xs'
                    : 'text-[#8A8785] hover:text-white'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>

          {/* Monochrome toggle */}
          <button
            type="button"
            onClick={() => setIsMonochrome(!isMonochrome)}
            className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
              isMonochrome
                ? 'bg-white text-black border-white'
                : 'bg-[#000000] text-[#8A8785] border-white/10 hover:text-white'
            }`}
            title="Toggle black and white high-contrast print mode"
          >
            <Palette className="w-3 h-3" />
            <span>{isMonochrome ? 'Monochrome' : 'Accent Color'}</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[#000000] rounded-lg border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
              className="p-1 text-[#8A8785] hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-[#8A8785] w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
              className="p-1 text-[#8A8785] hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Print Now CTA */}
          <button
            type="button"
            onClick={onPrintNow}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3D5AFE] rounded-lg hover:bg-[#3D5AFE]/90 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Now / PDF</span>
          </button>

          {/* Close modal */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 rounded-lg transition-colors cursor-pointer"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Notification Tip */}
      <div className="px-6 py-2 bg-[#121212] border-b border-white/5 text-[11px] text-[#8A8785] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Clean print mode active: Headers, sidebars, and dark containers are stripped. In the print dialog, select <strong className="text-white">Save as PDF</strong> or your printer.
          </span>
        </div>
        <span className="hidden sm:inline font-mono">Standard A4 / US Letter Ready</span>
      </div>

      {/* 3. Main Paper Canvas Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-10 flex items-start justify-center bg-[#212121]">
        <div
          className="transition-transform duration-150 origin-top flex justify-center w-full max-w-[900px]"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Printable Invoice Component */}
          <div className="w-full bg-white shadow-2xl rounded-sm overflow-hidden">
            <InvoicePreview invoice={displayInvoice} scale={1} />
          </div>
        </div>
      </div>
    </div>
  );
};
