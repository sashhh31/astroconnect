import { z } from 'zod';
import { unauthorized, ok, badRequest, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const InitiateCallSchema = z.object({
  consultationId: z.string().uuid(),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = InitiateCallSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

    // Verify consultation exists and user has access
    const { data: consultation, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', parsed.data.consultationId)
      .single();

    if (error || !consultation) {
      return badRequest('Consultation not found');
    }

    if (consultation.user_id !== user.id && consultation.astrologer_id !== user.id) {
      return unauthorized('Access denied');
    }

    if (consultation.type !== 'voice_call') {
      return badRequest('This consultation is not a voice call');
    }

    // TODO: Generate Agora token
    // const agoraToken = generateAgoraToken(consultation.agora_channel_name, user.id);

    return ok({
      initiated: true,
      consultationId: consultation.id,
      channelName: consultation.agora_channel_name,
      token: 'PLACEHOLDER_AGORA_TOKEN', // Replace with actual Agora token
      uid: user.id,
      message: 'Call initiated. Integrate Agora SDK for actual call functionality.',
    });
  } catch (err) {
    return serverError('Failed to initiate call', (err as Error).message);
  }
}
