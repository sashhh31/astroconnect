import { unauthorized, ok, badRequest, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function PUT(
  req: Request,
  { params }: { params: { consultationId?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { consultationId } = params;
  if (!consultationId) return badRequest('consultationId is required');

  try {
    const supabase = createSupabaseAdmin();

    // Verify user has access to this consultation
    const { data: consultation } = await supabase
      .from('consultations')
      .select('user_id, astrologer_id')
      .eq('id', consultationId)
      .single();

    if (!consultation || (consultation.user_id !== user.id && consultation.astrologer_id !== user.id)) {
      return unauthorized('Access denied');
    }

    // Mark all messages as read for this user
    const { error } = await supabase
      .from('messages')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('consultation_id', consultationId)
      .neq('sender_id', user.id)
      .eq('is_read', false);

    if (error) {
      return serverError('Failed to mark messages as read', error.message);
    }

    return ok({ marked: true, message: 'Messages marked as read' });
  } catch (err) {
    return serverError('Failed to mark messages as read', (err as Error).message);
  }
}
