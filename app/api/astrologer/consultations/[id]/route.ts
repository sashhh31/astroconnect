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
  if (!id) return notFound('Consultation not found');

  try {
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        users(full_name, phone, email, profile_image_url, date_of_birth, time_of_birth, place_of_birth)
      `)
      .eq('id', id)
      .eq('astrologer_id', user.id)
      .single();

    if (error || !data) {
      return notFound('Consultation not found');
    }

    return ok({
      id: data.id,
      userId: data.user_id,
      user: {
        name: data.users?.full_name,
        email: data.users?.email,
        phone: data.users?.phone,
        image: data.users?.profile_image_url,
        dateOfBirth: data.users?.date_of_birth,
        timeOfBirth: data.users?.time_of_birth,
        placeOfBirth: data.users?.place_of_birth,
      },
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
  } catch (err) {
    return serverError('Failed to fetch consultation', (err as Error).message);
  }
}
