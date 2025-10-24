import { z } from 'zod';
import { unauthorized, ok, badRequest, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const ClientNotesSchema = z.object({
  notes: z.string().min(1),
  consultationId: z.string().uuid(),
});

export async function POST(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return badRequest('Client ID required');

  try {
    const json = await req.json();
    const parsed = ClientNotesSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

    // Verify consultation belongs to this astrologer and client
    const { data: consultation } = await supabase
      .from('consultations')
      .select('id')
      .eq('id', parsed.data.consultationId)
      .eq('user_id', id)
      .eq('astrologer_id', user.id)
      .single();

    if (!consultation) {
      return badRequest('Consultation not found');
    }

    const { error } = await supabase
      .from('consultations')
      .update({ astrologer_notes: parsed.data.notes })
      .eq('id', parsed.data.consultationId);

    if (error) {
      return serverError('Failed to save notes', error.message);
    }

    return ok({ saved: true, notes: parsed.data.notes });
  } catch (err) {
    return serverError('Failed to save client notes', (err as Error).message);
  }
}
