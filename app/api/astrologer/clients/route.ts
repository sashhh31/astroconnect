import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const supabase = createSupabaseAdmin();

    // Get unique users who had consultations with this astrologer
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        user_id,
        users(id, full_name, email, phone, profile_image_url, created_at)
      `)
      .eq('astrologer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return serverError('Failed to fetch clients', error.message);
    }

    // Get unique clients with consultation count
    const clientsMap = new Map();
    (data || []).forEach((c: any) => {
      if (c.users && !clientsMap.has(c.user_id)) {
        clientsMap.set(c.user_id, {
          ...c.users,
          consultationCount: 1,
        });
      } else if (c.users) {
        const client = clientsMap.get(c.user_id);
        client.consultationCount++;
      }
    });

    const clients = Array.from(clientsMap.values())
      .slice(offset, offset + limit)
      .map((client: any) => ({
        id: client.id,
        fullName: client.full_name,
        email: client.email,
        phone: client.phone,
        profileImageUrl: client.profile_image_url,
        consultationCount: client.consultationCount,
        firstConsultation: client.created_at,
      }));

    return ok({ clients, total: clientsMap.size, page, limit });
  } catch (err) {
    return serverError('Failed to fetch clients', (err as Error).message);
  }
}
