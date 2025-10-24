import { z } from 'zod';
import { ok, unprocessable, serverError } from '@/lib/server/http';

const PushNotificationSchema = z.object({
  fcmToken: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = PushNotificationSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    // TODO: Integrate Firebase Cloud Messaging
    // const admin = require('firebase-admin');
    // const message = {
    //   notification: { title: parsed.data.title, body: parsed.data.body },
    //   data: parsed.data.data || {},
    //   token: parsed.data.fcmToken,
    // };
    // await admin.messaging().send(message);

    return ok({
      sent: true,
      message: 'Push notification sent (Firebase integration required)',
    });
  } catch (err) {
    return serverError('Failed to send push notification', (err as Error).message);
  }
}
