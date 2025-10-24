import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const supabase = createSupabaseAdmin();

    // Get all completed consultations as transactions
    const { data, error, count } = await supabase
      .from('consultations')
      .select(`
        id,
        type,
        total_amount,
        ended_at,
        status,
        users(full_name)
      `, { count: 'exact' })
      .eq('astrologer_id', user.id)
      .eq('status', 'completed')
      .order('ended_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return serverError('Failed to fetch transactions', error.message);
    }

    const transactions = (data || []).map((c: any) => ({
      id: c.id,
      type: 'earning',
      consultationType: c.type,
      amount: parseFloat(c.total_amount || '0'),
      commission: parseFloat(c.total_amount || '0') * 0.20,
      netAmount: parseFloat(c.total_amount || '0') * 0.80,
      clientName: c.users?.full_name,
      date: c.ended_at,
      status: 'completed',
    }));

    return ok({ transactions, total: count || 0, page, limit });
  } catch (err) {
    return serverError('Failed to fetch transactions', (err as Error).message);
  }
}
