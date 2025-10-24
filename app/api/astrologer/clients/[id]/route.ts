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

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (clientError || !client) {
      return notFound('Client not found');
    }

    // Get consultation history with this astrologer
    const { data: consultations } = await supabase
      .from('consultations')
      .select('id, type, status, scheduled_at, total_amount, user_rating')
      .eq('user_id', id)
      .eq('astrologer_id', user.id)
      .order('scheduled_at', { ascending: false });

    return ok({
      id: client.id,
      fullName: client.full_name,
      email: client.email,
      phone: client.phone,
      profileImageUrl: client.profile_image_url,
      dateOfBirth: client.date_of_birth,
      timeOfBirth: client.time_of_birth,
      placeOfBirth: client.place_of_birth,
      gender: client.gender,
      totalConsultations: consultations?.length || 0,
      totalSpent: consultations?.reduce((sum: number, c: any) => sum + parseFloat(c.total_amount || '0'), 0) || 0,
      averageRating: consultations?.filter((c: any) => c.user_rating).reduce((sum: number, c: any, _, arr: any[]) => sum + c.user_rating / arr.length, 0) || 0,
    });
  } catch (err) {
    return serverError('Failed to fetch client details', (err as Error).message);
  }
}
