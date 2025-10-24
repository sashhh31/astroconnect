import { unauthorized, ok, badRequest, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';
import { generateAgoraToken } from '@/lib/server/agora';

export async function GET(
  req: Request,
  { params }: { params: { consultationId?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { consultationId } = params;
  if (!consultationId) return badRequest('consultationId is required');

  try {
    const supabase = createSupabaseAdmin();

    const { data: consultation, error } = await supabase
      .from('consultations')
      .select('agora_channel_name, user_id, astrologer_id, type')
      .eq('id', consultationId)
      .single();

    if (error || !consultation) {
      return badRequest('Consultation not found');
    }

    if (consultation.user_id !== user.id && consultation.astrologer_id !== user.id) {
      return unauthorized('Access denied');
    }

    // Generate actual Agora token for video
    const { token, expiresIn } = generateAgoraToken(
      consultation.agora_channel_name,
      user.id,
      'publisher'
    );

    return ok({
      token,
      channelName: consultation.agora_channel_name,
      uid: user.id,
      expiresIn,
      appId: process.env.AGORA_APP_ID,
    });
  } catch (err) {
    return serverError('Failed to generate video token', (err as Error).message);
  }
}
