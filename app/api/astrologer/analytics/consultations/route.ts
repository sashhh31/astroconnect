import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'month';

  try {
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from('consultations')
      .select('status, type, created_at, duration_minutes')
      .eq('astrologer_id', user.id);

    if (error) {
      return serverError('Failed to fetch consultation analytics', error.message);
    }

    const consultations = data || [];

    // Group by status
    const byStatus = consultations.reduce((acc: any, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});

    // Group by type
    const byType = consultations.reduce((acc: any, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {});

    // Calculate average duration
    const completedConsults = consultations.filter(c => c.status === 'completed' && c.duration_minutes);
    const avgDuration = completedConsults.length > 0
      ? completedConsults.reduce((sum, c) => sum + (c.duration_minutes || 0), 0) / completedConsults.length
      : 0;

    return ok({
      period,
      total: consultations.length,
      byStatus,
      byType,
      averageDuration: Math.round(avgDuration),
      completionRate: consultations.length > 0 
        ? ((byStatus.completed || 0) / consultations.length * 100).toFixed(2)
        : 0,
    });
  } catch (err) {
    return serverError('Failed to fetch consultation analytics', (err as Error).message);
  }
}
