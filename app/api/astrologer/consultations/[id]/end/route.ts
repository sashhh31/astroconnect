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
      .select('status, started_at')
      .eq('id', id)
      .eq('astrologer_id', user.id)
      .single();

    if (!consultation) {
      return badRequest('Consultation not found');
    }

    if (consultation.status !== 'in_progress') {
      return badRequest('Consultation is not in progress');
    }

    // Calculate duration
    const startedAt = new Date(consultation.started_at);
    const endedAt = new Date();
    const durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);

    const { error } = await supabase
      .from('consultations')
      .update({ 
        status: 'completed',
        ended_at: endedAt.toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq('id', id);

    if (error) {
      return serverError('Failed to end consultation', error.message);
    }

    // Update astrologer stats
    await supabase.rpc('increment_astrologer_consultations', { astrologer_id: user.id });

    return ok({ 
      ended: true, 
      status: 'completed', 
      endedAt: endedAt.toISOString(),
      durationMinutes,
    });
  } catch (err) {
    return serverError('Failed to end consultation', (err as Error).message);
  }
}
