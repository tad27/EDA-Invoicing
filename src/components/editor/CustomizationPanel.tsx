import React from 'react';
import {
  InvoiceData,
  InvoiceTemplateId,
  TypographyMode,
  CustomizationSettings,
} from '../../types/invoice';
import { Palette, Type, Sliders, Image as ImageIcon, Eye } from 'lucide-react';

interface Props {
  invoice: InvoiceData;
  onChange: (updater: (prev: InvoiceData) => InvoiceData) => void;
}

export const CustomizationPanel: React.FC<Props> = ({ invoice, onChange }) => {
  const { customization } = invoice;

  const updateCustomization = (key: keyof CustomizationSettings, value: any) => {
    onChange((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        [key]: value,
      },
    }));
  };

  const templates: Array<{ id: InvoiceTemplateId; name: string; desc: string }> = [
    {
      id: 'ethio-tech',
      name: 'Ethio Tech Minimal',
      desc: 'Default signature theme with Space Grotesk and signal blue accents',
    },
    {
      id: 'agency-elegant',
      name: 'Agency Elegant',
      desc: 'Airy luxury layout with generous whitespace and refined borders',
    },
    {
      id: 'compact-statement',
      name: 'Compact Statement',
      desc: 'High-density structured view for technical tasks and retainer hours',
    },
  ];

  const presetAccents = [
    { label: 'Signal Blue', hex: '#3D5AFE' },
    { label: 'Monochrome', hex: '#000000' },
    { label: 'Emerald', hex: '#059669' },
    { label: 'Amber', hex: '#D97706' },
    { label: 'Violet', hex: '#7C3AED' },
  ];

  const typographyModes: Array<{ id: TypographyMode; label: string; sample: string }> = [
    { id: 'space-grotesk', label: 'Space Grotesk', sample: 'Modern Agency' },
    { id: 'sans-clean', label: 'Clean Sans', sample: 'Minimalist Clean' },
    { id: 'mono-code', label: 'Mono Code', sample: 'Technical Spec' },
  ];

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-xl border border-white/10 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#3D5AFE]" />
          <h3 className="text-sm font-medium text-white tracking-wide">
            Design & Template Engine
          </h3>
        </div>
      </div>

      {/* 1. Template Selector */}
      <div className="space-y-2">
        <label className="block text-[11px] text-[#8A8785] font-medium uppercase tracking-wider">
          Invoice Template
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {templates.map((tpl) => {
            const active = customization.template === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => updateCustomization('template', tpl.id)}
                className={`p-3 rounded-lg text-left transition-all border cursor-pointer ${
                  active
                    ? 'bg-[#000000] border-[#3D5AFE] ring-1 ring-[#3D5AFE]/30'
                    : 'bg-[#000000]/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      active ? 'text-white' : 'text-[#8A8785]'
                    }`}
                  >
                    {tpl.name}
                  </span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#3D5AFE]" />}
                </div>
                <p className="text-[10px] text-[#8A8785] mt-1 line-clamp-2 leading-relaxed">
                  {tpl.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Theme Accent Color */}
      <div className="space-y-2">
        <label className="block text-[11px] text-[#8A8785] font-medium uppercase tracking-wider">
          Primary Theme Accent
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {presetAccents.map((acc) => {
            const active = customization.themeAccent.toLowerCase() === acc.hex.toLowerCase();
            return (
              <button
                key={acc.hex}
                type="button"
                onClick={() => updateCustomization('themeAccent', acc.hex)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  active
                    ? 'border-[#3D5AFE] bg-[#000000] text-white'
                    : 'border-white/10 bg-[#000000]/60 text-[#8A8785] hover:text-white'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                  style={{ backgroundColor: acc.hex }}
                />
                <span className="text-[11px] font-medium">{acc.label}</span>
              </button>
            );
          })}

          {/* Custom color input */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#000000] rounded-lg border border-white/10">
            <input
              type="color"
              value={customization.themeAccent}
              onChange={(e) => updateCustomization('themeAccent', e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
              title="Pick custom accent"
            />
            <span className="text-[10px] font-mono text-[#8A8785]">
              {customization.themeAccent}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Typography Mode */}
      <div className="space-y-2">
        <label className="block text-[11px] text-[#8A8785] font-medium uppercase tracking-wider">
          Typography System
        </label>
        <div className="grid grid-cols-3 gap-2">
          {typographyModes.map((tm) => {
            const active = customization.typographyMode === tm.id;
            return (
              <button
                key={tm.id}
                type="button"
                onClick={() => updateCustomization('typographyMode', tm.id)}
                className={`p-2.5 rounded-lg text-center transition-all border cursor-pointer ${
                  active
                    ? 'bg-[#000000] border-[#3D5AFE] text-white'
                    : 'bg-[#000000]/60 border-white/10 text-[#8A8785] hover:text-white'
                }`}
              >
                <span className="text-xs font-semibold block">{tm.label}</span>
                <span className="text-[10px] text-[#8A8785] block mt-0.5">{tm.sample}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Logo Settings (Position & Size) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
        <div>
          <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Logo Position</label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#000000] rounded-lg border border-white/10">
            {(['left', 'center', 'right'] as const).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => updateCustomization('logoPosition', pos)}
                className={`py-1 text-xs capitalize rounded transition-colors ${
                  customization.logoPosition === pos
                    ? 'bg-[#3D5AFE] text-white font-medium'
                    : 'text-[#8A8785] hover:text-white'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Logo Size</label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#000000] rounded-lg border border-white/10">
            {(['sm', 'md', 'lg'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => updateCustomization('logoSize', sz)}
                className={`py-1 text-xs uppercase rounded transition-colors ${
                  customization.logoSize === sz
                    ? 'bg-[#3D5AFE] text-white font-medium'
                    : 'text-[#8A8785] hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Feature Toggles */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <label className="block text-[11px] text-[#8A8785] font-medium uppercase tracking-wider">
          Elements Visibility
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2 bg-[#000000] border border-white/10 rounded-lg cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={customization.showLogo}
              onChange={(e) => updateCustomization('showLogo', e.target.checked)}
              className="accent-[#3D5AFE] rounded"
            />
            <span className="text-[#E6E6E3]">Show Logo Badge</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-[#000000] border border-white/10 rounded-lg cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={customization.showWatermark}
              onChange={(e) => updateCustomization('showWatermark', e.target.checked)}
              className="accent-[#3D5AFE] rounded"
            />
            <span className="text-[#E6E6E3]">Pixel Matrix Grid</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-[#000000] border border-white/10 rounded-lg cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={customization.showStatusBadge}
              onChange={(e) => updateCustomization('showStatusBadge', e.target.checked)}
              className="accent-[#3D5AFE] rounded"
            />
            <span className="text-[#E6E6E3]">Status Badge</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-[#000000] border border-white/10 rounded-lg cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={customization.showBankDetails}
              onChange={(e) => updateCustomization('showBankDetails', e.target.checked)}
              className="accent-[#3D5AFE] rounded"
            />
            <span className="text-[#E6E6E3]">Bank / Wire Section</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-[#000000] border border-white/10 rounded-lg cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={customization.showNotes}
              onChange={(e) => updateCustomization('showNotes', e.target.checked)}
              className="accent-[#3D5AFE] rounded"
            />
            <span className="text-[#E6E6E3]">Notes & Terms</span>
          </label>

          <label className="flex items-center gap-2 p-2 bg-[#000000] border border-white/10 rounded-lg cursor-pointer hover:border-white/20">
            <input
              type="checkbox"
              checked={customization.showTaxId}
              onChange={(e) => updateCustomization('showTaxId', e.target.checked)}
              className="accent-[#3D5AFE] rounded"
            />
            <span className="text-[#E6E6E3]">TIN / VAT Numbers</span>
          </label>
        </div>
      </div>
    </div>
  );
};
