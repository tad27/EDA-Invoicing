import React from 'react';
import { InvoiceData } from '../types/invoice';
import { EthioTechMinimalTemplate } from './templates/EthioTechMinimalTemplate';
import { AgencyElegantTemplate } from './templates/AgencyElegantTemplate';
import { CompactStatementTemplate } from './templates/CompactStatementTemplate';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  scale?: number;
  isPrint?: boolean;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  scale = 1,
  isPrint = false,
}) => {
  const renderTemplate = () => {
    switch (invoice.customization.template) {
      case 'agency-elegant':
        return <AgencyElegantTemplate invoice={invoice} />;
      case 'compact-statement':
        return <CompactStatementTemplate invoice={invoice} />;
      case 'ethio-tech':
      default:
        return <EthioTechMinimalTemplate invoice={invoice} />;
    }
  };

  return (
    <div className={`w-full flex justify-center ${isPrint ? 'p-0 m-0' : 'preview-container'}`}>
      {/* The Printable Invoice Sheet */}
      <div
        id="invoice-paper"
        className={`invoice-paper-sheet bg-white text-black w-full ${
          isPrint
            ? 'p-0 m-0 shadow-none border-0 rounded-none max-w-full'
            : 'shadow-2xl rounded-xl transition-all duration-200 border border-[#E6E6E3]/80 max-w-[850px] overflow-hidden'
        }`}
        style={
          !isPrint && scale !== 1
            ? {
                transformOrigin: 'top center',
                transform: `scale(${scale})`,
              }
            : undefined
        }
      >
        {renderTemplate()}
      </div>
    </div>
  );
};
