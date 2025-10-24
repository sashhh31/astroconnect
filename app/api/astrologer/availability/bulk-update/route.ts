import { z } from 'zod';
import { unauthorized, ok, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const BulkAvailabilitySchema = z.object({
  availability: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    isAvailable: z.boolean().default(true),
  })),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = BulkAvailabilitySchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

    // Delete existing availability
    await supabase
      .from('astrologer_availability')
      .delete()
      .eq('astrologer_id', user.id);

    // Insert new availability
    const availabilityToInsert = parsed.data.availability.map(a => ({
      astrologer_id: user.id,
      day_of_week: a.dayOfWeek,
      start_time: a.startTime,
      end_time: a.endTime,
      is_available: a.isAvailable,
    }));

    const { data, error } = await supabase
      .from('astrologer_availability')
      .insert(availabilityToInsert)
      .select();

    if (error) {
      return serverError('Failed to update availability', error.message);
    }

    return ok({ 
      updated: true, 
      count: data?.length || 0,
      availability: data,
    });
  } catch (err) {
    return serverError('Failed to bulk update availability', (err as Error).message);
  }
}
