import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { mockQuotes } from '../data/mockQuotes';
import { CompanyProfile, PricingSettings } from '../types/company';
import { Customer } from '../types/customer';
import { Quote, QuoteEvent, QuoteStatus } from '../types/quote';

const STORAGE_KEY = 'bidalyx-state-v1';

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

type StoredState = {
  quotes: Quote[];
  company: CompanyProfile;
  pricing: PricingSettings;
  onboardingComplete: boolean;
};

type QuoteContextValue = StoredState & {
  loading: boolean;
  customers: Customer[];
  dashboard: {
    openValue: number;
    acceptedThisMonth: number;
    acceptedCount: number;
    newCount: number;
    winRate: number;
  };
  addQuote: (input: NewQuoteInput) => Quote;
  updateQuote: (quoteId: string, updates: Partial<Quote>) => void;
  updateQuoteStatus: (quoteId: string, status: QuoteStatus, eventTitle?: string) => void;
  acceptQuote: (quoteId: string) => void;
  markQuoteSent: (quoteId: string) => void;
  getQuoteById: (quoteId?: string) => Quote | undefined;
  getCustomerById: (customerId?: string) => Customer | undefined;
  getQuotesByCustomerId: (customerId?: string) => Quote[];
  updateCompany: (updates: Partial<CompanyProfile>) => void;
  updatePricing: (updates: Partial<PricingSettings>) => void;
  completeOnboarding: () => void;
  resetDemoData: () => void;
  buildShareLink: (quote: Quote) => string;
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
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getServiceType(label: string): Quote['serviceType'] {
  if (label === 'Siivous') return 'cleaning';
  if (label === 'Muutto') return 'moving';
  if (label === 'Pihatyö') return 'garden';
  if (label === 'Remontti') return 'renovation';
  if (label === 'Maalaus') return 'painting';
  return 'other';
}

function makeEvent(type: QuoteEvent['type'], title: string, description: string): QuoteEvent {
  return {
    id: `event-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
}

function makeQuote(input: NewQuoteInput): Quote {
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
    serviceType: getServiceType(input.serviceLabel),
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
    events: [
      makeEvent('created', 'Tarjous luotu', 'Tarjous luotiin Bidalyxissä.'),
      makeEvent('drafted', 'AI-luonnos valmis', 'Bidalyx muodosti tarjousluonnoksen.'),
    ],
  };
}

function deriveCustomers(quotes: Quote[]): Customer[] {
  const map = new Map<string, Customer>();

  quotes.forEach((quote) => {
    const existing = map.get(quote.customerId);
    const acceptedValue = quote.status === 'accepted' ? quote.estimatedValue : 0;

    if (!existing) {
      map.set(quote.customerId, {
        id: quote.customerId,
        name: quote.customerName,
        email: quote.customerEmail,
        phone: quote.customerPhone,
        location: quote.location,
        latestJob: quote.jobTitle,
        latestQuoteId: quote.id,
        totalValue: quote.estimatedValue,
        acceptedValue,
        quotesCount: 1,
        acceptedQuotesCount: quote.status === 'accepted' ? 1 : 0,
      });
      return;
    }

    map.set(quote.customerId, {
      ...existing,
      latestJob: quote.jobTitle,
      latestQuoteId: quote.id,
      totalValue: existing.totalValue + quote.estimatedValue,
      acceptedValue: existing.acceptedValue + acceptedValue,
      quotesCount: existing.quotesCount + 1,
      acceptedQuotesCount: existing.acceptedQuotesCount + (quote.status === 'accepted' ? 1 : 0),
    });
  });

  return Array.from(map.values());
}

export function QuoteProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<StoredState>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setState(JSON.parse(saved) as StoredState);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loading]);

  const customers = useMemo(() => deriveCustomers(state.quotes), [state.quotes]);

  const dashboard = useMemo(() => {
    const openStatuses: QuoteStatus[] = ['new', 'waiting', 'draft', 'sent', 'opened'];
    const openQuotes = state.quotes.filter((quote) => openStatuses.includes(quote.status));
    const acceptedQuotes = state.quotes.filter((quote) => quote.status === 'accepted');
    const closedQuotes = state.quotes.filter((quote) => quote.status === 'accepted' || quote.status === 'rejected');

    return {
      openValue: openQuotes.reduce((sum, quote) => sum + quote.estimatedValue, 0),
      acceptedThisMonth: acceptedQuotes.reduce((sum, quote) => sum + quote.estimatedValue, 0),
      acceptedCount: acceptedQuotes.length,
      newCount: state.quotes.filter((quote) => quote.status === 'new').length,
      winRate: closedQuotes.length ? Math.round((acceptedQuotes.length / closedQuotes.length) * 100) : 68,
    };
  }, [state.quotes]);

  const value: QuoteContextValue = {
    ...state,
    loading,
    customers,
    dashboard,
    addQuote(input) {
      const quote = makeQuote(input);
      setState((current) => ({ ...current, quotes: [quote, ...current.quotes] }));
      return quote;
    },
    updateQuote(quoteId, updates) {
      setState((current) => ({
        ...current,
        quotes: current.quotes.map((quote) =>
          quote.id === quoteId
            ? {
                ...quote,
                ...updates,
                updatedAt: new Date().toISOString(),
                events: updates.events ?? [makeEvent('edited', 'Tarjousta muokattu', 'Tarjouksen tietoja päivitettiin.'), ...quote.events],
              }
            : quote,
        ),
      }));
    },
    updateQuoteStatus(quoteId, status, eventTitle) {
      setState((current) => ({
        ...current,
        quotes: current.quotes.map((quote) => {
          if (quote.id !== quoteId) return quote;
          const title = eventTitle ?? `Status päivitetty: ${status}`;
          return {
            ...quote,
            status,
            updatedAt: new Date().toISOString(),
            events: [makeEvent(status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'edited', title, 'Tarjouksen tila päivitettiin.'), ...quote.events],
          };
        }),
      }));
    },
    acceptQuote(quoteId) {
      value.updateQuoteStatus(quoteId, 'accepted', 'Tarjous hyväksytty');
    },
    markQuoteSent(quoteId) {
      value.updateQuoteStatus(quoteId, 'sent', 'Tarjous lähetetty');
    },
    getQuoteById(quoteId) {
      return state.quotes.find((quote) => quote.id === quoteId);
    },
    getCustomerById(customerId) {
      return customers.find((customer) => customer.id === customerId);
    },
    getQuotesByCustomerId(customerId) {
      return state.quotes.filter((quote) => quote.customerId === customerId);
    },
    updateCompany(updates) {
      setState((current) => ({ ...current, company: { ...current.company, ...updates } }));
    },
    updatePricing(updates) {
      setState((current) => ({ ...current, pricing: { ...current.pricing, ...updates } }));
    },
    completeOnboarding() {
      setState((current) => ({ ...current, onboardingComplete: true }));
    },
    resetDemoData() {
      setState(initialState);
    },
    buildShareLink(quote) {
      return `https://bidalyx.app/q/${quote.shareToken}`;
    },
  };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuotes() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuotes must be used inside QuoteProvider');
  }
  return context;
}
