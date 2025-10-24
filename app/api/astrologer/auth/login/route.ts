import { z } from 'zod';
import { ok, unprocessable, unauthorized, serverError } from '@/lib/server/http';
import { createSupabaseAnon } from '@/lib/server/supabase';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = LoginSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAnon();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error || !data.session) {
      return unauthorized('Invalid credentials');
    }

    return ok({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
      astrologer: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (err) {
    return serverError('Login failed', (err as Error).message);
  }
}
