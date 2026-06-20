export type RemoteCompany = {
  id: string;
  name: string;
  businessId?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  location?: string | null;
  tagline?: string | null;
};

export type RemotePricing = {
  id: string;
  companyId: string;
  paintingPerSquareMeter: number;
  cleaningPerSquareMeter: number;
  movingPerSquareMeter: number;
  startFee: number;
  travelFee: number;
  vatPercent: number;
};

export type CompanySetupInput = {
  name: string;
  businessId?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  tagline?: string;
};
