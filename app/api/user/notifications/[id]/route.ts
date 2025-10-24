import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function DELETE(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return serverError('Notification ID required');

  try {
    const supabase = createSupabaseAdmin();

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return serverError('Failed to delete notification', error.message);
    }

    return ok({ 
      deleted: true,
      message: 'Notification deleted successfully',
    });
  } catch (err) {
    return serverError('Failed to delete notification', (err as Error).message);
  }
}
