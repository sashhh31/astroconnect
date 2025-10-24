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

    const { data: consultation } = await supabase
      .from('consultations')
      .select('status')
      .eq('id', id)
      .eq('astrologer_id', user.id)
      .single();

    if (!consultation) {
      return badRequest('Consultation not found');
    }

    if (consultation.status !== 'confirmed' && consultation.status !== 'pending') {
      return badRequest('Consultation cannot be started in current status');
    }

    const { error } = await supabase
      .from('consultations')
      .update({ 
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return serverError('Failed to start consultation', error.message);
    }

    return ok({ started: true, status: 'in_progress', startedAt: new Date().toISOString() });
  } catch (err) {
    return serverError('Failed to start consultation', (err as Error).message);
  }
}
