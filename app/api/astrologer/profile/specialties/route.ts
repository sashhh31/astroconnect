import { z } from 'zod';
import { unauthorized, ok, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const SpecialtiesSchema = z.object({
  specialtyIds: z.array(z.string().uuid()),
});

export async function PUT(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = SpecialtiesSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

    // Delete existing specialties
    await supabase
      .from('astrologer_specialties')
      .delete()
      .eq('astrologer_id', user.id);

    // Insert new specialties
    if (parsed.data.specialtyIds.length > 0) {
      const specialtiesToInsert = parsed.data.specialtyIds.map(specialtyId => ({
        astrologer_id: user.id,
        specialty_id: specialtyId,
      }));

      const { error: insertError } = await supabase
        .from('astrologer_specialties')
        .insert(specialtiesToInsert);

      if (insertError) {
        return serverError('Failed to update specialties', insertError.message);
      }
    }

    return ok({
      updated: true,
      specialtyIds: parsed.data.specialtyIds,
      message: 'Specialties updated successfully',
    });
  } catch (err) {
    return serverError('Failed to update specialties', (err as Error).message);
  }
}
