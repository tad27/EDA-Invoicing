import React from 'react';
import { InvoiceData, LineItem, CURRENCIES } from '../../types/invoice';
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

interface Props {
  invoice: InvoiceData;
  onChange: (updater: (prev: InvoiceData) => InvoiceData) => void;
}

export const LineItemsEditor: React.FC<Props> = ({ invoice, onChange }) => {
  const currency = CURRENCIES[invoice.currency] || CURRENCIES.USD;

  const handleItemChange = (index: number, key: keyof LineItem, value: any) => {
    onChange((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        ...updated[index],
        [key]: value,
      };
      return {
        ...prev,
        items: updated,
      };
    });
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: 'Web Design & Interactive Prototyping',
      scope: 'Responsive screens and components',
      quantity: 10,
      rate: 100,
    };
    onChange((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (index: number) => {
    if (invoice.items.length <= 1) return;
    onChange((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= invoice.items.length) return;

    onChange((prev) => {
      const items = [...prev.items];
      const temp = items[index];
      items[index] = items[newIndex];
      items[newIndex] = temp;
      return { ...prev, items };
    });
  };

  const addPresetItem = (preset: { description: string; scope: string; quantity: number; rate: number }) => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      ...preset,
    };
    onChange((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3D5AFE]" />
          <h3 className="text-sm font-medium text-white tracking-wide">
            Line Items ({invoice.items.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#3D5AFE] rounded-lg hover:bg-[#3D5AFE]/90 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Preset Item Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-[#8A8785] font-medium uppercase tracking-wider block">
          Quick Service Deliverables:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() =>
              addPresetItem({
                description: 'Full-Stack Next.js 15 & React Architecture',
                scope: 'SSR performance, Tailwind v4 styling, component hierarchy',
                quantity: 24,
                rate: 125,
              })
            }
            className="text-[11px] px-2.5 py-1 bg-[#000000] border border-white/10 hover:border-[#3D5AFE] rounded-md text-white/80 hover:text-white transition-colors cursor-pointer text-left"
          >
            + Next.js Architecture
          </button>
          <button
            type="button"
            onClick={() =>
              addPresetItem({
                description: 'Mobile-First Responsive Wireframes & User Journey',
                scope: 'Cross-device breakpoints, iOS/Android viewport audits',
                quantity: 20,
                rate: 110,
              })
            }
            className="text-[11px] px-2.5 py-1 bg-[#000000] border border-white/10 hover:border-[#3D5AFE] rounded-md text-white/80 hover:text-white transition-colors cursor-pointer text-left"
          >
            + Mobile Wireframing
          </button>
          <button
            type="button"
            onClick={() =>
              addPresetItem({
                description: 'Agency Brand Identity & Color Token Ramps',
                scope: 'Vector badges, typography scale, export formats',
                quantity: 16,
                rate: 130,
              })
            }
            className="text-[11px] px-2.5 py-1 bg-[#000000] border border-white/10 hover:border-[#3D5AFE] rounded-md text-white/80 hover:text-white transition-colors cursor-pointer text-left"
          >
            + Brand & Color Tokens
          </button>
        </div>
      </div>

      {/* Item Rows */}
      <div className="space-y-3 pt-2">
        {invoice.items.map((item, index) => {
          const itemTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
          return (
            <div
              key={item.id || index}
              className="p-3.5 bg-[#000000] border border-white/10 rounded-xl space-y-2.5 group hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Deliverable / Item Description"
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-medium"
                  />
                  <input
                    type="text"
                    value={item.scope || ''}
                    onChange={(e) => handleItemChange(index, 'scope', e.target.value)}
                    placeholder="Scope, specifications, or deliverables notes (optional)"
                    className="w-full bg-[#1A1A1A]/70 border border-white/5 rounded-lg px-2.5 py-1 text-[11px] text-[#8A8785] focus:text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                  />
                </div>

                {/* Move & Delete controls */}
                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    className="p-1 text-[#8A8785] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === invoice.items.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    className="p-1 text-[#8A8785] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={invoice.items.length <= 1}
                    onClick={() => removeItem(index)}
                    className="p-1 text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quantity, Rate, Subtotal row */}
              <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-white/5 items-center">
                <div>
                  <label className="block text-[10px] text-[#8A8785] mb-0.5">Quantity / Hrs</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8A8785] mb-0.5">Rate ({currency.symbol})</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono tabular-nums"
                  />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-[#8A8785] mb-0.5">Subtotal</span>
                  <span className="text-xs font-semibold text-white font-mono tabular-nums">
                    {currency.format(itemTotal)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
