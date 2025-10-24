import type { NextRequest } from 'next/server';
import { createSupabaseAdmin } from './supabase';

export type AuthUser = {
  id: string;
  email?: string;
};

export async function getAuthUser(req: Request | NextRequest): Promise<AuthUser | null> {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const accessToken = auth.slice('Bearer '.length).trim();
  if (!accessToken) return null;

  const supabase = createSupabaseAdmin();
  // Supabase v2: getUser(access_token)
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user) return null;
  return { id: data.user.id, email: data.user.email ?? undefined };
}
