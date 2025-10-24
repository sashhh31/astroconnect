import { notFound, ok, serverError } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(_req: Request, { params }: { params: { id?: string } }) {
  const { id } = params;
  if (!id) return notFound('Astrologer not found');

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('astrologers')
    .select(`
      *,
      astrologer_specialties(
        specialty_id,
        specialties(name)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return notFound('Astrologer not found');
  }

  return ok({
    id: data.id,
    fullName: data.full_name,
    displayName: data.display_name || data.full_name,
    bio: data.bio,
    experienceYears: data.experience_years,
    languages: data.languages || [],
    specialties: data.astrologer_specialties?.map((s: any) => s.specialties?.name).filter(Boolean) || [],
    averageRating: parseFloat(data.average_rating || '0'),
    totalReviews: data.total_reviews,
    isOnline: data.is_online,
    chatRate: parseFloat(data.chat_rate || '0'),
    voiceRate: parseFloat(data.voice_rate || '0'),
    videoRate: parseFloat(data.video_rate || '0'),
    profileImageUrl: data.profile_image_url,
    city: data.city,
    state: data.state,
    education: data.education,
    certifications: data.certifications || [],
  });
}
