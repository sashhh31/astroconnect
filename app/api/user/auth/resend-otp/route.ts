import { z } from 'zod';
import { ok, unprocessable, serverError } from '@/lib/server/http';
import { createSupabaseAnon } from '@/lib/server/supabase';

const ResendOTPSchema = z.object({
  phone: z.string().min(8),
  type: z.enum(['sms', 'phone_change']).default('sms'),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = ResendOTPSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAnon();
    const { error } = await supabase.auth.signInWithOtp({
      phone: parsed.data.phone,
    });

    if (error) {
      return serverError('Failed to resend OTP', error.message);
    }

    return ok({
      otpSent: true,
      expiresIn: 300,
      message: 'OTP sent successfully',
    });
  } catch (err) {
    return serverError('Failed to resend OTP', (err as Error).message);
  }
}
