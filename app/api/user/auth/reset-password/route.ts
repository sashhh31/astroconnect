import { z } from 'zod';
import { ok, unprocessable, unauthorized, serverError } from '@/lib/server/http';
import { createSupabaseAnon } from '@/lib/server/supabase';

const ResetPasswordSchema = z.object({
  password: z.string().min(8),
  token: z.string().optional(), // Access token from reset link
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = ResetPasswordSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAnon();
    
    // If token provided, set session first
    if (parsed.data.token) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: parsed.data.token,
        refresh_token: '', // Not needed for password reset
      });
      if (sessionError) {
        return unauthorized('Invalid or expired reset token');
      }
    }

    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });

    if (error) {
      return serverError('Failed to reset password', error.message);
    }

    return ok({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (err) {
    return serverError('Failed to reset password', (err as Error).message);
  }
}
