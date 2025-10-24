import { createClient } from '@supabase/supabase-js';
import { env, ensureEnv } from './env';

export function createSupabaseAdmin() {
  ensureEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function createSupabaseAnon() {
  ensureEnv(['SUPABASE_URL', 'SUPABASE_ANON_KEY']);
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
