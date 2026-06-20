export type CompanyProfile = {
  name: string;
  businessId: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  tagline: string;
};

export type PricingSettings = {
  paintingPerSquareMeter: number;
  cleaningPerSquareMeter: number;
  movingPerSquareMeter: number;
  startFee: number;
  travelFee: number;
  vatPercent: number;
};
