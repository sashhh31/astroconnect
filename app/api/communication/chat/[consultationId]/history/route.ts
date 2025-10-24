import { unauthorized, ok, badRequest, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(
  req: Request,
  { params }: { params: { consultationId?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { consultationId } = params;
  if (!consultationId) return badRequest('consultationId is required');

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') || '50');
  const before = searchParams.get('before'); // Message ID for pagination

  try {
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

    let query = supabase
      .from('messages')
      .select('*')
      .eq('consultation_id', consultationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) {
      // Get messages before this message ID
      const { data: beforeMsg } = await supabase
        .from('messages')
        .select('created_at')
        .eq('id', before)
        .single();

      if (beforeMsg) {
        query = query.lt('created_at', beforeMsg.created_at);
      }
    }

    const { data, error } = await query;

    if (error) {
      return serverError('Failed to fetch message history', error.message);
    }

    const messages = (data || []).reverse().map((msg: any) => ({
      id: msg.id,
      consultationId: msg.consultation_id,
      content: msg.content,
      type: msg.type,
      senderId: msg.sender_id,
      senderType: msg.sender_type,
      isRead: msg.is_read,
      createdAt: msg.created_at,
    }));

    return ok({ messages, hasMore: messages.length === limit });
  } catch (err) {
    return serverError('Failed to fetch message history', (err as Error).message);
  }
}
