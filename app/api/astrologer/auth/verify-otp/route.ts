import { z } from 'zod';
import { ok, unprocessable, unauthorized, serverError } from '@/lib/server/http';
import { createSupabaseAnon } from '@/lib/server/supabase';

const VerifyOTPSchema = z.object({
  phone: z.string().min(8),
  token: z.string().min(6),
  type: z.enum(['sms', 'phone_change']).default('sms'),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = VerifyOTPSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAnon();
    const { data, error } = await supabase.auth.verifyOtp({
      phone: parsed.data.phone,
      token: parsed.data.token,
      type: parsed.data.type,
    });

    if (error || !data.session) {
      return unauthorized('Invalid or expired OTP');
    }

    return ok({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      verified: true,
    });
  } catch (err) {
    return serverError('OTP verification failed', (err as Error).message);
  }
}
