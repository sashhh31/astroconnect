import { ok, badRequest, serverError } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const FALLBACKS: Record<string, string> = {
  aries: 'Today brings new opportunities. Stay focused on your goals.',
  taurus: 'Financial matters require attention. Trust your instincts.',
  gemini: 'Communication will be key. Share your ideas clearly.',
  cancer: 'Prioritize self-care and emotional balance.',
  leo: 'Lead with confidence but listen to your team.',
  virgo: 'Details matter—double-check important tasks.',
  libra: 'Seek harmony in relationships and decisions.',
  scorpio: 'Transformation is near—embrace change.',
  sagittarius: 'Adventure awaits—be open to learning.',
  capricorn: 'Discipline pays off—stay the course.',
  aquarius: 'Innovate and collaborate for best results.',
  pisces: 'Creativity flows—channel it into action.'
};

export async function GET(_req: Request, { params }: { params: { sign?: string } }) {
  const sign = (params.sign || '').toLowerCase();
  if (!sign) return badRequest('sign is required');

  const today = new Date().toISOString().split('T')[0];
  const supabase = createSupabaseAdmin();

  // Check cache first
  const { data: cached } = await supabase
    .from('horoscope_cache')
    .select('content')
    .eq('zodiac_sign', sign)
    .eq('period', 'daily')
    .eq('date', today)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (cached?.content) {
    const content = JSON.parse(cached.content);
    return ok(content);
  }

  // Use fallback (TODO: integrate AstrologyAPI.com)
  const prediction = FALLBACKS[sign] || 'The stars are aligned in your favor today.';
  const result = { prediction, sign, date: today };

  // Cache the result
  const expiresAt = new Date();
  expiresAt.setHours(23, 59, 59, 999);

  await supabase.from('horoscope_cache').upsert({
    zodiac_sign: sign,
    period: 'daily',
    date: today,
    content: JSON.stringify(result),
    expires_at: expiresAt.toISOString(),
  });

  return ok(result);
}
