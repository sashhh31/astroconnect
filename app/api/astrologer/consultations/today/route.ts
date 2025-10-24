import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const supabase = createSupabaseAdmin();
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        users(full_name, phone, email, profile_image_url)
      `)
      .eq('astrologer_id', user.id)
      .gte('scheduled_at', `${today}T00:00:00`)
      .lt('scheduled_at', `${today}T23:59:59`)
      .order('scheduled_at', { ascending: true });

    if (error) {
      return serverError('Failed to fetch today\'s consultations', error.message);
    }

    const consultations = (data || []).map((c: any) => ({
      id: c.id,
      userId: c.user_id,
      userName: c.users?.full_name,
      userImage: c.users?.profile_image_url,
      userPhone: c.users?.phone,
      type: c.type,
      status: c.status,
      scheduledAt: c.scheduled_at,
      startedAt: c.started_at,
      endedAt: c.ended_at,
      totalAmount: parseFloat(c.total_amount || '0'),
    }));

    return ok({ consultations, total: consultations.length, date: today });
  } catch (err) {
    return serverError('Failed to fetch today\'s consultations', (err as Error).message);
  }
}
