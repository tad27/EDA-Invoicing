export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE';

export type InvoiceTemplateId = 'ethio-tech' | 'agency-elegant' | 'compact-statement';

export type TypographyMode = 'space-grotesk' | 'sans-clean' | 'mono-code';

export type CurrencyCode = 'USD' | 'EUR' | 'ETB' | 'GBP';

export type QRPaymentProvider = 'stripe' | 'paypal' | 'telebirr' | 'bank' | 'custom_url';

export interface QRPaymentConfig {
  enabled: boolean;
  provider: QRPaymentProvider;
  accountOrUrl: string; // e.g. stripe link, paypal handle, telebirr merchant #, or IBAN
  customPayload?: string;
  note?: string;
}

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  format: (amount: number) => string;
}

export interface LineItem {
  id: string;
  description: string;
  scope?: string;
  quantity: number;
  rate: number;
}

export interface AgencyInfo {
  name: string;
  tagline?: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  taxId: string;
}

export interface ClientInfo {
  name: string;
  company: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  country: string;
  taxId?: string;
  poNumber?: string;
}

export interface PaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftBic?: string;
  iban?: string;
  telebirrNumber?: string;
  paymentTerms: string;
  notes: string;
  qrPayment?: QRPaymentConfig;
}

export interface CustomizationSettings {
  template: InvoiceTemplateId;
  themeAccent: string; // e.g. '#3D5AFE'
  typographyMode: TypographyMode;
  logoPosition: 'left' | 'right' | 'center';
  logoSize: 'sm' | 'md' | 'lg';
  showLogo: boolean;
  showWatermark: boolean;
  showStatusBadge: boolean;
  showBankDetails: boolean;
  showNotes: boolean;
  showTaxId: boolean;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: CurrencyCode;
  status: InvoiceStatus;
  agency: AgencyInfo;
  client: ClientInfo;
  items: LineItem[];
  taxRate: number; // percentage, e.g. 15 for 15%
  discountRate: number; // percentage, e.g. 5 for 5%
  discountType: 'percentage' | 'fixed';
  payment: PaymentDetails;
  customization: CustomizationSettings;
  createdAt?: string;
  updatedAt?: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar ($)',
    format: (amt) =>
      `$${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (€)',
    format: (amt) =>
      `€${amt.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  ETB: {
    code: 'ETB',
    symbol: 'ETB',
    name: 'Ethiopian Birr (ETB)',
    format: (amt) =>
      `ETB ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (£)',
    format: (amt) =>
      `£${amt.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
};
