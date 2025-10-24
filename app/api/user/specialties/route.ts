import { ok, serverError } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET() {
  const supabase = createSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('specialties')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    return serverError('Failed to fetch specialties', error.message);
  }

  const specialties = (data || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    icon: s.icon,
    color: s.color,
  }));

  return ok({ specialties });
}
