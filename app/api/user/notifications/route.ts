import { ok, unauthorized, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const supabase = createSupabaseAdmin();
  
  const { data, error, count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError('Failed to fetch notifications', error.message);
  }

  const notifications = (data || []).map((n: any) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    data: n.data,
    isRead: n.is_read,
    readAt: n.read_at,
    createdAt: n.created_at,
  }));

  return ok({ notifications, total: count || 0, page, limit });
}
