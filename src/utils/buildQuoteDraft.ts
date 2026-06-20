import { PricingSettings } from '../types/company';

export type DraftInput = {
  customerName?: string;
  phone?: string;
  email?: string;
  location?: string;
  serviceType?: string;
  message?: string;
  area?: string;
  pricing?: PricingSettings;
};

export type DraftResult = {
  customerName: string;
  location: string;
  serviceType: string;
  jobTitle: string;
  description: string;
  price: number;
  schedule: string;
  includedItems: string[];
  terms: string;
  customerMessage: string;
  area: number;
};

const defaults = {
  customerName: 'Matti Virtanen',
  location: 'Tampere',
  serviceType: 'Maalaus',
  area: '48',
};

const defaultPricing: PricingSettings = {
  paintingPerSquareMeter: 26,
  cleaningPerSquareMeter: 5.2,
  movingPerSquareMeter: 8.4,
  startFee: 120,
  travelFee: 35,
  vatPercent: 24,
};

function getNumber(value?: string, fallback = 48) {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getPrice(area: number, pricePerSquareMeter: number, pricing: PricingSettings, minimum: number) {
  return Math.round(Math.max(minimum, area * pricePerSquareMeter + pricing.startFee + pricing.travelFee));
}

export function buildQuoteDraft(input: DraftInput): DraftResult {
  const pricing = input.pricing ?? defaultPricing;
  const serviceType = input.serviceType || defaults.serviceType;
  const location = input.location || defaults.location;
  const customerName = input.customerName || defaults.customerName;
  const customerMessage = input.message || 'Asiakas pyysi alustavaa tarjousta.';
  const area = getNumber(input.area, 48);

  if (serviceType === 'Siivous') {
    const price = getPrice(area, pricing.cleaningPerSquareMeter, pricing, 220);

    return {
      customerName,
      location,
      serviceType,
      jobTitle: `Muuttosiivous, ${location}`,
      description: `Huolellinen muuttosiivous ${area} m² kohteeseen. Työ sisältää keittiön, kylpyhuoneen, lattioiden ja näkyvien pintojen puhdistuksen asiakkaan toiveiden mukaan.`,
      price,
      schedule: '4–6 tuntia',
      includedItems: ['Keittiön puhdistus', 'Kylpyhuoneen pesu', 'Lattioiden imurointi ja pesu', 'Pintojen pyyhintä'],
      terms: 'Tarjous perustuu asiakkaan antamiin tietoihin ja tarkentuu tarvittaessa ennen työn aloitusta.',
      customerMessage,
      area,
    };
  }

  if (serviceType === 'Muutto') {
    const price = getPrice(area, pricing.movingPerSquareMeter, pricing, 390);

    return {
      customerName,
      location,
      serviceType,
      jobTitle: `Muuttoapu, ${location}`,
      description: `Muuttoapu ${area} m² asuntoon. Tarjous sisältää muuttotyön suunnittelun, kantotyön ja kuljetuksen sovitun aikataulun mukaan.`,
      price,
      schedule: '1 päivä',
      includedItems: ['Kaksi muuttajaa', 'Pakettiauto', 'Kantotyö', 'Kuljetus sovitulle alueelle'],
      terms: 'Tarjous ei sisällä erikoisnostoja tai erikseen sovittavia lisäpalveluita.',
      customerMessage,
      area,
    };
  }

  const price = getPrice(area, pricing.paintingPerSquareMeter, pricing, 850);

  return {
    customerName,
    location,
    serviceType,
    jobTitle: `Kaksion maalaus, ${location}`,
    description: `Sisätilojen maalaus ${area} m² kohteeseen. Työ sisältää seinien ja tarvittaessa kattojen maalauksen, kevyet pohjatyöt ja suojaamisen asiakkaan lähettämien tietojen perusteella.`,
    price,
    schedule: '2–3 päivää',
    includedItems: ['Pohjatyöt ja suojaukset', 'Seinien ja kattojen maalaus', 'Tarvikkeet ja materiaalit', 'Loppusiivous'],
    terms: 'Lopullinen hinta vahvistetaan ennen työn aloitusta, jos kohteessa ilmenee lisätyötä.',
    customerMessage,
    area,
  };
}

export function formatDraftPrice(value: number) {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}
