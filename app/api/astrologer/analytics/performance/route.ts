import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const supabase = createSupabaseAdmin();

    // Get astrologer profile stats
    const { data: profile } = await supabase
      .from('astrologers')
      .select('total_consultations, total_earnings, average_rating, total_reviews, created_at')
      .eq('id', user.id)
      .single();

    // Get monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: consultations } = await supabase
      .from('consultations')
      .select('created_at, total_amount, status')
      .eq('astrologer_id', user.id)
      .gte('created_at', sixMonthsAgo.toISOString());

    // Group by month
    const monthlyData: any = {};
    (consultations || []).forEach((c: any) => {
      const month = c.created_at.slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { consultations: 0, earnings: 0 };
      }
      monthlyData[month].consultations++;
      if (c.status === 'completed') {
        monthlyData[month].earnings += parseFloat(c.total_amount || '0');
      }
    });

    // Calculate growth rate
    const months = Object.keys(monthlyData).sort();
    const growthRate = months.length >= 2
      ? ((monthlyData[months[months.length - 1]].consultations - monthlyData[months[0]].consultations) / monthlyData[months[0]].consultations * 100)
      : 0;

    return ok({
      overview: {
        totalConsultations: profile?.total_consultations || 0,
        totalEarnings: parseFloat(profile?.total_earnings || '0'),
        averageRating: parseFloat(profile?.average_rating || '0'),
        totalReviews: profile?.total_reviews || 0,
        memberSince: profile?.created_at,
      },
      monthlyTrend: monthlyData,
      growthRate: parseFloat(growthRate.toFixed(2)),
    });
  } catch (err) {
    return serverError('Failed to fetch performance analytics', (err as Error).message);
  }
}
