import { z } from 'zod';
import { ok, unauthorized, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const PricingSchema = z.object({
  chatRate: z.number().min(0).optional(),
  voiceRate: z.number().min(0).optional(),
  videoRate: z.number().min(0).optional(),
});

export async function PUT(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const json = await req.json();
  const parsed = PricingSchema.safeParse(json);
  if (!parsed.success) {
    return unprocessable('Validation Error', parsed.error.flatten());
  }

  const supabase = createSupabaseAdmin();

  const updates: Record<string, any> = {};
  if (parsed.data.chatRate !== undefined) updates.chat_rate = parsed.data.chatRate;
  if (parsed.data.voiceRate !== undefined) updates.voice_rate = parsed.data.voiceRate;
  if (parsed.data.videoRate !== undefined) updates.video_rate = parsed.data.videoRate;

  const { error } = await supabase
    .from('astrologers')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    return serverError('Failed to update pricing', error.message);
  }

  return ok({ updated: true, pricing: parsed.data });
}
