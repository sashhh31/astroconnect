import { ok, unauthorized, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const supabase = createSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      astrologer_id,
      created_at,
      astrologers(
        id, full_name, display_name, profile_image_url,
        average_rating, total_reviews, is_online,
        chat_rate, voice_rate, video_rate
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return serverError('Failed to fetch favorites', error.message);
  }

  const favorites = (data || []).map((f: any) => ({
    astrologerId: f.astrologer_id,
    astrologer: f.astrologers ? {
      id: f.astrologers.id,
      fullName: f.astrologers.full_name,
      displayName: f.astrologers.display_name,
      profileImageUrl: f.astrologers.profile_image_url,
      averageRating: parseFloat(f.astrologers.average_rating || '0'),
      totalReviews: f.astrologers.total_reviews,
      isOnline: f.astrologers.is_online,
      chatRate: parseFloat(f.astrologers.chat_rate || '0'),
      voiceRate: parseFloat(f.astrologers.voice_rate || '0'),
      videoRate: parseFloat(f.astrologers.video_rate || '0'),
    } : null,
    addedAt: f.created_at,
  }));

  return ok({ favorites });
}
