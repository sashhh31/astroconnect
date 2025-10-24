import { ok, unauthorized, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorized();

    const supabase = createSupabaseAdmin();
    const { error } = await supabase.auth.admin.signOut(user.id);

    if (error) {
      return serverError('Logout failed', error.message);
    }

    return ok({ message: 'Logged out successfully' });
  } catch (err) {
    return serverError('Logout failed', (err as Error).message);
  }
}
