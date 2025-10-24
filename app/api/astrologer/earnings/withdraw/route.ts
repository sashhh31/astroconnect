import { z } from 'zod';
import { unauthorized, ok, badRequest, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const WithdrawSchema = z.object({
  amount: z.number().positive(),
  bankAccount: z.string().min(1),
  ifscCode: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = WithdrawSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();

    // Get astrologer's available balance
    const { data: astrologer } = await supabase
      .from('astrologers')
      .select('total_earnings')
      .eq('id', user.id)
      .single();

    const availableBalance = parseFloat(astrologer?.total_earnings || '0') * 0.80; // After commission

    if (parsed.data.amount > availableBalance) {
      return badRequest('Insufficient balance');
    }

    // TODO: Integrate with payment gateway for actual withdrawal
    // For now, just create a record

    // Deduct from total earnings
    const newEarnings = parseFloat(astrologer?.total_earnings || '0') - (parsed.data.amount / 0.80);
    await supabase
      .from('astrologers')
      .update({ total_earnings: newEarnings })
      .eq('id', user.id);

    return ok({
      withdrawn: true,
      amount: parsed.data.amount,
      bankAccount: parsed.data.bankAccount,
      status: 'pending',
      message: 'Withdrawal request submitted. Processing within 3-5 business days.',
    });
  } catch (err) {
    return serverError('Failed to process withdrawal', (err as Error).message);
  }
}
