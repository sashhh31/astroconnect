import { ok, unauthorized, serverError, notFound } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('astrologers')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    return notFound('Profile not found');
  }

  return ok({
    id: data.id,
    email: data.email,
    phone: data.phone,
    fullName: data.full_name,
    displayName: data.display_name,
    bio: data.bio,
    experienceYears: data.experience_years,
    languages: data.languages || [],
    education: data.education,
    certifications: data.certifications || [],
    chatRate: parseFloat(data.chat_rate || '0'),
    voiceRate: parseFloat(data.voice_rate || '0'),
    videoRate: parseFloat(data.video_rate || '0'),
    totalConsultations: data.total_consultations,
    totalEarnings: parseFloat(data.total_earnings || '0'),
    averageRating: parseFloat(data.average_rating || '0'),
    totalReviews: data.total_reviews,
    status: data.status,
    isOnline: data.is_online,
    isVerified: data.is_verified,
    profileImageUrl: data.profile_image_url,
    city: data.city,
    state: data.state,
    createdAt: data.created_at,
  });
}

export async function PUT(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const supabase = createSupabaseAdmin();

  const updates: Record<string, any> = {};
  if (body.displayName) updates.display_name = body.displayName;
  if (body.bio) updates.bio = body.bio;
  if (body.languages) updates.languages = body.languages;
  if (body.education) updates.education = body.education;
  if (body.city) updates.city = body.city;
  if (body.state) updates.state = body.state;

  const { data, error } = await supabase
    .from('astrologers')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return serverError('Failed to update profile', error.message);
  }

  return ok({ id: user.id, updated: true, profile: data });
}
