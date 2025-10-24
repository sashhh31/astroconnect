import { ok, badRequest } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const FALLBACKS: Record<string, string> = {
  aries: 'A transformative month ahead. Career opportunities and personal growth merge beautifully.',
  taurus: 'Financial prosperity and stability dominate. Investments made now will flourish.',
  gemini: 'Communication and learning take priority. Expand your knowledge and network.',
  cancer: 'Emotional depth and family connections strengthen. Home improvements bring joy.',
  leo: 'Leadership opportunities arise. Your charisma attracts success and recognition.',
  virgo: 'Organization and planning lead to major achievements. Health improves significantly.',
  libra: 'Relationships deepen. Balance and harmony create lasting partnerships.',
  scorpio: 'Intense transformation continues. Power and passion drive your ambitions.',
  sagittarius: 'Travel and education expand horizons. Adventure brings wisdom.',
  capricorn: 'Professional success peaks. Your dedication earns well-deserved rewards.',
  aquarius: 'Innovation and originality shine. Humanitarian efforts gain momentum.',
  pisces: 'Spiritual growth and creativity flourish. Intuition guides important decisions.',
};

export async function GET(_req: Request, { params }: { params: { sign?: string } }) {
  const sign = (params.sign || '').toLowerCase();
  if (!sign) return badRequest('sign is required');

  const today = new Date();
  const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;

  const supabase = createSupabaseAdmin();

  // Check cache
  const { data: cached } = await supabase
    .from('horoscope_cache')
    .select('content')
    .eq('zodiac_sign', sign)
    .eq('period', 'monthly')
    .eq('date', monthKey)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (cached?.content) {
    return ok(JSON.parse(cached.content));
  }

  // Use fallback (TODO: integrate AstrologyAPI.com)
  const prediction = FALLBACKS[sign] || 'This month brings positive energy and opportunities.';
  const result = { prediction, sign, month: monthKey, period: 'monthly' };

  // Cache for one month
  const expiresAt = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  await supabase.from('horoscope_cache').upsert({
    zodiac_sign: sign,
    period: 'monthly',
    date: monthKey,
    content: JSON.stringify(result),
    expires_at: expiresAt.toISOString(),
  });

  return ok(result);
}
