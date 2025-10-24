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
      .select('rating, review_text, created_at')
      .eq('astrologer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return serverError('Failed to fetch ratings', error.message);
    }

    const reviews = data || [];
    
    // Calculate rating distribution
    const distribution = reviews.reduce((acc: any, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1;
      return acc;
    }, {});

    // Calculate average
    const average = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Recent reviews
    const recentReviews = reviews.slice(0, 10).map(r => ({
      rating: r.rating,
      review: r.review_text,
      date: r.created_at,
    }));

    return ok({
      totalReviews: reviews.length,
      averageRating: parseFloat(average.toFixed(2)),
      distribution: {
        5: distribution[5] || 0,
        4: distribution[4] || 0,
        3: distribution[3] || 0,
        2: distribution[2] || 0,
        1: distribution[1] || 0,
      },
      recentReviews,
    });
  } catch (err) {
    return serverError('Failed to fetch rating analytics', (err as Error).message);
  }
}
