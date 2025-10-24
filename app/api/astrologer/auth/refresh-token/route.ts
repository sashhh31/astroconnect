import { z } from 'zod';
import { ok, unprocessable, unauthorized, serverError } from '@/lib/server/http';
import { createSupabaseAnon } from '@/lib/server/supabase';

const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = RefreshSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAnon();
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: parsed.data.refreshToken,
    });

    if (error || !data.session) {
      return unauthorized('Invalid refresh token');
    }

    return ok({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    });
  } catch (err) {
    return serverError('Token refresh failed', (err as Error).message);
  }
}
