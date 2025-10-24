import { ok, unauthorized, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', user.id)
    .single();

  if (error) {
    return serverError('Failed to fetch balance', error.message);
  }

  return ok({
    balance: parseFloat(data?.wallet_balance || '0'),
    currency: 'INR',
    updatedAt: new Date().toISOString(),
  });
}
