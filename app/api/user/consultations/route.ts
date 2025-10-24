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
    .from('consultations')
    .select(`
      *,
      astrologers(full_name, display_name, profile_image_url)
    `, { count: 'exact' })
    .eq('user_id', user.id)
    .order('scheduled_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError('Failed to fetch consultations', error.message);
  }

  const consultations = (data || []).map((c: any) => ({
    id: c.id,
    astrologerId: c.astrologer_id,
    astrologerName: c.astrologers?.display_name || c.astrologers?.full_name,
    astrologerImage: c.astrologers?.profile_image_url,
    type: c.type,
    status: c.status,
    scheduledAt: c.scheduled_at,
    startedAt: c.started_at,
    endedAt: c.ended_at,
    durationMinutes: c.duration_minutes,
    totalAmount: parseFloat(c.total_amount || '0'),
    userRating: c.user_rating,
    createdAt: c.created_at,
  }));

  return ok({ consultations, total: count || 0, page, limit });
}
