import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const supabase = createSupabaseAdmin();

    // Get all completed consultations
    const { data } = await supabase
      .from('consultations')
      .select('total_amount, ended_at')
      .eq('astrologer_id', user.id)
      .eq('status', 'completed');

    const consultations = data || [];
    const totalGross = consultations.reduce((sum, c) => sum + parseFloat(c.total_amount || '0'), 0);
    const totalNet = totalGross * 0.80; // After 20% commission

    // This month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = consultations.filter(c => new Date(c.ended_at) >= monthStart);
    const monthGross = thisMonth.reduce((sum, c) => sum + parseFloat(c.total_amount || '0'), 0);
    const monthNet = monthGross * 0.80;

    // This week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const thisWeek = consultations.filter(c => new Date(c.ended_at) >= weekStart);
    const weekGross = thisWeek.reduce((sum, c) => sum + parseFloat(c.total_amount || '0'), 0);
    const weekNet = weekGross * 0.80;

    // Today
    const today = now.toISOString().split('T')[0];
    const todayConsults = consultations.filter(c => c.ended_at?.startsWith(today));
    const todayGross = todayConsults.reduce((sum, c) => sum + parseFloat(c.total_amount || '0'), 0);
    const todayNet = todayGross * 0.80;

    return ok({
      lifetime: {
        gross: totalGross,
        commission: totalGross * 0.20,
        net: totalNet,
        consultations: consultations.length,
      },
      thisMonth: {
        gross: monthGross,
        commission: monthGross * 0.20,
        net: monthNet,
        consultations: thisMonth.length,
      },
      thisWeek: {
        gross: weekGross,
        commission: weekGross * 0.20,
        net: weekNet,
        consultations: thisWeek.length,
      },
      today: {
        gross: todayGross,
        commission: todayGross * 0.20,
        net: todayNet,
        consultations: todayConsults.length,
      },
    });
  } catch (err) {
    return serverError('Failed to fetch earnings summary', (err as Error).message);
  }
}
