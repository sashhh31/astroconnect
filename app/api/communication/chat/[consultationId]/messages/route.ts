import { ok, badRequest, unauthorized, serverError } from '@/lib/server/http';
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

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: true });

  if (error) {
    return serverError('Failed to fetch messages', error.message);
  }

  const messages = (data || []).map((msg: any) => ({
    id: msg.id,
    consultationId: msg.consultation_id,
    content: msg.content,
    type: msg.type,
    senderId: msg.sender_id,
    senderType: msg.sender_type,
    isRead: msg.is_read,
    createdAt: msg.created_at,
  }));

  return ok({ messages });
}

export async function POST(
  req: Request,
  { params }: { params: { consultationId?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { consultationId } = params;
  if (!consultationId) return badRequest('consultationId is required');

  const body = await req.json().catch(() => ({}));
  const content = body?.content ?? '';
  const type = body?.type ?? 'text';

  const supabase = createSupabaseAdmin();

  // Verify user has access and determine sender type
  const { data: consultation } = await supabase
    .from('consultations')
    .select('user_id, astrologer_id')
    .eq('id', consultationId)
    .single();

  if (!consultation) {
    return badRequest('Consultation not found');
  }

  const senderType = consultation.user_id === user.id ? 'user' : 
                     consultation.astrologer_id === user.id ? 'astrologer' : null;

  if (!senderType) {
    return unauthorized('Access denied');
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      consultation_id: consultationId,
      sender_id: user.id,
      sender_type: senderType,
      content,
      type,
    })
    .select()
    .single();

  if (error || !message) {
    return serverError('Failed to send message', error?.message);
  }

  return ok({
    messageId: message.id,
    content: message.content,
    type: message.type,
    consultationId: message.consultation_id,
    senderId: message.sender_id,
    senderType: message.sender_type,
    createdAt: message.created_at,
  });
}
