import { z } from 'zod';
import { ok, unprocessable, serverError } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const SendNotificationSchema = z.object({
  userId: z.string().uuid().optional(),
  astrologerId: z.string().uuid().optional(),
  type: z.enum(['consultation', 'payment', 'promotion', 'system']),
  title: z.string().min(1).max(200),
  message: z.string().min(1),
  data: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = SendNotificationSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    if (!parsed.data.userId && !parsed.data.astrologerId) {
      return unprocessable('Either userId or astrologerId is required');
    }

    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: parsed.data.userId || null,
        astrologer_id: parsed.data.astrologerId || null,
        type: parsed.data.type,
        title: parsed.data.title,
        message: parsed.data.message,
        data: parsed.data.data || null,
      })
      .select()
      .single();

    if (error) {
      return serverError('Failed to send notification', error.message);
    }

    // TODO: Send push notification via Firebase
    // TODO: Send email via SendGrid
    // TODO: Send SMS via Twilio

    return ok({
      sent: true,
      notificationId: data.id,
      message: 'Notification created in database',
    });
  } catch (err) {
    return serverError('Failed to send notification', (err as Error).message);
  }
}
