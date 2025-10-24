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

    const { data, error, count } = await supabase
      .from('consultations')
      .select('*', { count: 'exact' })
      .eq('astrologer_id', user.id)
      .eq('status', 'completed')
      .order('ended_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return serverError('Failed to fetch earnings', error.message);
    }

    const earnings = (data || []).map((c: any) => ({
      consultationId: c.id,
      type: c.type,
      endedAt: c.ended_at,
      durationMinutes: c.duration_minutes,
      grossAmount: parseFloat(c.total_amount || '0'),
      platformCommission: parseFloat(c.total_amount || '0') * 0.20,
      netEarnings: parseFloat(c.total_amount || '0') * 0.80,
    }));

    const totalGross = earnings.reduce((sum: number, e: any) => sum + e.grossAmount, 0);
    const totalNet = earnings.reduce((sum: number, e: any) => sum + e.netEarnings, 0);

    return ok({ 
      earnings, 
      total: count || 0, 
      page, 
      limit,
      summary: {
        totalGross,
        totalCommission: totalGross * 0.20,
        totalNet,
      },
    });
  } catch (err) {
    return serverError('Failed to fetch earnings', (err as Error).message);
  }
}
