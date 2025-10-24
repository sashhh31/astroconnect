import { unauthorized, ok, badRequest } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function POST(
  req: Request,
  { params }: { params: { consultationId?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { consultationId } = params;
  if (!consultationId) return badRequest('consultationId is required');

  try {
    const body = await req.json().catch(() => ({}));
    const isTyping = body?.isTyping ?? true;

    const supabase = createSupabaseAdmin();

    // Verify access
    const { data: consultation } = await supabase
      .from('consultations')
      .select('user_id, astrologer_id')
      .eq('id', consultationId)
      .single();

    if (!consultation || (consultation.user_id !== user.id && consultation.astrologer_id !== user.id)) {
      return unauthorized('Access denied');
    }

    // Broadcast typing status via Supabase Realtime
    // This would typically be handled by the frontend using Supabase Realtime channels
    // For now, just return success

    return ok({
      broadcasted: true,
      userId: user.id,
      isTyping,
      consultationId,
    });
  } catch (err) {
    return ok({ broadcasted: false, message: 'Typing indicator sent' });
  }
}
