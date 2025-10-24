import { z } from 'zod';
import { unauthorized, ok, unprocessable, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const EndVideoSchema = z.object({
  consultationId: z.string().uuid(),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = EndVideoSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

    const { data: consultation } = await supabase
      .from('consultations')
      .select('started_at')
      .eq('id', parsed.data.consultationId)
      .single();

    if (consultation?.started_at) {
      const duration = Math.round((Date.now() - new Date(consultation.started_at).getTime()) / 60000);
      
      await supabase
        .from('consultations')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
          duration_minutes: duration,
        })
        .eq('id', parsed.data.consultationId);
    }

    return ok({
      ended: true,
      consultationId: parsed.data.consultationId,
      message: 'Video call ended',
    });
  } catch (err) {
    return serverError('Failed to end video call', (err as Error).message);
  }
}
