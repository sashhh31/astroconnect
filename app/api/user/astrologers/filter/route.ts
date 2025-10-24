import { ok, serverError } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const specialtyId = searchParams.get('specialtyId');
  const minRating = parseFloat(searchParams.get('minRating') || '0');
  const maxRate = parseFloat(searchParams.get('maxRate') || '999999');
  const isOnline = searchParams.get('isOnline');
  const languages = searchParams.get('languages')?.split(',') || [];
  const sortBy = searchParams.get('sortBy') || 'rating'; // rating, experience, rate
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const supabase = createSupabaseAdmin();

    let query = supabase
      .from('astrologers')
      .select(`
        *,
        astrologer_specialties(
          specialty_id,
          specialties(name)
        )
      `, { count: 'exact' })
      .eq('status', 'active');

    // Apply filters
    if (minRating > 0) {
      query = query.gte('average_rating', minRating);
    }

    if (maxRate < 999999) {
      query = query.lte('chat_rate', maxRate);
    }

    if (isOnline === 'true') {
      query = query.eq('is_online', true);
    }

    if (languages.length > 0) {
      query = query.contains('languages', languages);
    }

    // Apply sorting
    if (sortBy === 'rating') {
      query = query.order('average_rating', { ascending: false });
    } else if (sortBy === 'experience') {
      query = query.order('experience_years', { ascending: false });
    } else if (sortBy === 'rate') {
      query = query.order('chat_rate', { ascending: true });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return serverError('Failed to filter astrologers', error.message);
    }

    // Filter by specialty if provided (post-query filter)
    let filteredData = data || [];
    if (specialtyId) {
      filteredData = filteredData.filter((astro: any) =>
        astro.astrologer_specialties?.some((s: any) => s.specialty_id === specialtyId)
      );
    }

    const astrologers = filteredData.map((astro: any) => ({
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

    return ok({ astrologers, total: count || 0, page, limit, filters: { specialtyId, minRating, maxRate, isOnline, languages, sortBy } });
  } catch (err) {
    return serverError('Failed to filter astrologers', (err as Error).message);
  }
}
