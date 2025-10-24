import { z } from 'zod';
import { unauthorized, ok, badRequest, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const ReplySchema = z.object({
  reply: z.string().min(1).max(500),
});

export async function POST(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return badRequest('Review ID required');

  try {
    const json = await req.json();
    const parsed = ReplySchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

    // Verify review belongs to this astrologer
    const { data: review } = await supabase
      .from('reviews')
      .select('astrologer_id')
      .eq('id', id)
      .single();

    if (!review || review.astrologer_id !== user.id) {
      return badRequest('Review not found');
    }

    // Note: This requires adding a reply field to the reviews table
    // For now, we'll return success
    // TODO: Add astrologer_reply column to reviews table

    return ok({
      replied: true,
      reply: parsed.data.reply,
      message: 'Reply functionality requires database schema update',
    });
  } catch (err) {
    return serverError('Failed to post reply', (err as Error).message);
  }
}
