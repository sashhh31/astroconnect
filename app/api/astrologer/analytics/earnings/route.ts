import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'month'; // day, week, month, year
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const supabase = createSupabaseAdmin();

    let dateFilter = '';
    const now = new Date();

    if (startDate && endDate) {
      dateFilter = `created_at.gte.${startDate},created_at.lte.${endDate}`;
    } else if (period === 'day') {
      const today = now.toISOString().split('T')[0];
      dateFilter = `created_at.gte.${today}`;
    } else if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = `created_at.gte.${weekAgo.toISOString()}`;
    } else if (period === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = `created_at.gte.${monthAgo.toISOString()}`;
    } else if (period === 'year') {
      const yearAgo = new Date(now.getFullYear(), 0, 1);
      dateFilter = `created_at.gte.${yearAgo.toISOString()}`;
    }

    const { data, error } = await supabase
      .from('consultations')
      .select('total_amount, created_at, type, status')
      .eq('astrologer_id', user.id)
      .eq('status', 'completed');

    if (error) {
      return serverError('Failed to fetch earnings', error.message);
    }

    const consultations = data || [];
    const totalEarnings = consultations.reduce((sum, c) => sum + parseFloat(c.total_amount || '0'), 0);
    const platformCommission = totalEarnings * 0.20; // 20% commission
    const netEarnings = totalEarnings - platformCommission;

    // Group by type
    const byType = consultations.reduce((acc: any, c) => {
      acc[c.type] = (acc[c.type] || 0) + parseFloat(c.total_amount || '0');
      return acc;
    }, {});

    return ok({
      period,
      totalEarnings,
      platformCommission,
      netEarnings,
      totalConsultations: consultations.length,
      earningsByType: byType,
      averagePerConsultation: consultations.length > 0 ? totalEarnings / consultations.length : 0,
    });
  } catch (err) {
    return serverError('Failed to fetch earnings analytics', (err as Error).message);
  }
}
