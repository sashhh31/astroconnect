import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const supabase = createSupabaseAdmin();

    // Get user birth details
    const { data, error } = await supabase
      .from('users')
      .select('date_of_birth, time_of_birth, place_of_birth')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      return serverError('Failed to fetch birth details', error?.message);
    }

    // TODO: Integrate with Astrology API to generate actual birth chart
    // For now, return basic birth details
    const birthChart = {
      dateOfBirth: data.date_of_birth,
      timeOfBirth: data.time_of_birth,
      placeOfBirth: data.place_of_birth,
      // Placeholder data - replace with actual API integration
      sunSign: 'Aries',
      moonSign: 'Taurus',
      ascendant: 'Gemini',
      planets: {
        sun: { sign: 'Aries', house: 1 },
        moon: { sign: 'Taurus', house: 2 },
        mercury: { sign: 'Aries', house: 1 },
        venus: { sign: 'Pisces', house: 12 },
        mars: { sign: 'Aquarius', house: 11 },
      },
      message: 'Birth chart calculation requires Astrology API integration',
    };

    return ok(birthChart);
  } catch (err) {
    return serverError('Failed to generate birth chart', (err as Error).message);
  }
}
