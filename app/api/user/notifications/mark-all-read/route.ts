import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function PUT(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const supabase = createSupabaseAdmin();

    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      return serverError('Failed to mark all as read', error.message);
    }

    return ok({ 
      marked: true,
      message: 'All notifications marked as read',
    });
  } catch (err) {
    return serverError('Failed to mark notifications as read', (err as Error).message);
  }
}
