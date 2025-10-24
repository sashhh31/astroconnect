import { z } from 'zod';
import { unauthorized, ok, badRequest, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const InitiateVideoSchema = z.object({
  consultationId: z.string().uuid(),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = InitiateVideoSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

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

    if (consultation.type !== 'video_call') {
      return badRequest('This consultation is not a video call');
    }

    // TODO: Generate Agora token for video

    return ok({
      initiated: true,
      consultationId: consultation.id,
      channelName: consultation.agora_channel_name,
      token: 'PLACEHOLDER_AGORA_VIDEO_TOKEN',
      uid: user.id,
      message: 'Video call initiated. Integrate Agora SDK for actual video functionality.',
    });
  } catch (err) {
    return serverError('Failed to initiate video call', (err as Error).message);
  }
}
