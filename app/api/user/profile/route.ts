import { ok, unauthorized, serverError, notFound } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('users')
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
    dateOfBirth: data.date_of_birth,
    timeOfBirth: data.time_of_birth,
    placeOfBirth: data.place_of_birth,
    gender: data.gender,
    maritalStatus: data.marital_status,
    occupation: data.occupation,
    profileImageUrl: data.profile_image_url,
    walletBalance: parseFloat(data.wallet_balance || '0'),
    totalConsultations: data.total_consultations,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });
}

export async function PUT(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const supabase = createSupabaseAdmin();

  const updates: Record<string, any> = {};
  if (body.fullName) updates.full_name = body.fullName;
  if (body.dateOfBirth) updates.date_of_birth = body.dateOfBirth;
  if (body.timeOfBirth) updates.time_of_birth = body.timeOfBirth;
  if (body.placeOfBirth) updates.place_of_birth = body.placeOfBirth;
  if (body.gender) updates.gender = body.gender;
  if (body.maritalStatus) updates.marital_status = body.maritalStatus;
  if (body.occupation) updates.occupation = body.occupation;

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return serverError('Failed to update profile', error.message);
  }

  return ok({ id: user.id, updated: true, profile: data });
}
