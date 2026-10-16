import React, { useState, useMemo } from 'react';
import { InvoiceData, InvoiceStatus, CurrencyCode, CURRENCIES } from '../../types/invoice';
import { calculateInvoice, formatReadableDate } from '../../utils/calculations';
import { DEFAULT_INVOICE, SAMPLE_PRESETS } from '../../data/sampleInvoices';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Copy,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  ArrowUpDown,
  MoreVertical,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface Props {
  invoices: InvoiceData[];
  onSelectInvoice: (invoice: InvoiceData, initialView?: 'editor' | 'preview') => void;
  onCreateInvoice: (newInvoice: InvoiceData) => void;
  onUpdateInvoice: (updated: InvoiceData) => void;
  onDeleteInvoice: (id: string) => void;
  onCloneInvoice: (invoice: InvoiceData) => void;
  onPrintInvoice: (invoice: InvoiceData) => void;
}

export const InvoiceListPage: React.FC<Props> = ({
  invoices,
  onSelectInvoice,
  onCreateInvoice,
  onUpdateInvoice,
  onDeleteInvoice,
  onCloneInvoice,
  onPrintInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currencyFilter, setCurrencyFilter] = useState<string>('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Invoice Form State in Modal
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newCurrency, setNewCurrency] = useState<CurrencyCode>('USD');
  const [newTemplatePreset, setNewTemplatePreset] = useState<'blank' | 'tech' | 'retainer' | 'branding'>('tech');

  // Compute stats
  const stats = useMemo(() => {
    let totalCount = invoices.length;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    // Currency totals
    const totalsByCurrency: Record<string, { total: number; paid: number; pending: number }> = {
      USD: { total: 0, paid: 0, pending: 0 },
      EUR: { total: 0, paid: 0, pending: 0 },
      ETB: { total: 0, paid: 0, pending: 0 },
      GBP: { total: 0, paid: 0, pending: 0 },
    };

    invoices.forEach((inv) => {
      const { grandTotal } = calculateInvoice(inv);
      const curr = inv.currency || 'USD';
      if (!totalsByCurrency[curr]) {
        totalsByCurrency[curr] = { total: 0, paid: 0, pending: 0 };
      }
      totalsByCurrency[curr].total += grandTotal;

      if (inv.status === 'PAID') {
        paidCount++;
        totalsByCurrency[curr].paid += grandTotal;
      } else if (inv.status === 'OVERDUE') {
        overdueCount++;
        totalsByCurrency[curr].pending += grandTotal;
      } else {
        pendingCount++;
        totalsByCurrency[curr].pending += grandTotal;
      }
    });

    return { totalCount, paidCount, pendingCount, overdueCount, totalsByCurrency };
  }, [invoices]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.items.some((it) => it.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      const matchesCurrency = currencyFilter === 'ALL' || inv.currency === currencyFilter;

      return matchesSearch && matchesStatus && matchesCurrency;
    });
  }, [invoices, searchTerm, statusFilter, currencyFilter]);

  const handleStatusChange = (invoice: InvoiceData, newStatus: InvoiceStatus) => {
    onUpdateInvoice({
      ...invoice,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNumber = `ETH-2026-${String(invoices.length + 101).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let baseItems = DEFAULT_INVOICE.items;
    let baseTemplate = DEFAULT_INVOICE.customization.template;

    if (newTemplatePreset === 'blank') {
      baseItems = [
        {
          id: `item-${Date.now()}`,
          description: 'Web Design & Consulting Deliverables',
          scope: 'Sprint milestone 1',
          quantity: 1,
          rate: 1500,
        },
      ];
    } else if (newTemplatePreset === 'retainer') {
      baseTemplate = 'compact-statement';
      baseItems = [
        {
          id: `item-${Date.now()}-1`,
          description: 'Design Retainer & Ongoing UI Support',
          scope: 'Bi-weekly reviews, feature specifications & asset export',
          quantity: 40,
          rate: 120,
        },
      ];
    } else if (newTemplatePreset === 'branding') {
      baseTemplate = 'agency-elegant';
      baseItems = [
        {
          id: `item-${Date.now()}-1`,
          description: 'Brand Identity & Visual Design Guidelines',
          scope: 'Logo system, color palettes, vector assets & typography',
          quantity: 1,
          rate: 4500,
        },
      ];
    }

    const created: InvoiceData = {
      ...DEFAULT_INVOICE,
      id: `inv-${Date.now()}`,
      invoiceNumber: nextNumber,
      issueDate: today,
      dueDate: dueDate,
      currency: newCurrency,
      status: 'DRAFT',
      client: {
        ...DEFAULT_INVOICE.client,
        company: newClientCompany || 'New Client Company',
        name: newClientName || 'Account Contact',
        email: newClientEmail || 'client@example.com',
      },
      items: baseItems,
      customization: {
        ...DEFAULT_INVOICE.customization,
        template: baseTemplate,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateInvoice(created);
    setIsCreateModalOpen(false);
    // Reset modal form
    setNewClientCompany('');
    setNewClientName('');
    setNewClientEmail('');
    onSelectInvoice(created, 'editor');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-space">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Invoices Management
          </h1>
          <p className="text-xs text-[#8A8785] mt-1">
            Create, track settlement status, generate dynamic QR codes, and export PDF records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#3D5AFE] rounded-lg hover:bg-[#3D5AFE]/90 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* 2. KPI / Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-[#1A1A1A] p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#8A8785] font-medium block">
            Total Invoices
          </span>
          <div className="text-2xl font-bold text-white tabular-nums">
            {stats.totalCount}
          </div>
          <span className="text-[10px] text-[#8A8785]">Across USD, EUR & ETB accounts</span>
        </div>

        <div className="bg-[#1A1A1A] p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-medium">
              Settled / Paid
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {stats.paidCount}
          </div>
          <span className="text-[10px] text-[#8A8785]">
            USD ${stats.totalsByCurrency.USD?.paid.toLocaleString() || 0}
          </span>
        </div>

        <div className="bg-[#1A1A1A] p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#3D5AFE] font-medium">
              Pending Sprints
            </span>
            <Clock className="w-3.5 h-3.5 text-[#3D5AFE]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {stats.pendingCount}
          </div>
          <span className="text-[10px] text-[#8A8785]">Awaiting client settlement</span>
        </div>

        <div className="bg-[#1A1A1A] p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-red-400 font-medium">
              Overdue
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {stats.overdueCount}
          </div>
          <span className="text-[10px] text-[#8A8785]">Payment terms exceeded</span>
        </div>
      </div>

      {/* 3. Search & Status Filter Bar */}
      <div className="bg-[#1A1A1A] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#8A8785] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice #, client company, contact name or deliverables..."
            className="w-full bg-[#000000] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE] transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-[#000000] rounded-lg border border-white/10">
            {['ALL', 'PENDING', 'PAID', 'OVERDUE', 'DRAFT'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  statusFilter === st
                    ? 'bg-[#3D5AFE] text-white shadow-xs'
                    : 'text-[#8A8785] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Currency selector */}
          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value)}
            className="bg-[#000000] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#3D5AFE]"
          >
            <option value="ALL">All Currencies</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="ETB">ETB (Birr)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      {/* 4. Invoices Table */}
      <div className="bg-[#1A1A1A] rounded-xl border border-white/10 overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-8 h-8 text-[#8A8785] mx-auto opacity-60" />
            <h3 className="text-sm font-medium text-white">No invoices found</h3>
            <p className="text-xs text-[#8A8785] max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or status filter.'
                : 'Get started by creating your first client invoice.'}
            </p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#3D5AFE] rounded-lg hover:bg-[#3D5AFE]/90 transition-colors"
            >
              + Create New Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#000000]/60 border-b border-white/10 text-[11px] uppercase tracking-wider text-[#8A8785] font-semibold">
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Issue / Due</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((inv) => {
                  const calc = calculateInvoice(inv);
                  const isDeleting = deleteConfirmId === inv.id;

                  const statusBadges: Record<string, string> = {
                    DRAFT: 'bg-white/10 text-[#8A8785] border-white/10',
                    PENDING: 'bg-[#3D5AFE]/20 text-[#3D5AFE] border-[#3D5AFE]/30',
                    PAID: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                    OVERDUE: 'bg-red-500/20 text-red-400 border-red-500/30',
                  };

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Invoice ID & Template */}
                      <td className="py-4 px-4 align-middle">
                        <div className="font-mono font-medium text-white">{inv.invoiceNumber}</div>
                        <div className="text-[10px] text-[#8A8785] capitalize">
                          {inv.customization.template.replace('-', ' ')}
                        </div>
                      </td>

                      {/* Client */}
                      <td className="py-4 px-4 align-middle">
                        <div className="font-medium text-white">{inv.client.company}</div>
                        <div className="text-[11px] text-[#8A8785]">{inv.client.name}</div>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-4 align-middle text-[#8A8785] font-mono text-[11px]">
                        <div>Issued: {inv.issueDate}</div>
                        <div className={inv.status === 'OVERDUE' ? 'text-red-400' : ''}>
                          Due: {inv.dueDate}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4 align-middle">
                        <select
                          value={inv.status}
                          onChange={(e) => handleStatusChange(inv, e.target.value as InvoiceStatus)}
                          className={`text-[11px] font-semibold py-1 px-2 rounded border appearance-none cursor-pointer bg-[#000000] ${
                            statusBadges[inv.status] || ''
                          }`}
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="OVERDUE">OVERDUE</option>
                        </select>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 align-middle text-right font-mono tabular-nums">
                        <div className="font-bold text-white text-sm">{calc.formattedGrandTotal}</div>
                        <div className="text-[10px] text-[#8A8785]">{inv.items.length} items</div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 align-middle text-right">
                        {isDeleting ? (
                          <div className="flex items-center justify-end gap-1.5 animate-in fade-in">
                            <span className="text-[10px] text-red-400">Delete?</span>
                            <button
                              type="button"
                              onClick={() => onDeleteInvoice(inv.id)}
                              className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-medium"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 bg-[#000000] border border-white/10 text-white rounded text-[10px]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => onSelectInvoice(inv, 'editor')}
                              className="p-1.5 text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded transition-colors"
                              title="Edit in Studio"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectInvoice(inv, 'preview')}
                              className="p-1.5 text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded transition-colors"
                              title="Live Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onPrintInvoice(inv)}
                              className="p-1.5 text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded transition-colors"
                              title="Export PDF / Print"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onCloneInvoice(inv)}
                              className="p-1.5 text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 hover:border-white/20 rounded transition-colors"
                              title="Clone / Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(inv.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-[#000000] border border-white/10 hover:border-red-500/30 rounded transition-colors"
                              title="Delete Invoice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-medium text-white">Create New Invoice</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#8A8785] hover:text-white text-xs"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">
                  Client / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={newClientCompany}
                  onChange={(e) => setNewClientCompany(e.target.value)}
                  placeholder="e.g. Acme FinTech Corp"
                  className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">
                    Billing Email
                  </label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="billing@acme.com"
                    className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">
                    Invoice Currency
                  </label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value as CurrencyCode)}
                    className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE]"
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="ETB">ETB (Ethiopian Birr)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A8785] mb-1 font-medium">
                    Deliverable Preset
                  </label>
                  <select
                    value={newTemplatePreset}
                    onChange={(e) => setNewTemplatePreset(e.target.value as any)}
                    className="w-full bg-[#000000] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3D5AFE]"
                  >
                    <option value="tech">Web Application & Frontend</option>
                    <option value="branding">Brand Identity & Design System</option>
                    <option value="retainer">Monthly Design Retainer</option>
                    <option value="blank">Blank Invoice</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 text-xs text-[#8A8785] hover:text-white bg-[#000000] border border-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#3D5AFE] rounded-lg hover:bg-[#3D5AFE]/90 transition-colors shadow"
                >
                  Create & Open Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
