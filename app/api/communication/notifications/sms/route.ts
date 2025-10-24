import { z } from 'zod';
import { ok, unprocessable, serverError } from '@/lib/server/http';
import { sendSMS } from '@/lib/server/twilio';

const SMSNotificationSchema = z.object({
  to: z.string().min(10),
  message: z.string().min(1).max(160),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = SMSNotificationSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    // Send SMS via Twilio
    const result = await sendSMS(parsed.data.to, parsed.data.message);

    return ok({
      sent: true,
      to: parsed.data.to,
      sid: result.sid,
      status: result.status,
    });
  } catch (err) {
    return serverError('Failed to send SMS', (err as Error).message);
  }
}
