import { ok, unauthorized, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  const supabase = createSupabaseAdmin();
  
  const { data, error, count } = await supabase
    .from('transactions')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError('Failed to fetch transactions', error.message);
  }

  const transactions = (data || []).map((txn: any) => ({
    id: txn.id,
    type: txn.type,
    amount: parseFloat(txn.amount),
    description: txn.description,
    status: txn.status,
    paymentMethod: txn.payment_method,
    walletBalanceAfter: parseFloat(txn.wallet_balance_after || '0'),
    createdAt: txn.created_at,
  }));

  return ok({ transactions, total: count || 0, page, limit });
}
