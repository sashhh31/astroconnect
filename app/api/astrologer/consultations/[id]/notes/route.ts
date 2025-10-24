import { z } from 'zod';
import { unauthorized, ok, badRequest, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const NotesSchema = z.object({
  notes: z.string().min(1),
});

export async function POST(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return badRequest('Consultation ID required');

  try {
    const json = await req.json();
    const parsed = NotesSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

    // Verify consultation belongs to astrologer
    const { data: consultation } = await supabase
      .from('consultations')
      .select('id')
      .eq('id', id)
      .eq('astrologer_id', user.id)
      .single();

    if (!consultation) {
      return badRequest('Consultation not found');
    }

    const { error } = await supabase
      .from('consultations')
      .update({ astrologer_notes: parsed.data.notes })
      .eq('id', id);

    if (error) {
      return serverError('Failed to save notes', error.message);
    }

    return ok({ saved: true, notes: parsed.data.notes });
  } catch (err) {
    return serverError('Failed to save notes', (err as Error).message);
  }
}
