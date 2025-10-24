import { ok, unauthorized, notFound, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return notFound('Consultation not found');

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      astrologers(full_name, display_name, profile_image_url, phone, email)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return notFound('Consultation not found');
  }

  return ok({
    id: data.id,
    astrologerId: data.astrologer_id,
    astrologerName: data.astrologers?.display_name || data.astrologers?.full_name,
    astrologerImage: data.astrologers?.profile_image_url,
    type: data.type,
    status: data.status,
    scheduledAt: data.scheduled_at,
    startedAt: data.started_at,
    endedAt: data.ended_at,
    durationMinutes: data.duration_minutes,
    ratePerMinute: parseFloat(data.rate_per_minute || '0'),
    totalAmount: parseFloat(data.total_amount || '0'),
    agoraChannelName: data.agora_channel_name,
    userRating: data.user_rating,
    userReview: data.user_review,
    astrologerNotes: data.astrologer_notes,
    createdAt: data.created_at,
  });
}
