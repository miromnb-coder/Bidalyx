export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  latestJob: string;
  latestQuoteId?: string;
  totalValue: number;
  acceptedValue: number;
  quotesCount: number;
  acceptedQuotesCount: number;
};
