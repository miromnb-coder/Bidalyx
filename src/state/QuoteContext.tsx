import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { mockQuotes } from '../data/mockQuotes';
import { RemoteAttachment, createDefaultTemplates, createRemoteQuote, fetchRemoteWorkspace, getServiceTypeFromLabel, remoteCompanyToProfile, remotePricingToSettings, saveRemoteCompany, saveRemotePricing, updateRemoteQuote, updateRemoteQuoteStatus } from '../services/remoteData';
import { CompanyProfile, PricingSettings } from '../types/company';
import { Customer } from '../types/customer';
import { Quote, QuoteEvent, QuoteStatus } from '../types/quote';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'bidalyx-state-v3';

export type NewQuoteInput = {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  jobTitle: string;
  location: string;
  serviceLabel: string;
  status?: QuoteStatus;
  estimatedValue: number;
  description: string;
  customerMessage: string;
  schedule: string;
  terms: string;
  includedItems: string[];
  area?: number;
  imageCount?: number;
};

type QuoteTemplate = {
  id: string;
  name: string;
  serviceType: Quote['serviceType'];
  descriptionTemplate: string;
  defaultSchedule: string;
  defaultTerms: string;
  includedItems: string[];
  basePrice: number;
};

type MessageTemplate = {
  id: string;
  type: string;
  subject?: string | null;
  body: string;
};

type StoredState = {
  quotes: Quote[];
  company: CompanyProfile;
  pricing: PricingSettings;
  onboardingComplete: boolean;
  quoteTemplates: QuoteTemplate[];
  messageTemplates: MessageTemplate[];
  attachments: RemoteAttachment[];
};

type QuoteContextValue = StoredState & {
  loading: boolean;
  syncLoading: boolean;
  syncError: string | null;
  customers: Customer[];
  dashboard: {
    openValue: number;
    acceptedThisMonth: number;
    acceptedCount: number;
    newCount: number;
    winRate: number;
    rejectedCount: number;
    averageQuoteValue: number;
    bestServiceLabel: string;
  };
  refreshRemote: () => Promise<void>;
  addQuote: (input: NewQuoteInput) => Promise<Quote>;
  updateQuote: (quoteId: string, updates: Partial<Quote>) => Promise<void>;
  updateQuoteStatus: (quoteId: string, status: QuoteStatus, eventTitle?: string) => Promise<void>;
  acceptQuote: (quoteId: string) => Promise<void>;
  markQuoteSent: (quoteId: string) => Promise<void>;
  remindCustomer: (quoteId: string) => Promise<void>;
  addLocalImageToQuote: (quoteId: string) => Promise<void>;
  getAttachmentsByQuoteId: (quoteId?: string) => RemoteAttachment[];
  getQuoteById: (quoteId?: string) => Quote | undefined;
  getCustomerById: (customerId?: string) => Customer | undefined;
  getQuotesByCustomerId: (customerId?: string) => Quote[];
  updateCompany: (updates: Partial<CompanyProfile>) => Promise<void>;
  updatePricing: (updates: Partial<PricingSettings>) => Promise<void>;
  completeOnboarding: () => void;
  resetDemoData: () => void;
  buildShareLink: (quote: Quote) => string;
  buildPublicShareLink: (quote: Quote) => string;
};

const initialCompany: CompanyProfile = {
  name: 'Bidalyx Demo Oy',
  businessId: '1234567-8',
  email: 'hello@bidalyx.app',
  phone: '+358 40 000 0000',
  website: 'bidalyx.app',
  location: 'Tampere',
  tagline: 'Nopeat ja selkeät tarjoukset',
};

const initialPricing: PricingSettings = {
  paintingPerSquareMeter: 26,
  cleaningPerSquareMeter: 5.2,
  movingPerSquareMeter: 8.4,
  startFee: 120,
  travelFee: 35,
  vatPercent: 24,
};

const initialState: StoredState = {
  quotes: mockQuotes,
  company: initialCompany,
  pricing: initialPricing,
  onboardingComplete: false,
  quoteTemplates: [],
  messageTemplates: [],
  attachments: [],
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/å/g, 'a').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function makeEvent(type: QuoteEvent['type'], title: string, description: string): QuoteEvent {
  return { id: `event-${Date.now()}-${Math.random().toString(16).slice(2)}`, type, title, description, createdAt: new Date().toISOString() };
}

function makeLocalQuote(input: NewQuoteInput): Quote {
  const createdAt = new Date().toISOString();
  const customerId = `c-${slugify(input.customerName)}`;
  const quoteId = `q-${Date.now()}`;
  return {
    id: quoteId,
    customerId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    jobTitle: input.jobTitle,
    location: input.location,
    serviceType: getServiceTypeFromLabel(input.serviceLabel),
    serviceLabel: input.serviceLabel,
    status: input.status ?? 'draft',
    estimatedValue: input.estimatedValue,
    requestedAt: 'Luotu juuri nyt',
    createdAt,
    updatedAt: createdAt,
    validUntil: '14 päivää',
    description: input.description,
    customerMessage: input.customerMessage,
    schedule: input.schedule,
    terms: input.terms,
    includedItems: input.includedItems,
    area: input.area,
    imageCount: input.imageCount ?? 0,
    shareToken: `bid-${quoteId}`,
    events: [makeEvent('created', 'Tarjous luotu', 'Tarjous luotiin Bidalyxissä.'), makeEvent('drafted', 'AI-luonnos valmis', 'Bidalyx muodosti tarjousluonnoksen.')],
  };
}

function deriveCustomers(quotes: Quote[]): Customer[] {
  const map = new Map<string, Customer>();
  quotes.forEach((quote) => {
    const existing = map.get(quote.customerId);
    const acceptedValue = quote.status === 'accepted' ? quote.estimatedValue : 0;
    if (!existing) {
      map.set(quote.customerId, { id: quote.customerId, name: quote.customerName, email: quote.customerEmail, phone: quote.customerPhone, location: quote.location, latestJob: quote.jobTitle, latestQuoteId: quote.id, totalValue: quote.estimatedValue, acceptedValue, quotesCount: 1, acceptedQuotesCount: quote.status === 'accepted' ? 1 : 0 });
      return;
    }
    map.set(quote.customerId, { ...existing, latestJob: quote.jobTitle, latestQuoteId: quote.id, totalValue: existing.totalValue + quote.estimatedValue, acceptedValue: existing.acceptedValue + acceptedValue, quotesCount: existing.quotesCount + 1, acceptedQuotesCount: existing.acceptedQuotesCount + (quote.status === 'accepted' ? 1 : 0) });
  });
  return Array.from(map.values());
}

export function QuoteProvider({ children }: PropsWithChildren) {
  const auth = useAuth();
  const [state, setState] = useState<StoredState>(initialState);
  const [loading, setLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function refreshRemote() {
    if (!auth.company?.id) return;
    setSyncLoading(true);
    setSyncError(null);
    try {
      await createDefaultTemplates(auth.company.id);
      const workspace = await fetchRemoteWorkspace(auth.company.id);
      setState((current) => ({
        ...current,
        quotes: workspace.quotes,
        attachments: workspace.attachments,
        quoteTemplates: workspace.quoteTemplates,
        messageTemplates: workspace.messageTemplates,
        company: remoteCompanyToProfile(auth.company),
        pricing: auth.pricing ? remotePricingToSettings(auth.pricing) : current.pricing,
      }));
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Supabase-synkronointi epäonnistui.');
    } finally {
      setSyncLoading(false);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setState(JSON.parse(saved) as StoredState);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!loading) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loading]);

  useEffect(() => {
    if (!auth.loading && auth.company?.id) refreshRemote();
  }, [auth.loading, auth.company?.id, auth.pricing?.id]);

  const customers = useMemo(() => deriveCustomers(state.quotes), [state.quotes]);

  const dashboard = useMemo(() => {
    const openStatuses: QuoteStatus[] = ['new', 'waiting', 'draft', 'sent', 'opened'];
    const openQuotes = state.quotes.filter((quote) => openStatuses.includes(quote.status));
    const acceptedQuotes = state.quotes.filter((quote) => quote.status === 'accepted');
    const rejectedQuotes = state.quotes.filter((quote) => quote.status === 'rejected');
    const closedQuotes = [...acceptedQuotes, ...rejectedQuotes];
    const serviceTotals = state.quotes.reduce<Record<string, number>>((acc, quote) => {
      acc[quote.serviceLabel] = (acc[quote.serviceLabel] ?? 0) + quote.estimatedValue;
      return acc;
    }, {});
    const bestServiceLabel = Object.entries(serviceTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Ei dataa';
    return {
      openValue: openQuotes.reduce((sum, quote) => sum + quote.estimatedValue, 0),
      acceptedThisMonth: acceptedQuotes.reduce((sum, quote) => sum + quote.estimatedValue, 0),
      acceptedCount: acceptedQuotes.length,
      rejectedCount: rejectedQuotes.length,
      newCount: state.quotes.filter((quote) => quote.status === 'new').length,
      winRate: closedQuotes.length ? Math.round((acceptedQuotes.length / closedQuotes.length) * 100) : 0,
      averageQuoteValue: state.quotes.length ? Math.round(state.quotes.reduce((sum, quote) => sum + quote.estimatedValue, 0) / state.quotes.length) : 0,
      bestServiceLabel,
    };
  }, [state.quotes]);

  const value: QuoteContextValue = {
    ...state,
    loading,
    syncLoading,
    syncError,
    customers,
    dashboard,
    refreshRemote,
    async addQuote(input) {
      if (auth.company?.id) {
        const quote = await createRemoteQuote({ ...input, companyId: auth.company.id, serviceType: getServiceTypeFromLabel(input.serviceLabel), status: input.status ?? 'draft' });
        await refreshRemote();
        return quote;
      }
      const quote = makeLocalQuote(input);
      setState((current) => ({ ...current, quotes: [quote, ...current.quotes] }));
      return quote;
    },
    async updateQuote(quoteId, updates) {
      if (auth.company?.id) await updateRemoteQuote(quoteId, updates);
      setState((current) => ({ ...current, quotes: current.quotes.map((quote) => quote.id === quoteId ? { ...quote, ...updates, updatedAt: new Date().toISOString(), events: updates.events ?? [makeEvent('edited', 'Tarjousta muokattu', 'Tarjouksen tietoja päivitettiin.'), ...quote.events] } : quote) }));
      if (auth.company?.id) await refreshRemote();
    },
    async updateQuoteStatus(quoteId, status, eventTitle) {
      if (auth.company?.id) await updateRemoteQuoteStatus(quoteId, status);
      setState((current) => ({ ...current, quotes: current.quotes.map((quote) => quote.id === quoteId ? { ...quote, status, updatedAt: new Date().toISOString(), events: [makeEvent(status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : status === 'sent' ? 'sent' : 'edited', eventTitle ?? `Status päivitetty: ${status}`, 'Tarjouksen tila päivitettiin.'), ...quote.events] } : quote) }));
      if (auth.company?.id) await refreshRemote();
    },
    async acceptQuote(quoteId) { await value.updateQuoteStatus(quoteId, 'accepted', 'Tarjous hyväksytty'); },
    async markQuoteSent(quoteId) { await value.updateQuoteStatus(quoteId, 'sent', 'Tarjous lähetetty'); },
    async remindCustomer(quoteId) { await value.updateQuoteStatus(quoteId, 'waiting', 'Asiakasta muistutettu'); },
    async addLocalImageToQuote(quoteId) {
      setState((current) => ({ ...current, quotes: current.quotes.map((quote) => quote.id === quoteId ? { ...quote, imageCount: quote.imageCount + 1 } : quote) }));
    },
    getAttachmentsByQuoteId(quoteId) { return state.attachments.filter((attachment) => attachment.quoteId === quoteId); },
    getQuoteById(quoteId) { return state.quotes.find((quote) => quote.id === quoteId); },
    getCustomerById(customerId) { return customers.find((customer) => customer.id === customerId); },
    getQuotesByCustomerId(customerId) { return state.quotes.filter((quote) => quote.customerId === customerId); },
    async updateCompany(updates) {
      const next = { ...state.company, ...updates };
      if (auth.company?.id) await saveRemoteCompany(auth.company.id, next);
      setState((current) => ({ ...current, company: next }));
      await auth.refreshWorkspace();
    },
    async updatePricing(updates) {
      const next = { ...state.pricing, ...updates };
      if (auth.company?.id) await saveRemotePricing(auth.company.id, next);
      setState((current) => ({ ...current, pricing: next }));
      await auth.refreshWorkspace();
    },
    completeOnboarding() { setState((current) => ({ ...current, onboardingComplete: true })); },
    resetDemoData() { setState(initialState); },
    buildShareLink(quote) { return `https://bidalyx.app/q/${quote.shareToken}`; },
    buildPublicShareLink(quote) { return `https://enxrfphtehaegppmqasw.functions.supabase.co/public-quote?token=${quote.shareToken}`; },
  };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuotes() {
  const context = useContext(QuoteContext);
  if (!context) throw new Error('useQuotes must be used inside QuoteProvider');
  return context;
}
