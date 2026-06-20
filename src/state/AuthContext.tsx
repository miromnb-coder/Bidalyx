import { Session, User } from '@supabase/supabase-js';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '../lib/supabase';

type CompanyRow = {
  id: string;
  name: string;
  business_id: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  location: string | null;
  tagline: string | null;
};

type PricingRow = {
  id: string;
  company_id: string;
  painting_per_square_meter: number;
  cleaning_per_square_meter: number;
  moving_per_square_meter: number;
  start_fee: number;
  travel_fee: number;
  vat_percent: number;
};

type CompanyInput = {
  name: string;
  businessId?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  tagline?: string;
};

type AuthContextValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  company: CompanyRow | null;
  pricing: PricingRow | null;
  errorMessage: string | null;
  hasCompany: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshWorkspace: () => Promise<void>;
  createFirstCompany: (input: CompanyInput) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [company, setCompany] = useState<CompanyRow | null>(null);
  const [pricing, setPricing] = useState<PricingRow | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const user = session?.user ?? null;

  async function loadWorkspace(currentSession?: Session | null) {
    const activeSession = currentSession ?? session;
    if (!activeSession?.user) {
      setCompany(null);
      setPricing(null);
      return;
    }

    const { data: companyRows, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1);

    if (error) {
      setErrorMessage(error.message);
      setCompany(null);
      setPricing(null);
      return;
    }

    const firstCompany = (companyRows?.[0] as CompanyRow | undefined) ?? null;
    setCompany(firstCompany);

    if (!firstCompany) {
      setPricing(null);
      return;
    }

    const { data: pricingRow } = await supabase
      .from('pricing_settings')
      .select('*')
      .eq('company_id', firstCompany.id)
      .single();

    setPricing((pricingRow as PricingRow | null) ?? null);
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      await loadWorkspace(data.session);
      setLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      await loadWorkspace(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    loading,
    session,
    user,
    company,
    pricing,
    errorMessage,
    hasCompany: Boolean(company),
    async signIn(email, password) {
      setErrorMessage(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setErrorMessage(error.message);
        return false;
      }
      setSession(data.session);
      await loadWorkspace(data.session);
      return true;
    },
    async signUp(email, password, fullName) {
      setErrorMessage(null);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) {
        setErrorMessage(error.message);
        return false;
      }
      if (data.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, full_name: fullName, email: email.trim() });
      }
      if (data.session) {
        setSession(data.session);
        await loadWorkspace(data.session);
      }
      return true;
    },
    async signOut() {
      await supabase.auth.signOut();
      setSession(null);
      setCompany(null);
      setPricing(null);
    },
    async refreshWorkspace() {
      await loadWorkspace(session);
    },
    async createFirstCompany(input) {
      setErrorMessage(null);
      if (!user) {
        setErrorMessage('Kirjaudu ensin sisään.');
        return false;
      }

      const { data: newCompany, error: companyError } = await supabase
        .rpc('create_company_for_current_user', {
          p_name: input.name,
          p_business_id: input.businessId ?? null,
          p_email: input.email ?? user.email ?? null,
          p_phone: input.phone ?? null,
          p_website: input.website ?? null,
          p_location: input.location ?? null,
          p_tagline: input.tagline ?? 'Nopeat ja selkeät tarjoukset',
        });

      if (companyError || !newCompany) {
        setErrorMessage(companyError?.message ?? 'Yritystä ei voitu luoda.');
        return false;
      }

      setCompany(newCompany as CompanyRow);
      await loadWorkspace(session);
      return true;
    },
  }), [loading, session, user, company, pricing, errorMessage]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
