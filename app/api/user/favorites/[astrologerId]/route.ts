import { created, ok, unauthorized, serverError, conflict } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function POST(
  req: Request,
  { params }: { params: { astrologerId?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { astrologerId } = params;
  if (!astrologerId) return serverError('Astrologer ID required');

  const supabase = createSupabaseAdmin();

  const { error } = await supabase
    .from('user_favorites')
    .insert({
      user_id: user.id,
      astrologer_id: astrologerId,
    });

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return conflict('Already in favorites');
    }
    return serverError('Failed to add favorite', error.message);
  }

  return created({ added: true, astrologerId });
}

export async function DELETE(
  req: Request,
  { params }: { params: { astrologerId?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { astrologerId } = params;
  if (!astrologerId) return serverError('Astrologer ID required');

  const supabase = createSupabaseAdmin();

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('astrologer_id', astrologerId);

  if (error) {
    return serverError('Failed to remove favorite', error.message);
  }

  return ok({ removed: true, astrologerId });
}
