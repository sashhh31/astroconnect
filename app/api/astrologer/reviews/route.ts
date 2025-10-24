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
      .from('reviews')
      .select(`
        *,
        users(full_name, profile_image_url)
      `, { count: 'exact' })
      .eq('astrologer_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return serverError('Failed to fetch reviews', error.message);
    }

    const reviews = (data || []).map((r: any) => ({
      id: r.id,
      rating: r.rating,
      reviewText: r.review_text,
      isAnonymous: r.is_anonymous,
      userName: r.is_anonymous ? 'Anonymous' : r.users?.full_name,
      userImage: r.is_anonymous ? null : r.users?.profile_image_url,
      consultationId: r.consultation_id,
      createdAt: r.created_at,
    }));

    return ok({ reviews, total: count || 0, page, limit });
  } catch (err) {
    return serverError('Failed to fetch reviews', (err as Error).message);
  }
}
