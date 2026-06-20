export type QuoteStatus = 'new' | 'waiting' | 'draft' | 'sent' | 'opened' | 'accepted' | 'rejected' | 'expired';

export type ServiceType = 'painting' | 'cleaning' | 'moving' | 'garden' | 'renovation' | 'other';

export type QuoteEventType = 'created' | 'drafted' | 'sent' | 'opened' | 'accepted' | 'rejected' | 'reminded' | 'edited';

export type QuoteEvent = {
  id: string;
  type: QuoteEventType;
  title: string;
  description: string;
  createdAt: string;
};

export type Quote = {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  jobTitle: string;
  location: string;
  serviceType: ServiceType;
  serviceLabel: string;
  status: QuoteStatus;
  estimatedValue: number;
  requestedAt: string;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
  description: string;
  customerMessage: string;
  schedule: string;
  terms: string;
  includedItems: string[];
  area?: number;
  imageCount: number;
  shareToken: string;
  events: QuoteEvent[];
};
