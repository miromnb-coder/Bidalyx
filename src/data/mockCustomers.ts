import { Customer } from '../types/customer';

export const mockCustomers: Customer[] = [
  {
    id: 'c-001',
    name: 'Matti Virtanen',
    email: 'matti@example.com',
    phone: '+358 40 123 4567',
    latestJob: 'Kaksion maalaus',
    totalValue: 1250,
    quotesCount: 1,
  },
  {
    id: 'c-002',
    name: 'Laura Niemi',
    email: 'laura@example.com',
    phone: '+358 50 222 3344',
    latestJob: 'Muuttosiivous',
    totalValue: 390,
    quotesCount: 2,
  },
  {
    id: 'c-003',
    name: 'Janne Partanen',
    email: 'janne@example.com',
    phone: '+358 45 555 1212',
    latestJob: 'Ulkoverhouksen maalaus',
    totalValue: 1850,
    quotesCount: 3,
  },
];
