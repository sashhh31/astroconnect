import { ok, unauthorized, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const supabase = createSupabaseAdmin();

  // Get astrologer profile stats
  const { data: profile } = await supabase
    .from('astrologers')
    .select('total_consultations, total_earnings, average_rating, total_reviews, is_online')
    .eq('id', user.id)
    .single();

  // Get today's consultations
  const today = new Date().toISOString().split('T')[0];
  const { data: todayConsults, count: todayCount } = await supabase
    .from('consultations')
    .select('*', { count: 'exact' })
    .eq('astrologer_id', user.id)
    .gte('scheduled_at', today)
    .lt('scheduled_at', `${today}T23:59:59`);

  // Get pending consultations
  const { count: pendingCount } = await supabase
    .from('consultations')
    .select('*', { count: 'exact', head: true })
    .eq('astrologer_id', user.id)
    .eq('status', 'pending');

  // Get this month's earnings
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const { data: monthConsults } = await supabase
    .from('consultations')
    .select('total_amount')
    .eq('astrologer_id', user.id)
    .eq('status', 'completed')
    .gte('created_at', firstDayOfMonth.toISOString());

  const monthlyEarnings = (monthConsults || []).reduce(
    (sum: number, c: any) => sum + parseFloat(c.total_amount || '0'),
    0
  );

  return ok({
    totalConsultations: profile?.total_consultations || 0,
    totalEarnings: parseFloat(profile?.total_earnings || '0'),
    averageRating: parseFloat(profile?.average_rating || '0'),
    totalReviews: profile?.total_reviews || 0,
    isOnline: profile?.is_online || false,
    todayConsultations: todayCount || 0,
    pendingConsultations: pendingCount || 0,
    monthlyEarnings,
  });
}
