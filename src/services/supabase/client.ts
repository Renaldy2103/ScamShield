export interface SupabaseConfig {
  url?: string;
  anonKey?: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  const isConfigured = Boolean(url && anonKey);

  return {
    url,
    anonKey,
    isConfigured,
  };
}
