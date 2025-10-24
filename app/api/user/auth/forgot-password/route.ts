import { z } from 'zod';
import { ok, unprocessable, serverError } from '@/lib/server/http';
import { createSupabaseAnon } from '@/lib/server/supabase';

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = ForgotPasswordSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAnon();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      return serverError('Failed to send reset email', error.message);
    }

    return ok({
      emailSent: true,
      message: 'Password reset link sent to your email',
    });
  } catch (err) {
    return serverError('Failed to process request', (err as Error).message);
  }
}
