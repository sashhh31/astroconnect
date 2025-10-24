import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    // Generate unique referral code based on user ID
    const referralCode = `REF${user.id.slice(0, 8).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;

    return ok({
      referralCode,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/signup?ref=${referralCode}`,
      message: 'Referral code generated successfully',
    });
  } catch (err) {
    return serverError('Failed to generate referral code', (err as Error).message);
  }
}
