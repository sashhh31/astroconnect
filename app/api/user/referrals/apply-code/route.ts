import { z } from 'zod';
import { unauthorized, ok, badRequest, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const ApplyCodeSchema = z.object({
  referralCode: z.string().min(1),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = ApplyCodeSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

    // Extract referrer ID from code (assuming format REF{userId}...)
    const referrerId = parsed.data.referralCode.slice(3, 11).toLowerCase();
    
    // Check if referrer exists
    const { data: referrer } = await supabase
      .from('users')
      .select('id')
      .eq('id', referrerId)
      .single();

    if (!referrer) {
      return badRequest('Invalid referral code');
    }

    // Check if user already used a referral code
    const { data: existing } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', user.id)
      .single();

    if (existing) {
      return badRequest('You have already used a referral code');
    }

    // Check if user is trying to refer themselves
    if (referrerId === user.id) {
      return badRequest('Cannot use your own referral code');
    }

    // Create referral record
    const bonusAmount = 100; // Default bonus
    const { data: referral, error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrerId,
        referred_id: user.id,
        referral_code: parsed.data.referralCode,
        bonus_amount: bonusAmount,
        is_claimed: false,
      })
      .select()
      .single();

    if (error) {
      return serverError('Failed to apply referral code', error.message);
    }

    // Add bonus to referrer's wallet after referred user completes first consultation
    // This would typically be done via a database trigger or background job
    // For now, we'll just create the referral record

    return ok({
      applied: true,
      referralCode: parsed.data.referralCode,
      bonusAmount,
      message: 'Referral code applied successfully. Bonus will be credited after your first consultation.',
    });
  } catch (err) {
    return serverError('Failed to apply referral code', (err as Error).message);
  }
}
