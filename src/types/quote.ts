export type QuoteStatus = 'new' | 'waiting' | 'draft' | 'sent' | 'opened' | 'accepted' | 'rejected';

export type ServiceType = 'painting' | 'cleaning' | 'moving' | 'garden' | 'renovation' | 'other';

export type Quote = {
  id: string;
  customerName: string;
  jobTitle: string;
  location: string;
  serviceType: ServiceType;
  status: QuoteStatus;
  estimatedValue: number;
  requestedAt: string;
  description: string;
  schedule: string;
  area?: number;
  imageCount: number;
};
