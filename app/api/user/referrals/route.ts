import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const supabase = createSupabaseAdmin();

    // Get referrals made by this user
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        referred:users!referrals_referred_id_fkey(full_name, email, created_at)
      `)
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return serverError('Failed to fetch referrals', error.message);
    }

    // Get user's referral code
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    // Generate or get referral code (using user ID as base)
    const referralCode = `REF${user.id.slice(0, 8).toUpperCase()}`;

    const referrals = (data || []).map((ref: any) => ({
      id: ref.id,
      referralCode: ref.referral_code,
      referredUser: ref.referred ? {
        name: ref.referred.full_name,
        email: ref.referred.email,
        joinedAt: ref.referred.created_at,
      } : null,
      bonusAmount: parseFloat(ref.bonus_amount || '0'),
      isClaimed: ref.is_claimed,
      claimedAt: ref.claimed_at,
      createdAt: ref.created_at,
    }));

    return ok({
      referralCode,
      referrals,
      totalReferrals: referrals.length,
      totalEarned: referrals
        .filter((r: any) => r.isClaimed)
        .reduce((sum: number, r: any) => sum + r.bonusAmount, 0),
    });
  } catch (err) {
    return serverError('Failed to fetch referrals', (err as Error).message);
  }
}
