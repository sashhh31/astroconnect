import { ok, badRequest } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const FALLBACKS: Record<string, string> = {
  aries: 'This week brings opportunities for growth. Focus on relationships and career advancement.',
  taurus: 'Financial stability is on the horizon. Trust your intuition in business matters.',
  gemini: 'Communication flows easily. Great week for networking and new connections.',
  cancer: 'Home and family take center stage. Nurture your emotional well-being.',
  leo: 'Your creativity shines. Take bold steps towards your goals.',
  virgo: 'Attention to detail pays off. Organize and plan for future success.',
  libra: 'Balance is key. Harmonize work and personal life this week.',
  scorpio: 'Transformation continues. Embrace change with confidence.',
  sagittarius: 'Adventure calls. Expand your horizons through learning.',
  capricorn: 'Hard work yields results. Stay disciplined and focused.',
  aquarius: 'Innovation leads the way. Collaborate for best outcomes.',
  pisces: 'Intuition guides you. Trust your creative instincts.',
};

export async function GET(_req: Request, { params }: { params: { sign?: string } }) {
  const sign = (params.sign || '').toLowerCase();
  if (!sign) return badRequest('sign is required');

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  const weekKey = weekStart.toISOString().split('T')[0];

  const supabase = createSupabaseAdmin();

  // Check cache
  const { data: cached } = await supabase
    .from('horoscope_cache')
    .select('content')
    .eq('zodiac_sign', sign)
    .eq('period', 'weekly')
    .eq('date', weekKey)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (cached?.content) {
    return ok(JSON.parse(cached.content));
  }

  // Use fallback (TODO: integrate AstrologyAPI.com)
  const prediction = FALLBACKS[sign] || 'The stars align favorably for you this week.';
  const result = { prediction, sign, weekStart: weekKey, period: 'weekly' };

  // Cache for one week
  const expiresAt = new Date(weekStart);
  expiresAt.setDate(expiresAt.getDate() + 7);

  await supabase.from('horoscope_cache').upsert({
    zodiac_sign: sign,
    period: 'weekly',
    date: weekKey,
    content: JSON.stringify(result),
    expires_at: expiresAt.toISOString(),
  });

  return ok(result);
}
