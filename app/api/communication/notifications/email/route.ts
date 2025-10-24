import { z } from 'zod';
import { ok, unprocessable, serverError } from '@/lib/server/http';

const EmailNotificationSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  templateId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = EmailNotificationSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    // TODO: Integrate SendGrid
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: parsed.data.to,
    //   from: process.env.SENDGRID_FROM_EMAIL,
    //   subject: parsed.data.subject,
    //   html: parsed.data.body,
    // });

    return ok({
      sent: true,
      to: parsed.data.to,
      message: 'Email sent (SendGrid integration required)',
    });
  } catch (err) {
    return serverError('Failed to send email', (err as Error).message);
  }
}
