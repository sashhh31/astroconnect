import { ok, badRequest, serverError } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const radius = parseFloat(searchParams.get('radius') || '10'); // km
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');

  if (!lat || !lng) {
    return badRequest('Latitude and longitude are required');
  }

  try {
    const supabase = createSupabaseAdmin();
    const offset = (page - 1) * limit;

    // Using PostGIS functions for geospatial queries
    // Note: This requires PostGIS extension enabled in Supabase
    const { data, error, count } = await supabase.rpc('find_nearby_astrologers', {
      user_lat: lat,
      user_lng: lng,
      radius_km: radius,
      result_limit: limit,
      result_offset: offset,
    });

    if (error) {
      // Fallback if RPC function doesn't exist
      console.error('Nearby query error:', error);
      const { data: fallbackData, error: fallbackError, count: fallbackCount } = await supabase
        .from('astrologers')
        .select(`
          *,
          astrologer_specialties(
            specialty_id,
            specialties(name)
          )
        `, { count: 'exact' })
        .eq('status', 'active')
        .eq('is_online', true)
        .order('average_rating', { ascending: false })
        .range(offset, offset + limit - 1);

      if (fallbackError) {
        return serverError('Failed to fetch astrologers', fallbackError.message);
      }

      const astrologers = (fallbackData || []).map((astro: any) => ({
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
        distance: null, // Distance calculation requires PostGIS
      }));

      return ok({ astrologers, total: fallbackCount || 0, page, limit });
    }

    const astrologers = (data || []).map((astro: any) => ({
      id: astro.id,
      fullName: astro.full_name,
      displayName: astro.display_name || astro.full_name,
      profileImageUrl: astro.profile_image_url,
      specialties: astro.specialties || [],
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
      distance: astro.distance_km,
    }));

    return ok({ astrologers, total: count || 0, page, limit });
  } catch (err) {
    return serverError('Failed to fetch nearby astrologers', (err as Error).message);
  }
}
