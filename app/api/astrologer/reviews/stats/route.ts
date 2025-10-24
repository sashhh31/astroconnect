import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('astrologer_id', user.id);

    if (error) {
      return serverError('Failed to fetch review stats', error.message);
    }

    const reviews = data || [];
    
    // Calculate distribution
    const distribution = reviews.reduce((acc: any, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1;
      return acc;
    }, {});

    // Calculate average
    const average = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Calculate percentage for each rating
    const total = reviews.length;
    const percentages = {
      5: total > 0 ? ((distribution[5] || 0) / total * 100).toFixed(1) : '0',
      4: total > 0 ? ((distribution[4] || 0) / total * 100).toFixed(1) : '0',
      3: total > 0 ? ((distribution[3] || 0) / total * 100).toFixed(1) : '0',
      2: total > 0 ? ((distribution[2] || 0) / total * 100).toFixed(1) : '0',
      1: total > 0 ? ((distribution[1] || 0) / total * 100).toFixed(1) : '0',
    };

    return ok({
      totalReviews: total,
      averageRating: parseFloat(average.toFixed(2)),
      distribution: {
        5: distribution[5] || 0,
        4: distribution[4] || 0,
        3: distribution[3] || 0,
        2: distribution[2] || 0,
        1: distribution[1] || 0,
      },
      percentages,
    });
  } catch (err) {
    return serverError('Failed to fetch review stats', (err as Error).message);
  }
}
