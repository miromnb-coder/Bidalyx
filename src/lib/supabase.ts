import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const fallbackUrl = 'https://example.supabase.co';
const fallbackKey = 'placeholder-key';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? fallbackUrl;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? fallbackKey;

export const isSupabaseConfigured = supabaseUrl !== fallbackUrl && supabaseAnonKey !== fallbackKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
