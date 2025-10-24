import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        users(full_name, phone, email, profile_image_url)
      `)
      .eq('astrologer_id', user.id)
      .eq('status', 'pending')
      .order('scheduled_at', { ascending: true });

    if (error) {
      return serverError('Failed to fetch pending consultations', error.message);
    }

    const consultations = (data || []).map((c: any) => ({
      id: c.id,
      userId: c.user_id,
      userName: c.users?.full_name,
      userImage: c.users?.profile_image_url,
      userPhone: c.users?.phone,
      type: c.type,
      scheduledAt: c.scheduled_at,
      totalAmount: parseFloat(c.total_amount || '0'),
      createdAt: c.created_at,
    }));

    return ok({ consultations, total: consultations.length });
  } catch (err) {
    return serverError('Failed to fetch pending consultations', (err as Error).message);
  }
}
