import { ok, serverError } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  const supabase = createSupabaseAdmin();
  
  const { data, error, count } = await supabase
    .from('astrologers')
    .select(`
      *,
      astrologer_specialties(
        specialty_id,
        specialties(name)
      )
    `, { count: 'exact' })
    .eq('status', 'active')
    .order('average_rating', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError('Failed to fetch astrologers', error.message);
  }

  const astrologers = (data || []).map((astro: any) => ({
    id: astro.id,
    fullName: astro.full_name,
    displayName: astro.display_name || astro.full_name,
    profileImageUrl: astro.profile_image_url,
    specialties: astro.astrologer_specialties?.map((s: any) => s.specialties?.name).filter(Boolean) || [],
    averageRating: parseFloat(astro.average_rating || '0'),
    totalReviews: astro.total_reviews,
    experienceYears: astro.experience_years,
    isOnline: astro.is_online,
    chatRate: parseFloat(astro.chat_rate || '0'),
    voiceRate: parseFloat(astro.voice_rate || '0'),
    videoRate: parseFloat(astro.video_rate || '0'),
    languages: astro.languages || [],
    city: astro.city,
    state: astro.state,
  }));

  return ok({ astrologers, total: count || 0, page, limit });
}
