import { ok, badRequest } from '@/lib/server/http';

const COMPATIBILITY_MATRIX: Record<string, Record<string, { score: number; description: string }>> = {
  aries: {
    aries: { score: 70, description: 'High energy match with potential for conflict' },
    taurus: { score: 50, description: 'Different paces but complementary strengths' },
    gemini: { score: 85, description: 'Exciting and dynamic partnership' },
    cancer: { score: 45, description: 'Emotional differences require work' },
    leo: { score: 90, description: 'Passionate and powerful connection' },
    virgo: { score: 55, description: 'Practical meets impulsive' },
    libra: { score: 75, description: 'Balanced and harmonious' },
    scorpio: { score: 60, description: 'Intense but challenging' },
    sagittarius: { score: 95, description: 'Adventurous and free-spirited' },
    capricorn: { score: 50, description: 'Different approaches to life' },
    aquarius: { score: 80, description: 'Independent and innovative' },
    pisces: { score: 65, description: 'Complementary but different' },
  },
  // Add more signs as needed - this is a sample
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sign1 = (searchParams.get('sign1') || '').toLowerCase();
  const sign2 = (searchParams.get('sign2') || '').toLowerCase();

  if (!sign1 || !sign2) {
    return badRequest('Both sign1 and sign2 are required');
  }

  const validSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  if (!validSigns.includes(sign1) || !validSigns.includes(sign2)) {
    return badRequest('Invalid zodiac sign');
  }

  // Get compatibility data
  const compatibility = COMPATIBILITY_MATRIX[sign1]?.[sign2] || {
    score: 50,
    description: 'Compatibility data being calculated. Check back soon!',
  };

  const result = {
    sign1,
    sign2,
    compatibilityScore: compatibility.score,
    description: compatibility.description,
    strengths: [
      'Mutual respect and understanding',
      'Shared values and goals',
      'Good communication',
    ],
    challenges: [
      'Different communication styles',
      'Varying emotional needs',
      'Distinct life priorities',
    ],
    advice: 'Focus on open communication and mutual respect. Embrace your differences as opportunities for growth.',
  };

  return ok(result);
}
