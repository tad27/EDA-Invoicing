import React, { useState } from 'react';
import { InvoiceData } from '../../types/invoice';
import { User, Building, MapPin, Mail, Phone, FileText } from 'lucide-react';

interface Props {
  invoice: InvoiceData;
  onChange: (updater: (prev: InvoiceData) => InvoiceData) => void;
}

export const ClientAgencyEditor: React.FC<Props> = ({ invoice, onChange }) => {
  const [activeTab, setActiveTab] = useState<'client' | 'agency'>('client');

  const updateClient = (key: keyof InvoiceData['client'], value: string) => {
    onChange((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        [key]: value,
      },
    }));
  };

  const updateAgency = (key: keyof InvoiceData['agency'], value: string) => {
    onChange((prev) => ({
      ...prev,
      agency: {
        ...prev.agency,
        [key]: value,
      },
    }));
  };

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-xl border border-white/10 space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-1.5 p-1 bg-[#000000] rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'client'
                ? 'bg-[#3D5AFE] text-white shadow-sm'
                : 'text-[#8A8785] hover:text-white'
            }`}
          >
            Client Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('agency')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'agency'
                ? 'bg-[#3D5AFE] text-white shadow-sm'
                : 'text-[#8A8785] hover:text-white'
            }`}
          >
            Agency (Ethio Design)
          </button>
        </div>
      </div>

      {activeTab === 'client' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Company Name</label>
              <input
                type="text"
                value={invoice.client.company}
                onChange={(e) => updateClient('company', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="Apex Robotics Labs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Contact Person</label>
              <input
                type="text"
                value={invoice.client.name}
                onChange={(e) => updateClient('name', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Email Address</label>
              <input
                type="email"
                value={invoice.client.email}
                onChange={(e) => updateClient('email', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="billing@client.com"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Phone (Optional)</label>
              <input
                type="text"
                value={invoice.client.phone || ''}
                onChange={(e) => updateClient('phone', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="+1 415 555 0199"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Street Address</label>
            <input
              type="text"
              value={invoice.client.address}
              onChange={(e) => updateClient('address', e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
              placeholder="450 Mission Street, Suite 1200"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">City / State</label>
              <input
                type="text"
                value={invoice.client.city}
                onChange={(e) => updateClient('city', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Country</label>
              <input
                type="text"
                value={invoice.client.country}
                onChange={(e) => updateClient('country', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="United States"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">PO Reference #</label>
              <input
                type="text"
                value={invoice.client.poNumber || ''}
                onChange={(e) => updateClient('poNumber', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono"
                placeholder="PO-2026-092"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Client VAT / Tax ID</label>
            <input
              type="text"
              value={invoice.client.taxId || ''}
              onChange={(e) => updateClient('taxId', e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono"
              placeholder="US-EIN-94-2819401"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Agency Name</label>
              <input
                type="text"
                value={invoice.agency.name}
                onChange={(e) => updateAgency('name', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="Ethio Design"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Website</label>
              <input
                type="text"
                value={invoice.agency.website}
                onChange={(e) => updateAgency('website', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="ethiodesign.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Billing Email</label>
              <input
                type="email"
                value={invoice.agency.email}
                onChange={(e) => updateAgency('email', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="billing@ethiodesign.com"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Phone</label>
              <input
                type="text"
                value={invoice.agency.phone}
                onChange={(e) => updateAgency('phone', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="+251 91 123 4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Street Address</label>
            <input
              type="text"
              value={invoice.agency.address}
              onChange={(e) => updateAgency('address', e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
              placeholder="Bole Medhanialem, Edna Mall Tower Suite 402"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">City</label>
              <input
                type="text"
                value={invoice.agency.city}
                onChange={(e) => updateAgency('city', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="Addis Ababa"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Country</label>
              <input
                type="text"
                value={invoice.agency.country}
                onChange={(e) => updateAgency('country', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
                placeholder="Ethiopia"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">Tax ID / TIN</label>
              <input
                type="text"
                value={invoice.agency.taxId}
                onChange={(e) => updateAgency('taxId', e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors font-mono"
                placeholder="TIN-004819284-ET"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
