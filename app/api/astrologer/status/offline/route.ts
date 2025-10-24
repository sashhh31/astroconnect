import { ok, unauthorized, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function PUT(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const supabase = createSupabaseAdmin();

  const { error } = await supabase
    .from('astrologers')
    .update({ 
      is_online: false,
      last_active_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return serverError('Failed to update status', error.message);
  }

  return ok({ isOnline: false });
}
