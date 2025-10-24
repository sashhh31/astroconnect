import { unauthorized, ok, badRequest, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function PUT(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return badRequest('Consultation ID required');

  try {
    const supabase = createSupabaseAdmin();

    // Verify consultation belongs to astrologer and is pending
    const { data: consultation } = await supabase
      .from('consultations')
      .select('status')
      .eq('id', id)
      .eq('astrologer_id', user.id)
      .single();

    if (!consultation) {
      return badRequest('Consultation not found');
    }

    if (consultation.status !== 'pending') {
      return badRequest('Consultation cannot be accepted in current status');
    }

    const { error } = await supabase
      .from('consultations')
      .update({ status: 'confirmed' })
      .eq('id', id);

    if (error) {
      return serverError('Failed to accept consultation', error.message);
    }

    // TODO: Send notification to user

    return ok({ accepted: true, status: 'confirmed' });
  } catch (err) {
    return serverError('Failed to accept consultation', (err as Error).message);
  }
}
