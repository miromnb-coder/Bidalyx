import { supabase } from '../lib/supabase';
import { CompanyProfile, PricingSettings } from '../types/company';
import { Customer } from '../types/customer';
import { Quote, QuoteEvent, QuoteStatus, ServiceType } from '../types/quote';

export type RemoteAttachment = {
  id: string;
  quoteId: string;
  fileName: string;
  fileUrl: string;
  storagePath: string;
  mimeType?: string | null;
};

export type QuoteTemplate = {
  id: string;
  name: string;
  serviceType: ServiceType;
  descriptionTemplate: string;
  defaultSchedule: string;
  defaultTerms: string;
  includedItems: string[];
  basePrice: number;
};

export type MessageTemplate = {
  id: string;
  type: 'quote_sent' | 'reminder' | 'expiring' | 'accepted' | 'rejected' | 'question';
  subject?: string | null;
  body: string;
};

export type RemoteWorkspace = {
  quotes: Quote[];
  customers: Customer[];
  attachments: RemoteAttachment[];
  quoteTemplates: QuoteTemplate[];
  messageTemplates: MessageTemplate[];
};

export type RemoteQuoteInput = {
  companyId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  jobTitle: string;
  location: string;
  serviceType: ServiceType;
  serviceLabel: string;
  status: QuoteStatus;
  estimatedValue: number;
  description: string;
  customerMessage: string;
  schedule: string;
  terms: string;
  includedItems: string[];
  area?: number;
};

export type PickedQuoteImage = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
};

function serviceLabelToType(label: string): ServiceType {
  if (label === 'Maalaus') return 'painting';
  if (label === 'Siivous') return 'cleaning';
  if (label === 'Muutto') return 'moving';
  if (label === 'Pihatyö') return 'garden';
  if (label === 'Remontti') return 'renovation';
  return 'other';
}

export function getServiceTypeFromLabel(label: string) {
  return serviceLabelToType(label);
}

function quoteNumber() {
  return `BID-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function mapEvent(row: any): QuoteEvent {
  return { id: row.id, type: row.type, title: row.title, description: row.description ?? '', createdAt: row.created_at };
}

function mapQuote(row: any, items: any[], events: any[], link: any, customer?: any): Quote {
  return {
    id: row.id,
    customerId: row.customer_id ?? customer?.id ?? 'unknown',
    customerName: customer?.name ?? 'Asiakas',
    customerPhone: customer?.phone ?? undefined,
    customerEmail: customer?.email ?? undefined,
    jobTitle: row.job_title,
    location: row.location ?? '',
    serviceType: row.service_type,
    serviceLabel: row.service_label ?? 'Muu',
    status: row.status,
    estimatedValue: Number(row.estimated_value ?? 0),
    requestedAt: row.sent_at ? 'Lähetetty' : 'Luotu',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    validUntil: row.valid_until ? new Date(row.valid_until).toLocaleDateString('fi-FI') : '14 päivää',
    description: row.description ?? '',
    customerMessage: row.customer_message ?? '',
    schedule: row.schedule ?? '',
    terms: row.terms ?? '',
    includedItems: items.map((item) => item.title),
    imageCount: 0,
    shareToken: link?.token ?? row.share_token,
    events: events.map(mapEvent),
  };
}

async function signAttachment(row: any): Promise<RemoteAttachment> {
  const { data } = await supabase.storage.from('quote-images').createSignedUrl(row.file_url, 60 * 60);
  return {
    id: row.id,
    quoteId: row.quote_id,
    fileName: row.file_name,
    storagePath: row.file_url,
    fileUrl: data?.signedUrl ?? row.file_url,
    mimeType: row.mime_type,
  };
}

export async function fetchRemoteWorkspace(companyId: string): Promise<RemoteWorkspace> {
  const [{ data: customers }, { data: quotes }, { data: items }, { data: events }, { data: links }, { data: attachments }, { data: quoteTemplates }, { data: messageTemplates }] = await Promise.all([
    supabase.from('customers').select('*').eq('company_id', companyId).order('created_at', { ascending: false }),
    supabase.from('quotes').select('*').eq('company_id', companyId).order('created_at', { ascending: false }),
    supabase.from('quote_items').select('*').order('sort_order', { ascending: true }),
    supabase.from('quote_events').select('*').order('created_at', { ascending: false }),
    supabase.from('public_quote_links').select('*'),
    supabase.from('quote_attachments').select('*'),
    supabase.from('quote_templates').select('*').eq('company_id', companyId).order('created_at', { ascending: false }),
    supabase.from('message_templates').select('*').eq('company_id', companyId).order('created_at', { ascending: false }),
  ]);

  const customerRows = customers ?? [];
  const quoteRows = quotes ?? [];
  const itemRows = items ?? [];
  const eventRows = events ?? [];
  const linkRows = links ?? [];
  const attachmentRows = await Promise.all((attachments ?? []).map(signAttachment));

  const mappedQuotes = quoteRows.map((quote: any) => {
    const quoteItems = itemRows.filter((item: any) => item.quote_id === quote.id);
    const quoteEvents = eventRows.filter((event: any) => event.quote_id === quote.id);
    const quoteLink = linkRows.find((link: any) => link.quote_id === quote.id);
    const customer = customerRows.find((item: any) => item.id === quote.customer_id);
    const imageCount = attachmentRows.filter((item) => item.quoteId === quote.id).length;
    return { ...mapQuote(quote, quoteItems, quoteEvents, quoteLink, customer), imageCount };
  });

  const mappedCustomers: Customer[] = customerRows.map((customer: any) => {
    const customerQuotes = mappedQuotes.filter((quote) => quote.customerId === customer.id);
    const acceptedQuotes = customerQuotes.filter((quote) => quote.status === 'accepted');
    const latestQuote = customerQuotes[0];
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email ?? undefined,
      phone: customer.phone ?? undefined,
      location: customer.location ?? undefined,
      latestJob: latestQuote?.jobTitle ?? 'Ei tarjouksia',
      latestQuoteId: latestQuote?.id,
      totalValue: customerQuotes.reduce((sum, quote) => sum + quote.estimatedValue, 0),
      acceptedValue: acceptedQuotes.reduce((sum, quote) => sum + quote.estimatedValue, 0),
      quotesCount: customerQuotes.length,
      acceptedQuotesCount: acceptedQuotes.length,
    };
  });

  return {
    quotes: mappedQuotes,
    customers: mappedCustomers,
    attachments: attachmentRows,
    quoteTemplates: (quoteTemplates ?? []).map((row: any) => ({ id: row.id, name: row.name, serviceType: row.service_type, descriptionTemplate: row.description_template ?? '', defaultSchedule: row.default_schedule ?? '', defaultTerms: row.default_terms ?? '', includedItems: Array.isArray(row.included_items) ? row.included_items : [], basePrice: Number(row.base_price ?? 0) })),
    messageTemplates: (messageTemplates ?? []).map((row: any) => ({ id: row.id, type: row.type, subject: row.subject, body: row.body })),
  };
}

export async function createRemoteQuote(input: RemoteQuoteInput): Promise<Quote> {
  const { data: existingCustomers } = await supabase.from('customers').select('*').eq('company_id', input.companyId).or(`email.eq.${input.customerEmail ?? '__none__'},phone.eq.${input.customerPhone ?? '__none__'},name.eq.${input.customerName}`).limit(1);
  let customer = existingCustomers?.[0];
  if (!customer) {
    const { data, error } = await supabase.from('customers').insert({ company_id: input.companyId, name: input.customerName, email: input.customerEmail ?? null, phone: input.customerPhone ?? null, location: input.location }).select('*').single();
    if (error) throw error;
    customer = data;
  }

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 14);
  const { data: quote, error: quoteError } = await supabase.from('quotes').insert({ company_id: input.companyId, customer_id: customer.id, quote_number: quoteNumber(), status: input.status, job_title: input.jobTitle, location: input.location, service_type: input.serviceType, service_label: input.serviceLabel, estimated_value: input.estimatedValue, description: input.description, customer_message: input.customerMessage, schedule: input.schedule, terms: input.terms, valid_until: validUntil.toISOString(), sent_at: input.status === 'sent' ? new Date().toISOString() : null }).select('*').single();
  if (quoteError) throw quoteError;

  const itemRows = input.includedItems.map((title, index) => ({ quote_id: quote.id, title, sort_order: index }));
  if (itemRows.length) await supabase.from('quote_items').insert(itemRows);
  await supabase.from('quote_events').insert([{ quote_id: quote.id, type: 'created', title: 'Tarjous luotu', description: 'Tarjous luotiin Bidalyxissä.' }, { quote_id: quote.id, type: 'drafted', title: 'AI-luonnos valmis', description: 'Bidalyx muodosti tarjousluonnoksen.' }]);
  const { data: publicLink } = await supabase.from('public_quote_links').insert({ quote_id: quote.id, expires_at: validUntil.toISOString() }).select('*').single();
  return mapQuote(quote, itemRows, [], publicLink, customer);
}

export async function updateRemoteQuoteStatus(quoteId: string, status: QuoteStatus) {
  const stamp: Record<string, string | null> = {};
  if (status === 'sent') stamp.sent_at = new Date().toISOString();
  if (status === 'accepted') stamp.accepted_at = new Date().toISOString();
  if (status === 'rejected') stamp.rejected_at = new Date().toISOString();
  const { error } = await supabase.from('quotes').update({ status, ...stamp }).eq('id', quoteId);
  if (error) throw error;
  await supabase.rpc('create_quote_event', { p_quote_id: quoteId, p_type: status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'edited', p_title: `Tila päivitetty: ${status}`, p_description: 'Tarjouksen tila päivitettiin.' });
}

export async function updateRemoteQuote(quoteId: string, updates: Partial<Quote>) {
  const { error } = await supabase.from('quotes').update({ job_title: updates.jobTitle, description: updates.description, estimated_value: updates.estimatedValue, schedule: updates.schedule, terms: updates.terms }).eq('id', quoteId);
  if (error) throw error;
  await supabase.rpc('create_quote_event', { p_quote_id: quoteId, p_type: 'edited', p_title: 'Tarjousta muokattu', p_description: 'Tarjouksen tietoja päivitettiin.' });
}

export async function uploadQuoteImage(quoteId: string, image: PickedQuoteImage) {
  const response = await fetch(image.uri);
  const blob = await response.blob();
  const cleanName = image.fileName ?? `quote-image-${Date.now()}.jpg`;
  const extension = cleanName.split('.').pop() || 'jpg';
  const path = `${quoteId}/${Date.now()}-${Math.random().toString(16).slice(2)}.${extension}`;
  const contentType = image.mimeType ?? 'image/jpeg';
  const { error: uploadError } = await supabase.storage.from('quote-images').upload(path, blob, { contentType, upsert: false });
  if (uploadError) throw uploadError;
  const { error: dbError } = await supabase.from('quote_attachments').insert({ quote_id: quoteId, file_name: cleanName, file_url: path, mime_type: contentType, size_bytes: image.fileSize ?? null });
  if (dbError) throw dbError;
  await supabase.rpc('create_quote_event', { p_quote_id: quoteId, p_type: 'edited', p_title: 'Kuva lisätty', p_description: 'Tarjoukseen lisättiin uusi kuva.' });
}

export async function createDefaultTemplates(companyId: string) {
  const { data: existing } = await supabase.from('quote_templates').select('id').eq('company_id', companyId).limit(1);
  if (existing?.length) return;
  await supabase.from('quote_templates').insert([{ company_id: companyId, name: 'Kaksion maalaus', service_type: 'painting', description_template: 'Sisätilojen maalaus asiakkaan toiveiden mukaan.', default_schedule: '2–3 päivää', default_terms: 'Lopullinen hinta vahvistetaan ennen työn aloitusta.', included_items: ['Pohjatyöt ja suojaukset', 'Maalaus', 'Materiaalit', 'Loppusiivous'], base_price: 850 }, { company_id: companyId, name: 'Muuttosiivous', service_type: 'cleaning', description_template: 'Huolellinen muuttosiivous sovittuun kohteeseen.', default_schedule: '4–6 tuntia', default_terms: 'Tarjous perustuu annettuihin tietoihin.', included_items: ['Keittiö', 'Kylpyhuone', 'Lattiat', 'Pintojen pyyhintä'], base_price: 220 }, { company_id: companyId, name: 'Muuttoapu', service_type: 'moving', description_template: 'Muuttoapu sovittuun kohteeseen.', default_schedule: '1 päivä', default_terms: 'Ei sisällä erikoisnostoja.', included_items: ['Kaksi muuttajaa', 'Auto', 'Kantotyö', 'Kuljetus'], base_price: 390 }]);
  await supabase.from('message_templates').upsert([{ company_id: companyId, type: 'quote_sent', subject: 'Tarjouksesi', body: 'Hei! Tässä tarjouksesi: {{link}}' }, { company_id: companyId, type: 'reminder', subject: 'Muistutus tarjouksesta', body: 'Hei! Haluatko edetä tarjouksen kanssa? Tässä linkki: {{link}}' }, { company_id: companyId, type: 'accepted', subject: 'Kiitos hyväksynnästä', body: 'Kiitos! Otamme sinuun yhteyttä työn aloituksesta.' }], { onConflict: 'company_id,type' });
}

export async function saveRemoteCompany(companyId: string, company: CompanyProfile) {
  const { error } = await supabase.from('companies').update({ name: company.name, business_id: company.businessId, email: company.email, phone: company.phone, website: company.website, location: company.location, tagline: company.tagline }).eq('id', companyId);
  if (error) throw error;
}

export async function saveRemotePricing(companyId: string, pricing: PricingSettings) {
  const { error } = await supabase.from('pricing_settings').update({ painting_per_square_meter: pricing.paintingPerSquareMeter, cleaning_per_square_meter: pricing.cleaningPerSquareMeter, moving_per_square_meter: pricing.movingPerSquareMeter, start_fee: pricing.startFee, travel_fee: pricing.travelFee, vat_percent: pricing.vatPercent }).eq('company_id', companyId);
  if (error) throw error;
}

export function remoteCompanyToProfile(row: any): CompanyProfile {
  return { name: row.name, businessId: row.business_id ?? '', email: row.email ?? '', phone: row.phone ?? '', website: row.website ?? '', location: row.location ?? '', tagline: row.tagline ?? 'Nopeat ja selkeät tarjoukset' };
}

export function remotePricingToSettings(row: any): PricingSettings {
  return { paintingPerSquareMeter: Number(row.painting_per_square_meter ?? 26), cleaningPerSquareMeter: Number(row.cleaning_per_square_meter ?? 5.2), movingPerSquareMeter: Number(row.moving_per_square_meter ?? 8.4), startFee: Number(row.start_fee ?? 120), travelFee: Number(row.travel_fee ?? 35), vatPercent: Number(row.vat_percent ?? 24) };
}
