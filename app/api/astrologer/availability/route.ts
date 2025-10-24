import { z } from 'zod';
import { unauthorized, ok, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const AvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  isAvailable: z.boolean().default(true),
});

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from('astrologer_availability')
      .select('*')
      .eq('astrologer_id', user.id)
      .order('day_of_week');

    if (error) {
      return serverError('Failed to fetch availability', error.message);
    }

    return ok({ availability: data || [] });
  } catch (err) {
    return serverError('Failed to fetch availability', (err as Error).message);
  }
}

export async function PUT(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = AvailabilitySchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from('astrologer_availability')
      .upsert({
        astrologer_id: user.id,
        day_of_week: parsed.data.dayOfWeek,
        start_time: parsed.data.startTime,
        end_time: parsed.data.endTime,
        is_available: parsed.data.isAvailable,
      })
      .select()
      .single();

    if (error) {
      return serverError('Failed to update availability', error.message);
    }

    return ok({ updated: true, availability: data });
  } catch (err) {
    return serverError('Failed to update availability', (err as Error).message);
  }
}
