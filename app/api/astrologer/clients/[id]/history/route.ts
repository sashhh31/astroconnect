import { unauthorized, ok, notFound, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return notFound('Client not found');

  try {
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', id)
      .eq('astrologer_id', user.id)
      .order('scheduled_at', { ascending: false });

    if (error) {
      return serverError('Failed to fetch consultation history', error.message);
    }

    const history = (data || []).map((c: any) => ({
      id: c.id,
      type: c.type,
      status: c.status,
      scheduledAt: c.scheduled_at,
      startedAt: c.started_at,
      endedAt: c.ended_at,
      durationMinutes: c.duration_minutes,
      totalAmount: parseFloat(c.total_amount || '0'),
      userRating: c.user_rating,
      userReview: c.user_review,
      astrologerNotes: c.astrologer_notes,
      createdAt: c.created_at,
    }));

    return ok({ history, total: history.length });
  } catch (err) {
    return serverError('Failed to fetch consultation history', (err as Error).message);
  }
}
